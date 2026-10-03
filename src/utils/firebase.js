import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "AIzaSyC6oWs3sHco-uyQmNo7Ml4cCAo7R1pmpjo",
  authDomain: "fresherai-68ed5.firebaseapp.com",
  projectId: "fresherai-68ed5",
  storageBucket: "fresherai-68ed5.firebasestorage.app",
  messagingSenderId: "676053165869",
  appId: "1:676053165869:web:bab410f6510119eae755a4",
};

let app = null;
let auth = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  if (app) {
    auth = getAuth(app);
  }
} catch (e) {
  console.warn("Firebase initializeApp caught error:", e);
}

const provider = new GoogleAuthProvider();

export { auth, provider };
