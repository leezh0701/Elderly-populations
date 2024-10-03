// src/firebase.js
import firebase from 'firebase/app'
import 'firebase/auth'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA7f5Mrdr95eKRpDDqrHZGgVC0lMHdUh-0',
  authDomain: 'a3-74d3f.firebaseapp.com',
  projectId: 'a3-74d3f',
  storageBucket: 'a3-74d3f.appspot.com',
  messagingSenderId: '601977224235',
  appId: '1:601977224235:web:738576d2ac98f740d57e6e',
  measurementId: 'G-EKH3JDBY1N'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export default firebase
