import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'ilysm-15824.firebaseapp.com',
  databaseURL: 'https://ilysm-15824.firebaseio.com',
  projectId: 'ilysm-15824',
  storageBucket: 'ilysm-15824.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);

const auth = firebase.auth();

const db = firebase.firestore();

const storage = firebase.storage();

// To ensure ensure firestore timestamp objects supported in future
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export { auth, db, storage };
