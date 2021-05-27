// Modules
var firebase = require('firebase');
var config = require('../bin/config');
const fs = require('fs');
const Store = require('data-store');
const inquirer = require('inquirer');

firebase.initializeApp(config);
const rapidConfig = new Store({
    path: 'rapid.json'
});
const path = 'rapid.json'

exports.user = function () {
    fs.access(path, fs.F_OK, (err) => {
        if (err || rapidConfig.get('email') == undefined) {
            console.log("User doesn't exist(Run 'rapid create user or 'rapid login')")
        } else {
            console.log("Logged in as : " + rapidConfig.get('email'));
        }
    })
}

exports.signup = function () {
    inquirer.prompt([{
                name: 'email',
                message: 'Enter Email:',
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter Password',
            },
            {
                name: 'username',
                message: 'Enter a Username'
            }
        ])
        .then(answers => {
            var email = answers.email;
            var password = answers.password;
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function () {
                    rapidConfig.set('username', answers.username);
                    rapidConfig.set('email', answers.email);
                    rapidConfig.set('password', answers.password);
                    var username = rapidConfig.get('username');
                    var user = firebase.auth().currentUser;
                    console.log("Logging in as " + username);
                    user.updateProfile({
                            displayName: username,
                        })
                        .then(function () {
                            console.log("Logged in as " + answers.username);
                        })
                        .catch(function (error) {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            console.log("Error: " + errorCode + " : " + errorMessage);
                        });
                })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("Error: " + errorCode + " : " + errorMessage);
                });
        })
        .catch(function (error) {
            console.log(error);
        });
}

exports.login = function () {
    fs.access(path, fs.F_OK, (err) => {
        if (err || rapidConfig.get('email') == undefined) {
            inquirer.prompt([{
                        name: 'email',
                        message: 'Enter Email:',
                    },
                    {
                        type: 'password',
                        name: 'password',
                        message: 'Enter Password',
                    }
                ])
                .then(answers => {
                    var email = answers.email;
                    var password = answers.password;
                    firebase.auth().signInWithEmailAndPassword(email, password)
                        .then(function () {
                            var user = firebase.auth().currentUser;
                            rapidConfig.set('username', user.displayName);
                            rapidConfig.set('email', answers.email);
                            rapidConfig.set('password', answers.password);
                            console.log("Logged in as " + answers.email);
                        })
                        .catch(function (error) {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            console.log("Error: " + errorCode + " : " + errorMessage);
                        });
                });
        } else {
            console.log("Logged in as : " + rapidConfig.get('email'));
        }
    })
}