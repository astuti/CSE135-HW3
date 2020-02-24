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

exports.cookie = functions.https.onRequest(app);

app.get('/newsession', (request, response) => {
    return cors(request, response, () => {
        
        // set headers to satisfy CORS
        response.setHeader('Access-Control-Allow-Methods', 'GET');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
        response.setHeader('Access-Control-Allow-Credentials', true);
        response.setHeader('Cache-Control', 'private');
        
        // check if user/session cookies exist
        var userCookieID = request.cookies['user_cookie'];
        var sessionCookieID = request.cookies['session_cookie'];
        
        
        // if user_cookie doesnt exist make user/session cookie and corresponding docs
        if(userCookieID == null) {

            // [users] -> [{userDoc with random ID}]
            let userDocPath = firestore.collection('users').doc();
            userDocPath.set({path: "from userDoc"});
            userCookieID = userDocPath.id;
            // set user cookie
            response.cookie('user_cookie', userCookieID, {maxAge: 600000000, httpOnly: true});
        }
    
        // if only session cookie doesnt exit, find user doc and add session 
        if(sessionCookieID == null) {

            // [{userDoc with random ID}] -> [sessions] -> [{sessionDoc with random ID}]
            let seshDocPath = firestore.collection('users').doc(userCookieID).collection('sessions').doc();
            seshDocPath.set({path: "from seshDoc"});
            seshDocPath.collection('entries').add({path: "from entries"});
            sessionCookieID = seshDocPath.id;
            response.cookie('session_cookie', sessionCookieID);
        }
        
        try{
            response.send(reporterString);
        } catch (error) {
            response.status(500).send("error creating user/session cookie");
        }
    });
});

app.post('/newsession', (request, response) => {
    return cors(request, response, () => {
        // set headers to satisfy CORS
        response.setHeader('Access-Control-Allow-Methods', 'POST');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
        response.setHeader('Access-Control-Allow-Credentials', true);
        response.setHeader('Cache-Control', 'private');
        
        // check if user/session cookies exist
        var userCookieID = request.cookies['user_cookie'];
        var sessionCookieID = request.cookies['session_cookie'];
        
        // grab data from request body
        var data;
        try {
            data = JSON.parse(request.body);
        } catch (error) {
            response.status(500).send({error: "error getting data"});
        }
        
        // if user_cookie doesnt exist make user/session cookie and corresponding docs
        if(userCookieID == null) {
    
            // [users] -> [{userDoc with random ID}]
            let userDocPath = firestore.collection('users').doc();
            userDocPath.set({path: "from userDoc"});
            userCookieID = userDocPath.id;
            // set user cookie
            response.cookie('user_cookie', userCookieID, {maxAge: 600000000, httpOnly: true});
        }

        // if only session cookie doesnt exit, find user doc and add session 
        if(sessionCookieID == null) {

            // [{userDoc with random ID}] -> [sessions] -> [{sessionDoc with random ID}]
            let seshDocPath = firestore.collection('users').doc(userCookieID).collection('sessions').doc();
            let dataArray = [];
            seshDocPath.set(dataArray);
            seshDocPath.collection('entries');
            sessionCookieID = seshDocPath.id;
            response.cookie('session_cookie', sessionCookieID);
        }

        
        // add data to its rightful spot in firestore  
        firestore.collection('users')
            .doc(userCookieID)
            .collection('sessions')
            .doc(sessionCookieID)
            .collection('entries').doc().set(data);
            
        try {
            response.send({path: "done"});
        } catch (error) {
            response.status(500).send(JSON.stringify({iserror: error, user: userCookieID, sesh: sessionCookieID}));
        }
    });
});
const reporterString = `var idleStart,idleEnd,idleTime,uniqueKey,fromPage,idleObj=setTimeout(timeoutHandler,2e3),currentlyIdling=!1;function gatherData(){let e=performance.getEntriesByName("load-time")[0],t=performance.getEntries().find(()=>PerformanceNavigationTiming);var n={id:uniqueKey,user_agent:navigator.userAgent,user_lang:navigator.language,user_cookies:navigator.cookieEnabled,user_js:!0,user_img:!1,user_css:!1,user_max_width:screen.width,user_max_height:screen.height,user_window_width:screen.availWidth,user_window_height:screen.availHeight,user_ect:navigator.connection.effectiveType,performance_load_start:e.startTime.toFixed(3),performance_load_end:(e.startTime+e.duration).toFixed(3),performance_load_delta:e.duration.toFixed(3),performance_request_start:t.requestStart.toFixed(3),performance_response_start:t.responseStart.toFixed(3),performance_response_end:t.responseEnd.toFixed(3),performance_transfer_size:t.transferSize,performance_encoded_body_size:t.encodedBodySize,dynamic_clicks:JSON.stringify(mouseClicks),dynamic_moves:JSON.stringify(mouseMoves),dynamic_keys:JSON.stringify(keysPressed),dynamic_scroll:JSON.stringify(scrollEvents),dynamic_idle:JSON.stringify(idleEvents)};fetch("https://us-central1-cse135-hw3-5f57c.cloudfunctions.net/cookie/newsession",{method:"POST",mode:"cors",body:JSON.stringify(n),credentials:"include"}).then(e=>e.text()).then(e=>{console.log(JSON.parse(e))}),resetIdle()}function checkImages(){return document.getElementById("check-image").complete}function beginGatherData(){performance.mark("post-load"),performance.measure("load-time","pre-load","post-load");let e=window.location.pathname;fromPage=e.split("/").pop(),uniqueKey=fromPage.length>0?fromPage+" - "+new Date:"index.html - "+new Date,addListeners()}performance.mark("pre-load"),beginGatherData();var mouseClicks=[],mouseMoves=[],keysPressed=[],scrollEvents=[],idleEvents=[];function addListeners(){window.addEventListener("click",e=>resetIdle()|mouseClicks.push([e.clientX,e.clientY])),window.addEventListener("mousemove",e=>resetIdle()|mouseMoves.push([e.clientX,e.clientY])),window.addEventListener("keyup",e=>resetIdle()|keysPressed.push(e.key)),window.addEventListener("scroll",e=>resetIdle()|scrollEvents.push([window.scrollX,window.scrollY])),window.addEventListener("beforeunload",e=>resetIdle()|storeData())}function resetIdle(){clearTimeout(idleObj),idleObj=setTimeout(timeoutHandler,2e3),currentlyIdling&&(idleEnd=(new Date).getTime(),idleTime=idleEnd-idleStart,idleEvents.push([idleTime])),currentlyIdling=!1}function timeoutHandler(){currentlyIdling=!0,idleStart=(new Date).getTime()}function logClick(e){mouseClicks.push([e.clientX,e.clientY])}function logMove(e){mouseMoves.push([e.clientX,e.clientY])}function storeData(e){JSON.parse(localStorage.getItem("myEntries"));gatherData()}`;