// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtSnyN2Nf9xRfYEr7M80Gs9BALB6TGzY0",
  authDomain: "ecobite-bc9b2.firebaseapp.com",
  projectId: "ecobite-bc9b2",
  storageBucket: "ecobite-bc9b2.firebasestorage.app",
  messagingSenderId: "1017899444711",
  appId: "1:1017899444711:web:558a78306de7e3882db542",
  measurementId: "G-Y3SQ9FR6NV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };