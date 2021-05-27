const fs = require('fs');
const Store = require('data-store');
var copy = require('recursive-copy');
const repoConfig = new Store({
    path: 'manifest.json'
});
const path = 'manifest.json'
var rmdir = require('rimraf');
var commitmessage;

function makeCommitNumber(length) {
    var commitNumber = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        commitNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    return commitNumber;
}

function makeCommit() {
    commitNumber = makeCommitNumber(10);
    fs.mkdirSync('.rapid/' + commitNumber);
    copy('master', '.rapid/' + commitNumber, /.*(.rapid|manifest.json)$/, function (err) {
        if (err) {
            return console.error(err);
        }
    });
    console.log("Committed All Files from Master Successfully");
    console.log("Commit Code : " + commitNumber);
    repoConfig.union('commit', commitNumber);
    repoConfig.union('commits.' + commitNumber, commitmessage);

}

exports.commit = function (commitMessage) {
    commitmessage = commitMessage;
    fs.access(path, fs.F_OK, (err) => {
        if (err || repoConfig.get('repoName') == undefined) {
            console.log("no manifest.json found")
        } else {
            var checkIfDirExist = fs.existsSync('.rapid');
            if (checkIfDirExist == true) {
                makeCommit();
            } else {
                fs.mkdirSync('.rapid');
                makeCommit();
            }
        }
    })
}

exports.getCommits = function () {
    fs.access(path, fs.F_OK, (err) => {
        if (err || repoConfig.get('repoName') == undefined) {
            console.log("no manifest.json found")
        } else {
            console.log(repoConfig.get('commits'))
        }
    })
}

exports.remove = function (commitNumber) {
    fs.access(path, fs.F_OK, (err) => {
        var commit = 'commits.' + commitNumber
        if (err || repoConfig.get(commit) == undefined) {
            console.log(commits)
            console.log("Commit not found")
        } else {
            repoConfig.del(commit)
            rmdir('.rapid/'+commitNumber, function (error) {
                console.log("Commit Removed Successfully")
            });
        }
    })
}
