
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYnVFJmAx2O1JWdzWYPRcDTn4VDRNuvAw",
  authDomain: "paws-69846.firebaseapp.com",
  databaseURL: "https://paws-69846-default-rtdb.firebaseio.com",
  projectId: "paws-69846",
  storageBucket: "paws-69846.appspot.com",
  messagingSenderId: "721789489246",
  appId: "1:721789489246:web:a3011bcd2bf912ccc2e4cf",
  measurementId: "G-WE700B4XT2"
};



const firebase = initializeApp(firebaseConfig);



export const db = getFirestore()

export const auth = getAuth()

