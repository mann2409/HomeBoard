
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmc366rZNODfDHbZnmI1mffysWAbR2y60",
  authDomain: "homeboard-7d12b.firebaseapp.com",
  projectId: "homeboard-7d12b",
  storageBucket: "homeboard-7d12b.firebasestorage.app",
  messagingSenderId: "365181179617",
  appId: "1:365181179617:web:ca985fd2082445c24609a0",
  measurementId: "G-J5YWQDZDCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;