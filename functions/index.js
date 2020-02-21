const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const bodyParser = require('body-parser');
const express = require('express');

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
main.use('/api/v1', app);
main.use(cors);
main.use(bodyParser.json());
exports.webApi = functions.https.onRequest(main);
  
// post tracker data in corresponding session
// path that triggers this 
//   = https://us-central1-(...).cloudfunctions.net/webApi/api/v1/session
app.post('/session', async (request, response) => {
    return cors(request, response, () => {
        try {
              // const {
              //     id, 
              //     user_agent,
              //     user_lang,
              //     user_cookies,
              //     user_js,
              //     user_img,
              //     user_css,
              //     user_max_width,
              //     user_max_height,
              //     user_window_width,
              //     user_window_height,
              //     user_ect,
              //     performance_load_start,
              //     performance_load_end,
              //     performance_load_delta,
              //     performance_request_start,
              //     performance_response_start,
              //     performance_response_end,
              //     performance_transfer_size,
              //     performance_encoded_body_size,
              //     dynamic_clicks, 
              //     dynamic_moves,
              //     dynamic_keys,
              //     dynamic_scroll,  
              //     dynamic_idle
              // } = request.body;   // populate fields with request body data
              
              // const data = {
              //     id, 
              //     user_agent,
              //     user_lang,
              //     user_cookies,
              //     user_js,
              //     user_img,
              //     user_css,
              //     user_max_width,
              //     user_max_height,
              //     user_window_width,
              //     user_window_height,
              //     user_ect,
              //     performance_load_start,
              //     performance_load_end,
              //     performance_load_delta,
              //     performance_request_start,
              //     performance_response_start,
              //     performance_response_end,
              //     performance_transfer_size,
              //     performance_encoded_body_size,
              //     dynamic_clicks, 
              //     dynamic_moves,
              //     dynamic_keys,
              //     dynamic_scroll,  
              //     dynamic_idle
              // }
  
            const data = request.body;
            // dataArray will hold list of tracker data for a session
            const dataArray = {
                dataArray: [data]
            }
            // check if user has persistent cookie or session cookie
            const permCookie = request.user_cookies["permCookie"];
            const seshCookie = request.user_cookies["seshCookie"];
            // if persistent cookie is not found add cookie and firestore doc
            if(!permCookie) {
                const newUserRef = await firestore.collection('users').doc();
                request.cookie("permCookie", newUserRef.id, {maxAge: 600000000});
            }
            // if session cookie is not found add cookie and firestore doc
            if(!seshCookie) {
                newSessionRef = await firestore.collection('users')
                    .doc(newUserRef.id)
                    .collection('sessions')
                    .add(dataArray);
                request.cookie("seshCookie", newSessionRef.id);
            }
            // bypass CORS error
            response.set("Access-Control-Allow-Origin", "*");
            response.set("Access-Control-Allow-Methods", "GET, POST, OPTION");
            response.set("Access-Control-Allow-Headers", "Content-Type");
  
            // append new session to dataArray and to firestore
            let sessionRef = await firestore.collection('users')
                .doc(permCookie)
                .collections('sessions')
                .doc(seshCookie)
                .set({
                    dataArray: data
                }, {merge: true} ); 
            // get data in new session doc and send back in response body
            let sessionRefData = await sessionRef.get();
            response.json({
                data: sessionRefData.data()
            });
        } catch (error) {
            response.status(500).send(error);
        }
    });
});
  
  