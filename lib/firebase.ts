// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhziJbG5Pxg0UYvq784YH4zXpsdKfh7AY",
  authDomain: "bigfoot-connect.firebaseapp.com",
  projectId: "bigfoot-connect",
  storageBucket: "bigfoot-connect.appspot.com",
  messagingSenderId: "177999879162",
  appId: "1:177999879162:web:a1ea739930cac97475e243",
  measurementId: "G-WEY300P1S7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
