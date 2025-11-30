// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🛑 PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE (La que copiaste de la consola) 🛑
const firebaseConfig = {
  apiKey: "AIzaSyBfy32I3Hz7h_reV1B9rkJDQHGAiQJubnY",
  authDomain: "comida-china-dragon-9a210.firebaseapp.com",
  projectId: "comida-china-dragon-9a210",
  storageBucket: "comida-china-dragon-9a210.appspot.com",
  messagingSenderId: "583076652596",
  appId: "1:583076652596:web:ee07d36ae6e507c5d1cc61"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
// Exportamos la base de datos para usarla en las páginas
export const db = getFirestore(app);