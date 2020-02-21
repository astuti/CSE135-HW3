// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const express = require('express');
// const bodyParser = require('body-parser');
// //const firebase = require('firebase');

// // Initialize Cloud Firestore through Firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyBRCReGbRNNm2OBGatwZDmcYj8s0W1E-sg",
//     authDomain: "my-third-website.firebaseapp.com",
//     databaseURL: "https://my-third-website.firebaseio.com",
//     projectId: "my-third-website",
//     storageBucket: "my-third-website.appspot.com",
//     messagingSenderId: "925927624827",
//     appId: "1:925927624827:web:fde7742ec2c991adb212de",
//     measurementId: "G-WHRJBNXH50"
//   };

// admin.initializeApp(firebaseConfig);
// var firestore = admin.firestore();
// console.log("admin-firestore initialized");

// const app = express();
// const main = express();

// main.use('/api/v1', app);
// main.use(bodyParser.json());

// exports.webApi = functions.https.onRequest(main);


// // //Creat session cookie
// // app.post('/sessionLogin', (req, res) => {
// //     // Get the ID token passed and the CSRF token
// //     const idToken = req.body.idToken.toString();
// //     const csrfToken = req.body.csrfToken.toString();
// //     // Guard against CSRF attacks
// //     if(csrfToken != req.cookies.csrfToken) {
// //         res.status(401).send('UNAUTHORIZED REQUEST');
// //         return;
// //     }
// //     // Set session expiration to 30 minutes
// //     const expiresIn = 1000 * 60 * 30;
// //     // Create the session cookie. This will also verify the ID token in the process
// //     // The session cookie will have the same claims as the ID token.
// //     // To only allow session cookie setting on recent sign-in, auth_time in ID token
// //     //   can be checked to ensure user was recently signed in before creating a session cookie
// //     admin.auth().createSessionCookie(idToken, {expiresIn})
// //     .then(sessionCookie => {
// //         const options = {maxAge: expiresIn, httpOnly: true, secure: true};
// //         res.cookie('session', sessionCookie, options);
// //         res.end(JSON.stringify({status: 'success'}));
// //     }, error => {
// //         res.status(401).send('UNAUTHORIZED REQUEST');
// //     });
// // });

// // create POST /fights/ endpoint
// // using: https://us-central1-my-third-website.cloudfunctions.net/webApi/api/v1/fights/
// // fight record is going to have a winner, loser, title
// app.post('/fights', async (req, res) => {
//     try {
//         const {
//             winner,
//             loser,
//             title
//         } = req.body; // get our post data using req.body
//         const data = {
//             winner,
//             loser,
//             title
//         }
//         // use add() to add a new fight if collection doesn't exist
//         const fightRef = await firestore.collection('fights').add(data);
//         // get actual record data using get()
//         const fight = await fightRef.get();
//         res.json({
//             id: fightRef.id,
//             data: fight.data()
//         });
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // create GET /fights/:id endpoint
// app.get('/fights/:id', async (req, res) => { 
//     try {
//         const fightId = req.params.id; // get fight id
//         if(!fightId) throw new Error('Fight ID is required');
//         const fight = await firestore.collection('fights').doc(fightId).get();
//         if(!fight.exists) throw new Error('Fight doesnt exist.');
//         res.setHeader('Content-Type', 'application/json');
//         res.json({
//              id: fight.id,
//              data: fight.data()
//         });
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // create GET /fights/ endpoint
// app.get('/fights', async (req, res) => {
//     try {
//         const fightQuerySnapshot = await firestore.collection('fights').get();
//         const fights = [];
//         fightQuerySnapshot.forEach(
//             (doc) => {
//                 fights.push({
//                     id: doc.id,
//                     data: doc.data()
//                 });
//             }
//         );
//         res.json(fights);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // create PUT /fights/:id endpoint
// app.put('/fights/:id', async (req, res) => {
//      try {
//         const fightId = req.params.id;
//         const title = req.body.title;
//         if(!fightId) throw new Error('id is blank');
//         if(!title) throw new Error('Title is required');

//         const data = {
//             title
//         };
//         const fightRef = await firestore.collection('fights')
//             .doc(fightId)
//             .set(data, {merge: true});
//         res.json({
//             id: fightId,
//             data
//         });
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });