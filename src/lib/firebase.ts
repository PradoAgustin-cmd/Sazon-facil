
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAB3rHXyWy5HaXYYkZn5rV_jUZsq7rhpvA",
  authDomain: "studio-5680256479-bae09.firebaseapp.com",
  projectId: "studio-5680256479-bae09",
  storageBucket: "studio-5680256479-bae09.appspot.com",
  messagingSenderId: "797244849017",
  appId: "1:797244849017:web:f1a8f0e7a23a95df8fcda8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
