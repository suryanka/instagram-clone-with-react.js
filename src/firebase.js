import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// import 'firebase/compat/storage';
// import { storage } from './firebase';
import {getStorage, ref} from 'firebase/storage'

const firebaseApp = firebase.initializeApp({
  
  //Provide your own firebase details
});

const db= firebase.firestore();
const auth= firebase.auth();
// const provider= new firebase.auth.GoogleAuthProvider();
// const storage= firebase.storage().ref();
// const storage= getStorage();

export {db, auth ,getStorage, ref};
