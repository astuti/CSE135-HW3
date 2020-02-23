const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')({origin: true});
const app = express();


 
// Initialize Cloud Firestore through Firebase
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

   // Initialize App and create reference to our database
admin.initializeApp(firebaseConfig);
var firestore = admin.firestore();
console.log("admin-firestore initialized");

// add path used for receiving requests
app.use(cors);
app.use(bodyParser.json());
app.use(cookieParser());
//exports.webApi = functions.https.onRequest(app);



exports.getCookie = functions.https.onRequest((req, res) => {
    
    return cors(req, res, () => {
        try {
            res.setHeader("Access-Control-Allow-Methods", "GET", "POST");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
            res.setHeader("Access-Control-Allow-Credentials", true);
            res.setHeader('Cache-Control', 'private');
            //res.setHeader('content-type', 'application/json');
            //res.cookie('f', 'f', { sameSite: 'none', secure: true, maxAge: 60000, httpOnly: true});
            res.cookie('__session', 'sessiontest', {maxAge: 600000, httpOnly:true})
            res.send(req.body);
            
            
        } catch (error) {
            res.status(500).send(error);
        }
    });
});
