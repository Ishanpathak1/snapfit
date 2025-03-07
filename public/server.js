const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const app = express();

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDB0o0s3L9Vs7ut-mro95yFejJyqC0JZaQ",
  authDomain: "revode-211c6.firebaseapp.com",
  projectId: "revode-211c6",
  storageBucket: "revode-211c6.firebasestorage.app",
  messagingSenderId: "82044066760",
  appId: "1:82044066760:web:ff5683480c8ca17e3cbefd",
  measurementId: "G-Q7EX45MV9P"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware
app.use(express.json());
app.use(express.static('public')); // This line is important!

// Routes
app.post('/signup', async (req, res) => {
  const { email } = req.body;
  try {
    await addDoc(collection(db, 'waitlist'), {
      email,
      signupDate: new Date()
    });
    res.json({
      success: true,
      message: 'Thanks for joining! We\'ll notify you when we launch.'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 