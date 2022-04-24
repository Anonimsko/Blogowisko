import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDD3Yh13Arw0OhrJUUk-JGp-aG76eRhw_M",
  authDomain: "reactblog-8a000.firebaseapp.com",
  projectId: "reactblog-8a000",
  storageBucket: "reactblog-8a000.appspot.com",
  messagingSenderId: "786461235077",
  appId: "1:786461235077:web:a3e92bcc2397e1ee5396ec"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);