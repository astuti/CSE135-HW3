const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

// Initialize Express.js server
const app = express();
const main = express();

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

// Initialize express objects 
const app = express();
const main = express();
main.use('/api/v1', app);
main.use(bodyParser.json());
exports.webApi = functions.https.onRequest(main);

// post tracker data in corresponding session
app.post('/session', async (request, response) => {
    try {
        const {
            id, 
            user_agent,
            user_lang,
            user_cookies,
            user_js,
            user_img,
            user_css,
            user_max_width,
            user_max_height,
            user_window_width,
            user_window_height,
            user_ect,
            performance_load_start,
            performance_load_end,
            performance_load_delta,
            performance_request_start,
            performance_response_start,
            performance_response_end,
            performance_transfer_size,
            performance_encoded_body_size,
            dynamic_clicks, 
            dynamic_moves,
            dynamic_keys,
            dynamic_scroll,  
            dynamic_idle
        } = request.body;
        
        // ... get userId ... //
        const userId = 
        //const sessionRef = await firestore.collection('users').doc(userId).add()

    }
    

})











//"npm --prefix \"$RESOURCE_DIR\" run lint"


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// SIGN IN



// exports.functionTest = functions.https.onRequest((req, res) => {
//     docRef.get().then(snapshot => {
//         const data = snapshot.data();
//         res.send(data);
//     }).catch(error => {
//         console.log(error);
//         res.status(500).send(error);
//     });

//     docRef.update({
//         name: req.query.name2
//     }).catch(error => {
//         res.status(500).send(error);
//     });

//     // docRef.set({
//     //     flart: "shat"
//     // }).catch(error => {
//     //     res.status(500).send(error);
//     // });
// });

// main.use('/api/v1', app); // path used for receiving requests
// main.use(bodyParser.json()); // select JSON as our main parser for request body
// exports.webApi = functions.https.onRequest(main);
