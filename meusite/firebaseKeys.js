import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";


// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDQWO9csuYqrd0JyXa_cs4f3jAsjQAEWSw",
  authDomain: "meu-site-fd954.firebaseapp.com",
  projectId: "meu-site-fd954",
  storageBucket: "meu-site-fd954.firebasestorage.app",
  messagingSenderId: "1062346912662",
  appId: "1:1062346912662:web:0f41873e12965c545363b7",
  measurementId: "G-5HXX5ZZKER"
};


export { firebaseConfig, initializeApp, getAuth, onAuthStateChanged, signOut, getDatabase, ref, set, get };