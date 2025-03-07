require('dotenv').config();
const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore');
const path = require('path');

// Initialize Express
const app = express();

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Get signup count
app.get('/signup-count', async (req, res) => {
  try {
    console.log('Fetching signup count...');
    const waitlistRef = collection(db, 'waitlist');
    const snapshot = await getDocs(waitlistRef);
    const count = snapshot.size;
    
    console.log('Current signup count:', count);
    
    res.json({
      success: true,
      count: count,
      target: 500,
      percentage: Math.min(Math.round((count / 500) * 100), 100)
    });
  } catch (error) {
    console.error('Error getting count:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error getting signup count',
      error: error.message
    });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  try {
    console.log('Adding new signup:', email);
    await addDoc(collection(db, 'waitlist'), {
      email,
      signupDate: new Date()
    });

    const waitlistRef = collection(db, 'waitlist');
    const snapshot = await getDocs(waitlistRef);
    const count = snapshot.size;

    console.log('Updated signup count:', count);

    res.json({
      success: true,
      message: 'Thanks for joining! We\'ll notify you when we launch.',
      count: count,
      target: 500,
      percentage: Math.min(Math.round((count / 500) * 100), 100)
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 