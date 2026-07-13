# DevSphere Global - Portfolio Website

Full-stack portfolio with client dashboard, admin panel, payments, and contact system.

## Quick Start

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
node scripts/seed.js   # Creates admin + sample data
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
cp src/.env.example src/.env
# Fill in your .env values
npm start
```

## Admin Login (after seed)
- Email: `admin@devsphere.global`
- Password: `Admin@123`

## Environment Variables

### Server (.env)
| Variable | Description |
|---|---|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT tokens |
| SMTP_HOST | Email SMTP host (e.g. smtp.gmail.com) |
| SMTP_USER | Your Gmail address |
| SMTP_PASS | Gmail App Password |
| ADMIN_EMAIL | Where contact emails are sent |
| STRIPE_SECRET_KEY | Stripe secret key |
| CLIENT_URL | Frontend URL |

### Client (.env)
| Variable | Description |
|---|---|
| REACT_APP_API_URL | Backend API URL |
| REACT_APP_STRIPE_PUBLIC_KEY | Stripe publishable key |

## Deployment

### Frontend → Vercel
1. Push `client/` folder to GitHub
2. Import in Vercel
3. Set `REACT_APP_API_URL` to your Render backend URL
4. Deploy

### Backend → Render
1. Push `server/` folder to GitHub
2. Create Web Service on Render
3. Set all environment variables
4. Deploy

## Features
- Home page with hero, skills, services, projects, testimonials
- Projects page with category filter
- Services page
- Pricing page with Stripe payment
- Contact form with email notification
- Client dashboard with project tracking
- Admin panel (projects, clients, messages, testimonials)
- Dark/Light mode
- Fully responsive
- WhatsApp floating button
- JWT authentication
- bcrypt password hashing
