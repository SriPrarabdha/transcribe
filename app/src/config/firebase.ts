import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCngHteE81fn9o8xLTjokBRRPzxfq8MJ5s",
  authDomain: "transcribe-addcb.firebaseapp.com",
  projectId: "transcribe-addcb",
  storageBucket: "transcribe-addcb.firebasestorage.app",
  messagingSenderId: "185801440069",
  appId: "1:185801440069:web:a1122502ca53c4afd3dc2c",
  measurementId: "G-32TG4BE26T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 