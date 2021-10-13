import firebase from "firebase";


const config = {
  apiKey: "AIzaSyA7Jr78t-mib7os9W5aPy_sOOEaOCkIYsE",
  authDomain: "programas-empleo.firebaseapp.com",
  databaseURL: "https://programas-empleo-default-rtdb.firebaseio.com",
  projectId: "programas-empleo",
  storageBucket: "programas-empleo.appspot.com",
  messagingSenderId: "377614663048",
  appId: "1:377614663048:web:8775f9e4b9a3160ac64e3d"
}; 


firebase.initializeApp(config);

export default firebase;
