import * as firebase from 'firebase'

import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBmoaUJSiAMZ3KLPCQqPwicO-Ybh3op8Ao",
    authDomain: "finalprojectreact.firebaseapp.com",
    databaseURL: "https://finalprojectreact.firebaseio.com",
    projectId: "finalprojectreact",
    storageBucket: "finalprojectreact.appspot.com",
    messagingSenderId: "666524436869",
    appId: "1:666524436869:web:03c198ba4c5590ad1b5cec",
    measurementId: "G-ZHERYM9MWG"
}

firebase.initializeApp(firebaseConfig)
export default firebase