const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: "AIzaSyDLQ2jSupF_29teXCqwrctOHZg81faEQ0g",
    authDomain: "cse135-hw3-5f57c.firebaseapp.com",
    databaseURL: "https://cse135-hw3-5f57c.firebaseio.com",
    projectId: "cse135-hw3-5f57c",
    storageBucket: "cse135-hw3-5f57c.appspot.com",
    messagingSenderId: "651933937809",
    appId: "1:651933937809:web:2b0cbc6baa6e229707cf30",
    measurementId: "G-3SGHBPR2LY"
};

admin.initializeApp(firebaseConfig);
var firestore = admin.firestore();
const docRef = firestore.doc("TestCollection/TestDoc");

//"npm --prefix \"$RESOURCE_DIR\" run lint"


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.functionTest = functions.https.onRequest((req, res) => {
    docRef.get().then(snapshot => {
        const data = snapshot.data();
        res.send(data);
    }).catch(error => {
        console.log(error);
        res.status(500).send(error);
    });

    docRef.update({
        name: req.query.name2
    }).catch(error => {
        res.status(500).send(error);
    });

    // docRef.set({
    //     flart: "shat"
    // }).catch(error => {
    //     res.status(500).send(error);
    // });
});