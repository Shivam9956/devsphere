const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Plan = require('../models/Plan');

// ─── Static Portfolio Context ────────────────────────────────────────────────
const BASE_CONTEXT = `
You are an AI sales assistant for DevSphere Global, a professional web development agency run by Shivam Maurya.

━━━ ABOUT ━━━
DevSphere Global builds modern, high-performance websites and web applications.
Owner: Shivam Maurya
Email: devsphereglobal@gmail.com
WhatsApp: +918353949006
Website: http://localhost:3000

━━━ SERVICES ━━━
- Landing Pages & Business Websites
- E-commerce Stores (with payment gateway)
- Full Stack Web Applications
- Admin Dashboards & CRM Systems
- REST API Development
- UI/UX Design
- Mobile-Responsive Design
- SEO Optimization
- Cloud Deployment (Vercel, Render, AWS)
`;

// ─── Build dynamic context with live projects & plans ────────────────────────
async function buildContext() {
  try {
    const plans = await Plan.find({}).sort({ order: 1 });
    let pricingSection = '\n━━━ PRICING PLANS ━━━\n\n';

    if (plans && plans.length > 0) {
      plans.forEach((plan, i) => {
        pricingSection += `${i + 1}. ${plan.name} — $${plan.priceUSD} (approx. ₹${plan.priceINR})\n`;
        if (plan.desc) pricingSection += `   Description: ${plan.desc}\n`;
        if (plan.features && plan.features.length > 0) {
          plan.features.forEach(f => {
            pricingSection += `   ✓ ${f}\n`;
          });
        }
        if (plan.popular) {
          pricingSection += `   ⭐ Most Popular\n`;
        }
        pricingSection += `   Best for: suitable client projects\n\n`;
      });
    } else {
      pricingSection += `1. Basic Website — $299\n   ✓ 5-page responsive website\n   ✓ Mobile optimized\n   ✓ Contact form\n   ✓ Basic SEO\n   ✓ 1 month support\n   ✓ Fast delivery (7 days)\n   Best for: Small businesses, personal brands, portfolios\n\n2. Advanced Website — $799 ⭐ Most Popular\n   ✓ Up to 15 pages\n   ✓ CMS integration\n   ✓ Blog/News section\n   ✓ Advanced SEO\n   ✓ Payment integration\n   ✓ Admin dashboard\n   ✓ 3 months support\n   Best for: Growing businesses, startups, online stores\n\n3. Full Stack App — $1499\n   ✓ Custom web application\n   ✓ REST API development\n   ✓ Database design\n   ✓ Authentication system\n   ✓ Admin panel\n   ✓ Cloud deployment\n   ✓ 6 months support\n   ✓ Priority support\n   Best for: SaaS products, complex platforms, enterprise tools\n\n`;
    }

    const projects = await Project.find({}).sort({ featured: -1, createdAt: -1 }).limit(10);
    const projectList = projects.map((p, i) =>
      `${i + 1}. ${p.title} [${p.category}]
   Tech: ${p.techStack?.join(', ') || 'N/A'}
   ${p.description}
   ${p.liveUrl ? `Live Demo: ${p.liveUrl}` : ''}
   ${p.githubUrl ? `GitHub: ${p.githubUrl}` : ''}
   ${p.images?.length ? `Images available: yes` : ''}`
    ).join('\n\n');

    return BASE_CONTEXT + pricingSection + `
━━━ CUSTOM QUOTES ━━━
For projects outside these plans (mobile apps, large platforms, custom integrations), custom quotes are available. Client should contact via WhatsApp or email.

━━━ TECH STACK ━━━
Frontend: React.js, Next.js, HTML/CSS, Tailwind, Framer Motion
Backend: Node.js, Express.js
Database: MongoDB, MySQL
Payments: Stripe
Storage: Cloudinary
Deployment: Vercel, Render, AWS

━━━ YOUR ROLE ━━━
- Help visitors understand which plan fits their needs
- Show them relevant demo projects from the portfolio
- Encourage them to get started or contact for custom quotes
- Be friendly, concise, and sales-oriented
- When a client describes their project, suggest the most suitable plan
- Always mention they can visit /pricing page or /contact page
- Keep responses short (2-4 sentences max unless listing features)
- Use emojis occasionally to stay friendly
` + (projectList ? `\n━━━ PORTFOLIO PROJECTS (use these as demos) ━━━\n${projectList}\n
When a client asks for demos or examples, reference these real projects by name and share their live URLs if available.
Match projects to client needs — e.g. if they want an e-commerce site, show E-commerce category projects.` : '');
  } catch (err) {
    console.error('Error building context:', err);
    return BASE_CONTEXT;
  }
}

// ─── Fallback replies (no API key) ───────────────────────────────────────────
function getFallbackReply(message = '', plans = []) {
  const msg = message.toLowerCase();

  let basicPrice = '$299';
  let advancedPrice = '$799';
  let fullstackPrice = '$1499';

  if (plans && plans.length > 0) {
    const basicPlan = plans.find(p => p.id === 'basic');
    if (basicPlan) basicPrice = `$${basicPlan.priceUSD}`;
    const advancedPlan = plans.find(p => p.id === 'advanced');
    if (advancedPlan) advancedPrice = `$${advancedPlan.priceUSD}`;
    const fullstackPlan = plans.find(p => p.id === 'fullstack');
    if (fullstackPlan) fullstackPrice = `$${fullstackPlan.priceUSD}`;
  }

  if (msg.includes('price') || msg.includes('cost') || msg.includes('kitna') || msg.includes('budget') || msg.includes('charge')) {
    let priceList = `Here are our pricing plans 💰:\n\n`;
    if (plans && plans.length > 0) {
      plans.forEach(p => {
        priceList += `• ${p.name} — $${p.priceUSD} (${p.desc ? p.desc.split('.')[0] : ''})\n`;
      });
    } else {
      priceList += `• Basic Website — $299 (5 pages, 7-day delivery)\n• Advanced Website — $799 (15 pages, CMS, payments)\n• Full Stack App — $1499 (custom app, API, 6mo support)\n`;
    }
    priceList += `\nVisit /pricing for details or contact us for a custom quote!`;
    return priceList;
  }

  if (msg.includes('ecommerce') || msg.includes('e-commerce') || msg.includes('shop') || msg.includes('store') || msg.includes('sell'))
    return `For an e-commerce store, I'd recommend our Advanced Website plan at ${advancedPrice} 🛒 — it includes payment integration, product management, and admin dashboard. Check our e-commerce projects at /projects!`;

  if (msg.includes('app') || msg.includes('platform') || msg.includes('saas') || msg.includes('dashboard'))
    return `For a custom web app or platform, our Full Stack App plan at ${fullstackPrice} is perfect 🚀 — includes REST API, database, auth system, and 6 months support. Want a custom quote? Contact us!`;

  if (msg.includes('basic') || msg.includes('simple') || msg.includes('landing') || msg.includes('small'))
    return `Our Basic Website plan at ${basicPrice} is great for you! ✅ You get a 5-page responsive website delivered in just 7 days. Visit /pricing to get started!`;

  if (msg.includes('service') || msg.includes('what do you') || msg.includes('kya karte'))
    return `We build 🔥:\n• Business websites & landing pages\n• E-commerce stores\n• Full stack web apps\n• Admin dashboards\n• REST APIs\n\nCheck /services for full details!`;

  if (msg.includes('demo') || msg.includes('example') || msg.includes('project') || msg.includes('portfolio') || msg.includes('work'))
    return `Check out our portfolio at /projects 🎨 — we have live demos of e-commerce stores, web apps, dashboards and more. Want me to suggest a specific type?`;

  if (msg.includes('contact') || msg.includes('reach') || msg.includes('talk') || msg.includes('discuss'))
    return `You can reach Shivam directly 📩:\n• Email: devsphereglobal@gmail.com\n• WhatsApp: +918353949006\n• Or use the /contact page\n\nWe typically respond within 2 hours!`;

  if (msg.includes('time') || msg.includes('delivery') || msg.includes('deadline') || msg.includes('kitne din'))
    return `Delivery timelines ⏱️:\n• Basic Website: 7 days\n• Advanced Website: 2-3 weeks\n• Full Stack App: 4-6 weeks\nRush delivery available on request!`;

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('hii') || msg.includes('namaste'))
    return `Hi there! 👋 Welcome to DevSphere Global! I'm here to help you build your dream website or app. What kind of project are you looking for?`;

  if (msg.includes('custom') || msg.includes('quote') || msg.includes('special'))
    return `For custom projects, contact Shivam directly 🤝:\n• WhatsApp: +918353949006\n• Email: devsphereglobal@gmail.com\nWe'll give you a free consultation and quote within 24 hours!`;

  return `Thanks for reaching out to DevSphere Global! 😊 I can help you with pricing, services, or project demos. What are you looking to build?`;
}

// ─── Chat Route ───────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      const plans = await Plan.find({}).sort({ order: 1 }).catch(() => []);
      return res.json({ reply: getFallbackReply(message, plans) });
    }

    const systemContext = await buildContext();

    const contents = [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemContext }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', data);
      const plans = await Plan.find({}).sort({ order: 1 }).catch(() => []);
      return res.json({ reply: getFallbackReply(message, plans) });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || "I'm not sure about that. Please contact us directly at devsphereglobal@gmail.com!";

    res.json({ reply });

  } catch (err) {
    console.error('Chat error:', err);
    let plans = [];
    try {
      plans = await Plan.find({}).sort({ order: 1 });
    } catch (dbErr) {
      console.error('DB fetch error in fallback:', dbErr);
    }
    res.json({ reply: getFallbackReply(req.body?.message, plans) });
  }
});

module.exports = router;
