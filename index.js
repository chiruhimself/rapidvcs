#!/usr/bin/env node

// Modules
const pkg = require('./package.json');
var user = require('./lib/user');
var create = require('./lib/create');
var commit = require('./lib/commit');
var repo = require('./lib/repo');
var figlet = require('figlet');
const chalk = require('chalk');

// Version Function
function getVersion() {
    console.log(
        chalk.yellow(figlet.textSync('RapidVCS')) +
        "\nv" + pkg.version
    );
}

// Help Function
function getHelp() {
    console.log(
        chalk.yellow(figlet.textSync('RapidVCS')) +
        "\nUsage: rapid <command>" +
        "\n\nhelp\t\t\t\tget help" +
        "\nversion\t\t\t\tget version" +
        "\nuser\t\t\t\tget user details" +
        "\nlogin\t\t\t\tlogin to rapidvcs" +
        "\ncreate <options>\t\tcreate (User/Repo/Branch)" +
        "\ncommit <message>\t\tcommits exisiting changes" +
        "\nlistc\t\t\t\tlists all the commits" +
        "\nremove commit <commitNumber>\tremoves the specified commit" +
        "\nrollback <commitNumber>\t\trollsback repo to specified commit point" +
        "\nclone(WIP)\t\t\t\tclones a repo"+
        "\ndiff(WIP)\t\t\t\tfind diff between remote and local"+
        "\npush(WIP)\t\t\t\tpushes all the changes to remote"+
        "\npull(WIP)\t\t\t\tfetch all the changes from remote"
    );
}

// Main Function
function main() {
    // Get Arguments
    var firstArgument = process.argv[2];
    var secondArgument = process.argv[3];

    // If no arguments are passed
    if (firstArgument == undefined && secondArgument == undefined) {
        getHelp();
    }
    // If one argument is passed 
    else if (firstArgument != undefined && secondArgument == undefined) {
        switch (firstArgument) {
            case 'help':
                getHelp();
                break;
            case 'version':
                getVersion();
                break;
            case 'login':
                user.login();
                break;
            case 'user':
                user.user();
                break;
            case 'clone':
                repo.clone();
                break;
            case 'push':
                repo.push();
                break;
            case 'pull':
                repo.pull();
                break;
            case 'diff':
                commit.diff();
                break;
            case 'listc':
                commit.getCommits();
                break;
            default:
                getHelp();
                break;
        }
    }
    // If two arguments are passed
    else if (firstArgument != undefined && secondArgument != undefined) {
        switch (firstArgument) {
            case 'create':
                if (secondArgument == 'user') {
                    user.signup();
                } else if (secondArgument == 'repo') {
                    create.repo();
                } else if (secondArgument == 'branch') {
                    create.branch();
                } else {
                    getHelp();
                }
                break;
            case 'remove':
                if (secondArgument == 'commit') {
                    thirdArgument = process.argv[4];
                    commit.remove(thirdArgument);
                } else {
                    getHelp();
                }
                break;
            case 'rollback':
                repo.rollback(secondArgument);
                break;
            case 'commit':
                commit.commit(secondArgument);
                break;
            default:
                getHelp();
                break;
        }
    }
    // Exception Case
    else {
        getHelp();
    }
}

// Program Starts Here
main();