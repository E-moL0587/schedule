import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAmkdeXl8PtMKz1CtxlGAmPFWa0aOnRQXc",
  authDomain: "schedule-392e6.firebaseapp.com",
  projectId: "schedule-392e6",
  storageBucket: "schedule-392e6.appspot.com",
  messagingSenderId: "690830062638",
  appId: "1:690830062638:web:549c8d55a9ca11f814dbbf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
