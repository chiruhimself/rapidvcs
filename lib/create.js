const fs = require('fs');
const Store = require('data-store');
const inquirer = require('inquirer');

exports.repo = function () {
    const rapidConfig = new Store({
        path: 'rapid.json'
    });
    const path = 'rapid.json'
    fs.access(path, fs.F_OK, (err) => {
        if (err || rapidConfig.get('email') == undefined) {
            console.log("User doesn't exist(Run 'rapid create user or 'rapid login')")
        } else {
            inquirer.prompt([{
                        name: 'name',
                        message: 'Enter Repo Name(make sure to run this in working directory)'
                    },
                    {
                        name: 'visibility',
                        message: 'Create a Private Repo?',
                        type: "confirm",
                        default: false
                    }
                ])
                .then(answers => {
                    var reponame = answers.name;
                    var repo = "./" + reponame;
                    var master = "./" + reponame + "/master"

                    var checkIfDirExist = fs.existsSync(reponame);
                    if (checkIfDirExist == true) {
                        console.log("Repo Already Exists");
                    } else {
                        if (!fs.existsSync(repo)) {
                            var email = rapidConfig.get('email')
                            fs.mkdirSync(repo);
                            fs.mkdirSync(master);
                            console.log("Repo Created");
                            const repoConfig = new Store({
                                path: "./" + reponame + '/manifest.json'
                            })
                            repoConfig.set('repoName', reponame);
                            repoConfig.set('owner', email);
                            repoConfig.set('private', answers.visibility);
                            repoConfig.set('master', master);
                            repoConfig.union('branches', master)
                        }
                    }
                })
        }
    })
}

exports.branch = function () {
    const repoConfig = new Store({
        path: 'manifest.json'
    });
    const path = 'manifest.json'
    fs.access(path, fs.F_OK, (err) => {
        if (err || repoConfig.get('repoName') == undefined) {
            console.log("no manifest.json found")
        } else {
            inquirer.prompt([{
                    name: 'name',
                    message: 'Enter Branch Name(make sure to run this in root of project directory)'
                }])
                .then(answers => {
                    var branchname = answers.name;
                    var branch = "./" + branchname;
                    var checkIfDirExist = fs.existsSync(branchname);
                    if (checkIfDirExist == true) {
                        console.log("Branch Already Exists");
                    } else {
                        fs.mkdirSync(branch);
                        console.log("Branch Created");
                        repoConfig.union('branches', branch);
                    }
                })
        }
    })
}