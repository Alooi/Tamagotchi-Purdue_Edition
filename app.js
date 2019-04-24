var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var admin = require('firebase-admin');
var firebase = require('firebase');

//Cross-Origin access config
var cors = require('cors');
app.use(cors({origin: "*"}));

var userObj = {
    table: []
};
var config = {
    apiKey: "AIzaSyDqQD1lyxMgTFcKcYi0XtNlMtzGNlLp2zY",
    authDomain: "tamagotchi-server.firebaseapp.com",
    databaseURL: "https://tamagotchi-server.firebaseio.com",
    projectId: "tamagotchi-server",
    storageBucket: "tamagotchi-server.appspot.com",
    messagingSenderId: "1096773357408"
};
firebase.initializeApp(config);

// Initialize Admin SDK.
admin.initializeApp({
    credential: admin.credential.cert('serviceAccountKeys.json'),
    databaseURL: "https://tamagotchi-server.firebaseio.com"
});
// Support JSON-encoded bodies.
app.use(bodyParser.json());

app.post('/signup', function(req,res) {
    console.log("HTTP Put Request: /signup");
    res.contentType('application/json')
    var UserEmail = req.body.UserEmail;
    var UserPassword = req.body.UserPassword;
    admin.auth().createUser({
        email: UserEmail,
        password: UserPassword
    })
    .then(function(userRecord) {
        var uid = userRecord.uid;
        var referencePath = '/Users/'+uid+'/';
        var userReference = admin.database().ref(referencePath);
        var date = new Date();
        var timestamp = date.getTime();
        userReference.set({ uid: uid, Email: UserEmail, Health: 140, Hunger: 140, Thirst: 140, coins: 20, time: timestamp}, 
            function(error) {
                if (error) {
                    res.end(JSON.stringify({status: 'failed', error: error}));
                    console.log("Data could not be saved." + error);
                } 
                else {
                    res.end(JSON.stringify({status: 'success', uid: userRecord.uid, Email: UserEmail, Health: 140, Hunger: 140, Thirst: 140, coins: 20 , time: timestamp}));
                    console.log('Successfully created new user:', userRecord.uid);
                }
            });
        })
        .catch(function(error) {
            res.end(JSON.stringify({status: 'failed', error: error}));
            console.log('Error creating new user:', error);
        });
    });


app.post('/login', function(req,res) {
    console.log("HTTP Put Request: /login");
    res.contentType('application/json');
    var UserEmail = req.body.UserEmail;
    var UserPassword = req.body.UserPassword;
    firebase.auth().signInWithEmailAndPassword(UserEmail, UserPassword)
        .then(function(usrRecord) {
            var uid = usrRecord.user.uid;
            var referencePath = '/Users/'+uid+'/';
            var userReference = admin.database().ref(referencePath);
            userReference.on("value", 
			  function(snapshot) {
                    var usrInfo = snapshot.val();
                    res.end(JSON.stringify({status: "success", uid: uid, Email: usrInfo.Email, Health: usrInfo.Health, Hunger: usrInfo.Hunger, Thirst:usrInfo.Thirst, coins: usrInfo.coins, time: usrInfo.time}));
                    userReference.off("value");
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
                    res.end(JSON.stringify({status: "failed", error: errorObject}));
            });
        })
        .catch(function (err) {
            console.log(err);
            res.end(JSON.stringify({status: 'failed', error: err}));
        });
});
app.post('/getUserInfo', function(req,res) {
    console.log("HTTP Post Request: /getUserInfo");
    res.contentType('application/json');
    var uid = req.body.uid;
    var referencePath = '/Users/'+uid+'/';
    var userReference = admin.database().ref(referencePath);
    userReference.on("value", 
        function(snapshot) {
            var usrInfo = snapshot.val();
            res.end(JSON.stringify({status: "success", uid: uid, Email: usrInfo.Email, Health: usrInfo.Health, Hunger: usrInfo.Hunger, Thirst:usrInfo.Thirst, coins: usrInfo.coins, time: usrInfo.time}));
            userReference.off("value");
          }, 
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          res.end(JSON.stringify({status: "failed", error: errorObject}));
  });
});
app.post('/postUserInfo', function(req,res) {
    console.log("HTTP Post Request: /postUserInfo");
    res.contentType('application/json');
    var uid = req.body.uid;
    var UserEmail = req.body.Email;
    var hunger = req.body.Hunger;
    var health = req.body.Health;
    var thirst = req.body.Thirst;
    var referencePath = '/Users/'+uid+'/';
    var userReference = admin.database().ref(referencePath);
    var date = new Date();
    var timestamp = date.getTime();
    userReference.set({ uid: uid, Email: UserEmail, Health: health, Hunger: hunger, Thirst: thirst, coins: usrInfo.coins, time: timestamp}, 
        function(error) {
            if (error) {
                res.end(JSON.stringify({status: 'failed', error: error}));
                console.log("Data could not be saved." + error);
            } 
            else {
                res.end(JSON.stringify({status: 'success'}));
            }
        });
});
// Start http server and listen to port 3000.
app.listen(8080, function () {
console.log('Sample app listening on port');
});