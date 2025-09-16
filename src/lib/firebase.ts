// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-270633183-e9b14",
  "appId": "1:992325159668:web:7f43cef6a9299b03506ca1",
  "storageBucket": "studio-270633183-e9b14.firebasestorage.app",
  "apiKey": "AIzaSyDH33WmgElbd8DON7jWAJFwlVpleTqFm2o",
  "authDomain": "studio-270633183-e9b14.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "992325159668"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
