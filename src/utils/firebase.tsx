// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: 'chat-app-7751e.firebaseapp.com',
  projectId: 'chat-app-7751e',
  storageBucket: 'chat-app-7751e.appspot.com',
  messagingSenderId: '302400983323',
  appId: '1:302400983323:web:813a93575aa33403d603be',
  databaseURL:
    'https://chat-app-7751e-default-rtdb.asia-southeast1.firebasedatabase.app',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore();
export { app, auth, db, firestore };
