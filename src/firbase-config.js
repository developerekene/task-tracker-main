// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCLs-gZwl-jpKndq3PstCJUt4mtfhG2ijg",
    authDomain: "task-tracker-e280b.firebaseapp.com",
    projectId: "task-tracker-e280b",
    storageBucket: "task-tracker-e280b.firebasestorage.app",
    messagingSenderId: "188813633998",
    appId: "1:188813633998:web:7e2c3142ac30fe8644e39f",
    measurementId: "G-KYQ93YFGFV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }

