//Server
var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); //need to parse HTTP request body


var config = {
    apiKey: "AIzaSyDqQD1lyxMgTFcKcYi0XtNlMtzGNlLp2zY",
    authDomain: "tamagotchi-server.firebaseapp.com",
    databaseURL: "https://tamagotchi-server.firebaseio.com",
    projectId: "tamagotchi-server",
    storageBucket: "tamagotchi-server.appspot.com",
    messagingSenderId: "1096773357408"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {    
        var uid = user.uid;
        console.log('Uid: ' + uid);
        var referencePath = '/Users/'+uid+'/';
        var userReference = firebase.database().ref(referencePath);
        console.log('(onAuthStateChanged) User Reference: ' +  userReference.toString());
        userReference.once('value', function(snapshot) {
            if (!snapshot.exists()) {
                userReference.set({ Email: user.email, Health: 100, Hunger: 100, Thirst: 100}, 
                    function(error) {
                       if (error) {
                           console.log("Data could not be saved." + error);
                       } 
                       else {
                           console.log("Data saved successfully.");
                       }
                });
            }
        });
      // ...
    } else {
      // User is signed out.
      // ...
    }
});

//Fetch instances
app.get('/', function (req, res) {

	console.log("HTTP Get Request");
	var userReference = firebase.database().ref("/Users/");

	//Attach an asynchronous callback to read the data
	userReference.on("value", 
			  function(snapshot) {
					console.log(snapshot.val());
					res.json(snapshot.val());
					userReference.off("value");
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});
app.get('/signout', function(req,res) {
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        }, function(error) {
            console.error('Sign Out Error', error);
    });
});

//Create new instance
app.put('/', function (req, res) {

	console.log("HTTP Put Request");

	var userName = req.body.UserName;
	var name = req.body.Name;
	var age = req.body.Age;

	var referencePath = '/Users/'+userName+'/';
	var userReference = firebase.database().ref(referencePath);
	userReference.set({Name: name, Age: age}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("Data saved successfully.");
					}
			});
});
app.put('/signup', function(req,res) {
    console.log("HTTP Put Request: /signup");

    var email = req.body.UserEmail;
    var password = req.body.UserPassword;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (err) {
            // Handle errors
            if (err) {
                console.log(err);
                res.status(404).send(err);

            } else {
                console.log('Created the user succesfully');
                console.log('User info: ');
                console.log(email + ' ' + password);
            }
        });
    res.end();
});
app.put('/signout', function(req,res) {
    console.log("HTTP Put Request: /signout");
    var email = req.body.UserEmail;
    var password = req.body.UserPassword;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (err) {
            // Handle errors
            if (err) {
                console.log(err);
                res.status(404).send(err);

            } else {
                console.log('Created the user succesfully');
                console.log('User info: ');
                console.log(email + ' ' + password);
            }
        });
    res.end();
});

//Update existing instance
app.post('/', function (req, res) {

	console.log("HTTP POST Request");

	var userName = req.body.UserName;
	var name = req.body.Name;
	var age = req.body.Age;

	var referencePath = '/Users/'+userName+'/';
	var userReference = firebase.database().ref(referencePath);
	userReference.update({Name: name, Age: age}, 
				 function(error) {
					if (error) {
						res.send("Data could not be updated." + error);
					} 
					else {
						res.send("Data updated successfully.");
					}
			    });
});

//Delete an instance
app.delete('/', function (req, res) {

   console.log("HTTP DELETE Request");
   //todo
});
var server = app.listen(8080, function () {
  
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});