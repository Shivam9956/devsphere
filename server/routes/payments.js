const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// ── Stripe (existing) ──────────────────────────────────────────────────────
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Plan = require('../models/Plan');

const planPrices = {
  basic:     { amount: 299,  name: 'Basic Website' },
  advanced:  { amount: 799,  name: 'Advanced Website' },
  fullstack: { amount: 1499, name: 'Full Stack App' },
  marketing: { amount: 199,  name: 'Digital Marketing' }
};

// Stripe checkout
router.post('/create-session', async (req, res) => {
  try {
    const { plan, name, email, projectId } = req.body;
    let amount, title, metadata = { customerName: name };

    if (projectId) {
      const ClientProject = require('../models/ClientProject');
      const project = await ClientProject.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      amount = project.budget;
      title = project.title;
      metadata.projectId = projectId;
      metadata.plan = 'custom_project';
    } else {
      const planDoc = await Plan.findOne({ id: plan });
      if (planDoc) {
        amount = planDoc.priceUSD;
        title = planDoc.name;
      } else {
        const planData = planPrices[plan];
        if (!planData) return res.status(400).json({ message: 'Invalid plan' });
        amount = planData.amount;
        title = planData.name;
      }
      metadata.plan = plan;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: title, description: `DevSphere Global - ${title}` },
          unit_amount: amount * 100
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify Stripe session
router.get('/verify/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    if (session.payment_status === 'paid') {
      const plan = session.metadata?.plan || 'basic';
      const customerName = session.metadata?.customerName || 'Stripe Customer';
      const email = session.customer_details?.email || session.customer_email || '';
      
      const projectId = session.metadata?.projectId;
      const Payment = require('../models/Payment');
      const Earning = require('../models/Earning');
      const User = require('../models/User');
      const ClientProject = require('../models/ClientProject');
      
      let amount, title;
      if (projectId) {
        const project = await ClientProject.findById(projectId);
        if (project) {
          amount = project.budget || 0;
          title = project.title;
          project.paymentStatus = 'Paid';
          await project.save();
        } else {
          amount = session.amount_total / 100;
          title = 'Custom Project';
        }
      } else {
        const planDoc = await Plan.findOne({ id: plan });
        if (planDoc) {
          amount = planDoc.priceUSD;
          title = planDoc.name;
        } else {
          const planData = planPrices[plan] || { amount: 299, name: 'Basic Website' };
          amount = planData.amount;
          title = planData.name;
        }
      }
      
      // 1. Find or create Payment record
      let payment = await Payment.findOne({ stripeSessionId: sessionId });
      if (!payment) {
        // Find user by email to associate payment
        const user = await User.findOne({ email: email.toLowerCase() });
        payment = await Payment.create({
          client: user ? user._id : undefined,
          name: customerName,
          email: email,
          plan: plan,
          amount: amount,
          currency: 'usd',
          stripeSessionId: sessionId,
          status: 'paid'
        });
      }
      
      // 2. Find or create Earning record
      let earning = await Earning.findOne({ note: `Stripe Session: ${sessionId}` });
      if (!earning) {
        earning = await Earning.create({
          title: `Payment for ${title}`,
          amount: amount,
          currency: 'USD',
          client: customerName,
          category: plan === 'marketing' ? 'Other' : 'Website Development',
          status: 'Received',
          date: new Date(),
          note: `Stripe Session: ${sessionId}`
        });
      }
      
      // 3. Automatically assign/create a ClientProject if client is registered (only for plan purchases)
      if (!projectId) {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          let project = await ClientProject.findOne({ client: user._id, title: title });
          if (!project) {
            await ClientProject.create({
              client: user._id,
              title: title,
              description: `Automated project creation from Stripe payment. Plan: ${title}`,
              status: 'Pending',
              progress: 0,
              budget: amount
            });
          }
        }
      }
      
      return res.json({ success: true, payment });
    } else {
      return res.json({ success: false, message: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Stripe verification error:', err);
    res.status(500).json({ message: err.message });
  }
});


// ── Razorpay ───────────────────────────────────────────────────────────────
const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/razorpay/create-order', async (req, res) => {
  try {
    const { plan, currency = 'INR', projectId } = req.body;
    let usdAmount, title, notes = {};

    if (projectId) {
      const ClientProject = require('../models/ClientProject');
      const project = await ClientProject.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      usdAmount = project.budget;
      title = project.title;
      notes.projectId = projectId;
      notes.plan = 'custom_project';
    } else {
      const planDoc = await Plan.findOne({ id: plan });
      if (planDoc) {
        usdAmount = planDoc.priceUSD;
        title = planDoc.name;
      } else {
        const planData = planPrices[plan];
        if (!planData) return res.status(400).json({ message: 'Invalid plan' });
        usdAmount = planData.amount;
        title = planData.name;
      }
      notes.plan = plan;
    }

    // Convert USD to INR (approx)
    const inrAmount = Math.round(usdAmount * 83.5);
    const amount = currency === 'INR' ? inrAmount : usdAmount;

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency,
      receipt: `receipt_${projectId || plan}_${Date.now()}`,
      notes
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planName: title
    });
  } catch (err) {
    console.error('Razorpay error:', err);
    res.status(500).json({ message: 'Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env' });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, projectId, email, name } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');

    if (expectedSign === razorpay_signature) {
      const Payment = require('../models/Payment');
      const Earning = require('../models/Earning');
      const User = require('../models/User');
      
      let amount = 0;
      let title = 'Razorpay Payment';

      if (projectId) {
        const ClientProject = require('../models/ClientProject');
        const project = await ClientProject.findById(projectId);
        if (project) {
          project.paymentStatus = 'Paid';
          await project.save();
          amount = project.budget || 0;
          title = project.title;
        }
      }

      const user = await User.findOne({ email: (email || '').toLowerCase() });
      await Payment.create({
        client: user ? user._id : undefined,
        name: name || 'Razorpay Customer',
        email: email || 'no-email@razorpay.com',
        plan: projectId ? 'custom_project' : 'razorpay',
        amount: amount,
        currency: 'usd',
        stripeSessionId: razorpay_payment_id,
        status: 'paid'
      });

      await Earning.create({
        title: `Payment for ${title}`,
        amount: amount,
        currency: 'USD',
        client: name || 'Razorpay Customer',
        category: 'Website Development',
        status: 'Received',
        date: new Date(),
        note: `Razorpay Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`
      });

      res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PayPal ─────────────────────────────────────────────────────────────────
// Create PayPal order
router.post('/paypal/create-order', async (req, res) => {
  try {
    const { plan, projectId } = req.body;
    let usdAmount, title;

    if (projectId) {
      const ClientProject = require('../models/ClientProject');
      const project = await ClientProject.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      usdAmount = project.budget;
      title = project.title;
    } else {
      const planDoc = await Plan.findOne({ id: plan });
      if (planDoc) {
        usdAmount = planDoc.priceUSD;
        title = planDoc.name;
      } else {
        const planData = planPrices[plan];
        if (!planData) return res.status(400).json({ message: 'Invalid plan' });
        usdAmount = planData.amount;
        title = planData.name;
      }
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const base = process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    // Get access token
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });
    const { access_token } = await tokenRes.json();

    // Create order
    const purchaseUnit = {
      amount: { currency_code: 'USD', value: usdAmount.toString() },
      description: `DevSphere Global - ${title}`
    };
    if (projectId) {
      purchaseUnit.custom_id = projectId.toString();
    }

    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [purchaseUnit],
        application_context: {
          return_url: `${process.env.CLIENT_URL}/payment/success`,
          cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
        }
      })
    });

    const order = await orderRes.json();
    console.log('PayPal order response:', JSON.stringify(order, null, 2));
    const approveUrl = order.links?.find(l => l.rel === 'approve')?.href;
    if (!approveUrl) {
      console.error('No approve URL in PayPal response');
      return res.status(500).json({ message: 'PayPal order creation failed: ' + (order.message || 'No approve URL') });
    }
    res.json({ orderId: order.id, approveUrl });
  } catch (err) {
    console.error('PayPal error:', err);
    res.status(500).json({ message: 'PayPal not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env' });
  }
});

// Capture PayPal order
router.post('/paypal/capture/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { name, email } = req.body;
    
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const base = process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    // Get access token
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });
    const { access_token } = await tokenRes.json();

    // Capture order
    const captureRes = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    });

    const captureData = await captureRes.json();
    console.log('PayPal capture response:', JSON.stringify(captureData, null, 2));

    if (captureData.status === 'COMPLETED') {
      const purchaseUnit = captureData.purchase_units?.[0];
      const projectId = purchaseUnit?.payments?.captures?.[0]?.custom_id || purchaseUnit?.custom_id;
      const amountValue = purchaseUnit?.payments?.captures?.[0]?.amount?.value || purchaseUnit?.amount?.value;
      const payerEmail = captureData.payer?.email_address || email || '';
      const payerName = [captureData.payer?.name?.given_name, captureData.payer?.name?.surname].filter(Boolean).join(' ') || name || 'PayPal Customer';

      const Payment = require('../models/Payment');
      const Earning = require('../models/Earning');
      const User = require('../models/User');
      const ClientProject = require('../models/ClientProject');

      let amount = parseFloat(amountValue) || 0;
      let title = 'PayPal Custom Payment';

      if (projectId) {
        const project = await ClientProject.findById(projectId);
        if (project) {
          project.paymentStatus = 'Paid';
          await project.save();
          amount = project.budget || amount;
          title = project.title;
        }
      }

      const user = await User.findOne({ email: payerEmail.toLowerCase() });
      await Payment.create({
        client: user ? user._id : undefined,
        name: payerName,
        email: payerEmail,
        plan: projectId ? 'custom_project' : 'paypal',
        amount: amount,
        currency: 'usd',
        stripeSessionId: orderId,
        status: 'paid'
      });

      await Earning.create({
        title: `Payment for ${title}`,
        amount: amount,
        currency: 'USD',
        client: payerName,
        category: 'Website Development',
        status: 'Received',
        date: new Date(),
        note: `PayPal Order: ${orderId}`
      });

      res.json({ success: true, captureData });
    } else {
      res.status(400).json({ success: false, message: 'PayPal payment not completed' });
    }
  } catch (err) {
    console.error('PayPal capture error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

