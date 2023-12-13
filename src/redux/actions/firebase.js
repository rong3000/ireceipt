
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvRgcFcS4jGVXcDjdsrCn81m4wkmJxFjU",
  authDomain: "intelligent-receipt.firebaseapp.com",
  databaseURL: "https://intelligent-receipt.firebaseio.com",
  projectId: "intelligent-receipt",
  storageBucket: "intelligent-receipt.appspot.com",
  messagingSenderId: "1012566380108",
  appId: "1:1012566380108:web:724978c7742b7192d4aee9",
  measurementId: "G-42G24Y5T7N"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;