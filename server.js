const bodyParser = require('body-parser');
const express = require('express');
const enforce = require('express-sslify');
const firebase = require('firebase');
const path = require('path');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Firebase
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const urlCollection = 'urls';

// Express
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + ''));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', function(req, res) {
    res.render('index');
});


app.get('/:code', async (req, res) => {
    const code = req.params.code;
    const query = await db.collection(urlCollection).where("code", "==", code);

    query.onSnapshot((data) => {
        if(data.empty){
            res.status(404).render('404');
            return;
        }
        let url = data.docs[0].data().url;
        res.status(301).redirect(`https://${ url }`);
    });

});

app.listen(port, error => {
    if(error) throw error;
    console.log('Server is running on port ' + port)
});