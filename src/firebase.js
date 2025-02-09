// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC8qko5QpGQqK2yUNM2bH04ONxxqRk4IzU",
    authDomain: "locallink-3489c.firebaseapp.com",
    projectId: "locallink-3489c",
    storageBucket: "locallink-3489c.firebasestorage.app",
    messagingSenderId: "943700243297",
    appId: "1:943700243297:web:0d119a9522cab05b8b4b20",
    measurementId: "G-VDN7MMCLBN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
