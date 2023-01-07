import firebase from 'firebase-admin';
const sa: any = JSON.parse(process.env.FIREBASE);

//FireBase Admin initialize
firebase.initializeApp({
    credential: firebase.credential.cert(sa)
});

export default firebase;