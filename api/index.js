const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const app = require('../server/index');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGO_URI) {
    console.warn('⚠️ MONGO_URI is not defined in environment variables.');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB connected (Vercel Serverless Function)');
  } catch (err) {
    console.error('❌ MongoDB Serverless connection error:', err.message);
  }
};

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (dbErr) {
    console.error('DB connect helper error:', dbErr);
  }
  return app(req, res);
};
