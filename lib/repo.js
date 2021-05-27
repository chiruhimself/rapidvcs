const fs = require('fs');

var copy = require('recursive-copy');
const empty = require('empty-folder');
var path = './master'
const Store = require('data-store');
const repoConfig = new Store({
    path: 'manifest.json'
});

exports.rollback = function (commitNumber) {
    var commitNumber = commitNumber;
    fs.access(path, fs.F_OK, (err) => {
        var commit = 'commits.' + commitNumber
        console.log(commit)
        if (err || repoConfig.get(commit) == undefined) {
            console.log("Commit not found")
        } else {
            empty('./master', false, (err) => {
                if (err.error) console.error(err.error);
                //console.log(o.removed);
                //console.log(o.failed);
            });
            copy('.rapid/' + commitNumber, 'master', /.*(.rapid|manifest.json)$/, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        }
    })
}