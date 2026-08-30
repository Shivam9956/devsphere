const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');

// ── Stripe (existing) ──────────────────────────────────────────────────────
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Plan = require('../models/Plan');

const planPrices = {
  basic:     { amount: 299,  name: 'Basic Website' },
  advanced:  { amount: 799,  name: 'Advanced Website' },
  fullstack: { amount: 1499, name: 'Full Stack App' },
  marketing: { amount: 199,  name: 'Digital Marketing' }
};

// Stripe checkout (Disabled)
router.post('/create-session', async (req, res) => {
  return res.status(400).json({ message: 'Stripe payment is disabled' });
});

// Verify Stripe session (Disabled)
router.get('/verify/:sessionId', async (req, res) => {
  return res.status(400).json({ message: 'Stripe payment is disabled' });
});


// ── Razorpay ───────────────────────────────────────────────────────────────
const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrderHandler = async (req, res) => {
  try {
    // 1. Auth check
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET ||
        process.env.RAZORPAY_KEY_ID === 'PASTE_YOUR_RAZORPAY_KEY_ID_HERE' ||
        process.env.RAZORPAY_KEY_SECRET === 'PASTE_YOUR_RAZORPAY_KEY_SECRET_HERE') {
      return res.status(401).json({ message: 'Razorpay API credentials are not configured or invalid' });
    }

    const { amount, currency = 'INR', receipt, plan, projectId } = req.body;

    let amountInPaise;
    let title = 'Razorpay Payment';
    let notes = {};

    // Check if amount is provided directly in request body
    if (amount !== undefined) {
      amountInPaise = Number(amount);
      if (isNaN(amountInPaise) || amountInPaise < 100) {
        return res.status(400).json({ message: 'Amount must be a number and at least 100 paise' });
      }
      notes.type = 'direct_payment';
    } else {
      // Fallback to existing logic using plan or projectId
      let usdAmount;
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
          if (!planData) return res.status(400).json({ message: 'Invalid plan or amount' });
          usdAmount = planData.amount;
          title = planData.name;
        }
        notes.plan = plan;
      }

      // Convert USD to INR (approx)
      const inrAmount = Math.round(usdAmount * 83.5);
      const calculatedAmount = currency === 'INR' ? inrAmount : usdAmount;
      amountInPaise = calculatedAmount * 100;
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${projectId || plan || 'direct'}_${Date.now()}`,
      notes
    });

    res.json({
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planName: title
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    if (err.statusCode === 401 || (err.message && err.message.toLowerCase().includes('auth'))) {
      return res.status(401).json({ message: 'Razorpay authentication failed' });
    }
    res.status(500).json({ message: err.message || 'Razorpay order creation failed' });
  }
};

const verifyPaymentHandler = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, projectId, email, name } = req.body;

    // Validate missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(sign).digest('hex');

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
      try {
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
      } catch (dbErr) {
        console.warn('DB log skipped:', dbErr.message);
      }

      res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Razorpay verification error:', err);
    res.status(500).json({ message: err.message || 'Verification failed' });
  }
};

router.post('/razorpay/create-order', createOrderHandler);
router.post('/razorpay/verify', verifyPaymentHandler);

// ── PayPal ─────────────────────────────────────────────────────────────────
const getPayPalClient = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = process.env.PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  return new paypal.core.PayPalHttpClient(environment);
};

const paypalCreateOrderHandler = async (req, res) => {
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
      const Plan = require('../models/Plan');
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

    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: usdAmount.toString()
        },
        description: `DevSphere Global - ${title}`,
        custom_id: projectId ? projectId.toString() : plan
      }],
      application_context: {
        return_url: `${process.env.CLIENT_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
      }
    });

    const response = await client.execute(request);
    const orderId = response.result.id;
    const approveUrl = response.result.links?.find(l => l.rel === 'approve')?.href;

    res.json({ orderId, approveUrl });
  } catch (err) {
    console.error('PayPal create order error:', err);
    res.status(500).json({ message: err.message || 'PayPal order creation failed' });
  }
};

const paypalCaptureOrderHandler = async (req, res) => {
  try {
    const orderId = req.params.orderId || req.body.orderId || req.body.orderID;
    const { name, email } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderID' });
    }

    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await client.execute(request);
    const captureData = response.result;

    if (captureData.status === 'COMPLETED') {
      const purchaseUnit = captureData.purchase_units?.[0];
      const customId = purchaseUnit?.payments?.captures?.[0]?.custom_id || purchaseUnit?.custom_id;
      const amountValue = purchaseUnit?.payments?.captures?.[0]?.amount?.value || purchaseUnit?.amount?.value;
      const payerEmail = captureData.payer?.email_address || email || '';
      const payerName = [captureData.payer?.name?.given_name, captureData.payer?.name?.surname].filter(Boolean).join(' ') || name || 'PayPal Customer';

      const Payment = require('../models/Payment');
      const Earning = require('../models/Earning');
      const User = require('../models/User');
      const ClientProject = require('../models/ClientProject');

      let amount = parseFloat(amountValue) || 0;
      let title = 'PayPal Custom Payment';

      // Check if customId matches a project ID
      let projectId = null;
      if (customId && customId.match(/^[0-9a-fA-F]{24}$/)) {
        projectId = customId;
      }

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
      try {
        await Payment.create({
          client: user ? user._id : undefined,
          name: payerName,
          email: payerEmail,
          plan: projectId ? 'custom_project' : (customId || 'paypal'),
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
      } catch (dbErr) {
        console.warn('DB recording skipped/failed:', dbErr.message);
      }

      res.json({ success: true, captureData });
    } else {
      res.status(400).json({ success: false, message: 'PayPal payment not completed' });
    }
  } catch (err) {
    console.error('PayPal capture error:', err);
    res.status(500).json({ message: err.message || 'PayPal capture failed' });
  }
};

router.post('/paypal/create-order', paypalCreateOrderHandler);
router.post('/paypal/capture-order', paypalCaptureOrderHandler);
router.post('/paypal/capture/:orderId', paypalCaptureOrderHandler);

module.exports = router;
module.exports.createOrderHandler = createOrderHandler;
module.exports.verifyPaymentHandler = verifyPaymentHandler;
module.exports.paypalCreateOrderHandler = paypalCreateOrderHandler;
module.exports.paypalCaptureOrderHandler = paypalCaptureOrderHandler;

