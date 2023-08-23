import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC0bNvel6CBccypTe8Tx7KK55Ka-PhMzck",
    authDomain: "course-plannr.firebaseapp.com",
    projectId: "course-plannr",
    storageBucket: "course-plannr.appspot.com",
    messagingSenderId: "532342863792",
    appId: "1:532342863792:web:7a11a8d6033b21f1dcc875",
    measurementId: "G-32YBR6VBV5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

