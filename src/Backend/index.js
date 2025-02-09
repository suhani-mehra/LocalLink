import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC8qko5QpGQqK2yUNM2bH04ONxxqRk4IzU",
  authDomain: "locallink-3489c.firebaseapp.com",
  projectId: "locallink-3489c",
  storageBucket: "locallink-3489c.appspot.com",
  messagingSenderId: "943700243297",
  appId: "1:943700243297:web:0d119a9522cab05b8b4b20",
  measurementId: "G-VDN7MMCLBN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// Export `db`
export { auth, googleProvider, db };
