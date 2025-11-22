const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

// Configure nodemailer using Firebase Functions config (recommended)
const transporter = nodemailer.createTransport({
  host: functions.config().smtp.host,
  port: functions.config().smtp.port,
  secure: functions.config().smtp.secure, // true for 465, false for 587/others
  auth: {
    user: functions.config().smtp.user,
    pass: functions.config().smtp.pass,
  },
});

// Helper to generate a 5-digit OTP
const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 10000–99999
};

// CORS helper (simple)
const setCorsHeaders = res => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
};

// POST /sendEmailOtp
exports.sendEmailOtp = functions.https.onRequest(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({success: false, message: 'Method not allowed'});
  }

  try {
    const {email} = req.body || {};

    if (!email || typeof email !== 'string') {
      return res
        .status(400)
        .json({success: false, message: 'Email is required'});
    }

    const otp = generateOtp();
    const now = admin.firestore.Timestamp.now();
    const expiresAt = admin.firestore.Timestamp.fromMillis(
      now.toMillis() + 5 * 60 * 1000, // 5 minutes
    );

    // Store OTP in Firestore (doc per email)
    await db
      .collection('emailOtps')
      .doc(email)
      .set({
        otp,
        createdAt: now,
        expiresAt,
        used: false,
      });

    // Send email
    await transporter.sendMail({
      from: functions.config().smtp.from || functions.config().smtp.user,
      to: email,
      subject: 'Your verification code',
      text: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your verification code is: <b>${otp}</b></p><p>It will expire in 5 minutes.</p>`,
    });

    return res.json({success: true});
  } catch (error) {
    console.error('sendEmailOtp error:', error);
    return res
      .status(500)
      .json({success: false, message: 'Failed to send OTP'});
  }
});

// POST /verifyEmailOtp
exports.verifyEmailOtp = functions.https.onRequest(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({success: false, message: 'Method not allowed'});
  }

  try {
    const {email, otp} = req.body || {};

    if (!email || typeof email !== 'string' || !otp || typeof otp !== 'string') {
      return res
        .status(400)
        .json({success: false, message: 'Email and OTP are required'});
    }

    const docRef = db.collection('emailOtps').doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res
        .status(400)
        .json({success: false, message: 'OTP not found'});
    }

    const data = doc.data();

    if (data.used) {
      return res
        .status(400)
        .json({success: false, message: 'OTP already used'});
    }

    const now = admin.firestore.Timestamp.now();

    if (now.toMillis() > data.expiresAt.toMillis()) {
      return res
        .status(400)
        .json({success: false, message: 'OTP expired'});
    }

    if (data.otp !== otp) {
      return res
        .status(400)
        .json({success: false, message: 'Invalid OTP'});
    }

    // Mark OTP as used
    await docRef.update({used: true});

    return res.json({success: true});
  } catch (error) {
    console.error('verifyEmailOtp error:', error);
    return res
      .status(500)
      .json({success: false, message: 'Failed to verify OTP'});
  }
});