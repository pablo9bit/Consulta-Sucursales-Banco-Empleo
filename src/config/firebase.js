import firebase from "firebase";


const config = {
  apiKey: "AIzaSyCC9RWRzdfIoLLNOPx7zL0MIYxDmxit2Vg",
  authDomain: "consulta-banco-gente.firebaseapp.com",
  databaseURL: "https://consulta-banco-gente-default-rtdb.firebaseio.com",
  projectId: "consulta-banco-gente",
  storageBucket: "consulta-banco-gente.appspot.com",
  messagingSenderId: "1061846064211",
  appId: "1:1061846064211:web:1879de64dae5227c4b7aa6",
  measurementId: "G-QWMEN59VHL"

}; 


firebase.initializeApp(config);

export default firebase;
