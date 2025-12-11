import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCdHo5G-KdJpg2lcHj7RAzf38m8a8vXZkU",
  authDomain: "ai-daily-tracking.firebaseapp.com",
  databaseURL: "https://ai-daily-tracking-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-daily-tracking",
  storageBucket: "ai-daily-tracking.firebasestorage.app",
  messagingSenderId: "451857171526",
  appId: "1:451857171526:web:bc7ad114a2e97eef0f3647",
  measurementId: "G-C6ZX5GD3TW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
