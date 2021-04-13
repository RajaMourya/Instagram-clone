import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDgqz1i_C-_edONTwZ-4jCdIQ2k7iTqGC8",
    authDomain: "instagram-clone-9b664.firebaseapp.com",
    projectId: "instagram-clone-9b664",
    storageBucket: "instagram-clone-9b664.appspot.com",
    messagingSenderId: "841211226682",
    appId: "1:841211226682:web:cb03dd0732148d77212303"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }