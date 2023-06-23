import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// import 'firebase/compat/storage';
// import { storage } from './firebase';
import {getStorage, ref} from 'firebase/storage'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCEGjJ9clxcwNRib7wEqsGI3Fe16BkYwSQ",
  authDomain: "instagram-clone-c7b63.firebaseapp.com",
  projectId: "instagram-clone-c7b63",
  storageBucket: "instagram-clone-c7b63.appspot.com",
  messagingSenderId: "295406622224",
  appId: "1:295406622224:web:f90b9bb8bcc5da4669dc95",
  measurementId: "G-6QTT3XC82F",
  //Provide your own firebase details
});

const db= firebase.firestore();
const auth= firebase.auth();
// const provider= new firebase.auth.GoogleAuthProvider();
// const storage= firebase.storage().ref();
// const storage= getStorage();

export {db, auth ,getStorage, ref};
