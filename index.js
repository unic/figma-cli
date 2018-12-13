#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const axios = require('axios');
const _ = require('lodash');

let config = {
    figmaToken: '5856-2d950e88-dbf9-4de8-a3a8-cfd72e779e52',
    teamID: '649509328846827012',
    projectID: false,
    output: 'json'
};

program
    .version('0.0.1', '-v, --version')
    .option('-to, --token [token]', 'Add a Figma token [token]', false)
    .option('-t, --team [id]', 'Add a Figma team id [id]', false)
    .option('-p, --project [id]', 'Add a Figma project id [id]', false)
    .option('-o, --output [id]', 'Output format type [type]', false)
    .parse(process.argv);

if (program.token) config.figmaToken = program.token;
if (program.team) config.teamID = program.team;
if (program.project) config.projectID = program.project;
if (program.output) config.output = program.output;

// Say hello!

console.log('');
console.log('');
console.log('  Welcome to the ' + chalk.bold.hex('#f0441c')('F') + chalk.bold.hex('#ff6658')('I') + chalk.bold.hex('#974fff')('G') + chalk.bold.hex('#17b4fe')('M') + chalk.bold.hex('#0ec878')('A') + ' CLI');
console.log('');
console.log('');

// Ask for the project if no project id is given:

if (!config.projectID) {

    console.log('  Looking for projects ...');
    console.log('');

    axios.get(`https://api.figma.com/v1/teams/${config.teamID}/projects`, {
        headers: {
            'X-Figma-Token': config.figmaToken
        }
    })
    .then(function (response) {
        let projects = _.map(response.data.projects, 'name');

        inquirer.prompt([{
            type: 'list',
            message: 'Which project?',
            name: 'project',
            choices: projects,
        }]).then(function (answers) {
            let projectName = answers.project,
                projectID;

            for (let project of response.data.projects) {
                if (project.name === projectName) {
                    projectID = project.id;
                }
            }

            if (projectID) {
                config.projectID = projectID;
                getColorFileKey(projectID, config.figmaToken);
            }
        });
    })
    .catch(function (error) {
        console.log(error);
    });

}

// Get all documents of this project:

function getColorFileKey(projectID, figmaToken) {
    axios.get(`https://api.figma.com/v1/projects/${config.projectID}/files`, {
        headers: {
            'X-Figma-Token': config.figmaToken
        }
    })
        .then(function (response) {
            let files = _.map(response.data.files, 'name');

            inquirer.prompt([{
                type: 'list',
                message: 'Which document contains color definitions?',
                name: 'file',
                choices: files,
            }]).then(function (answers) {
                let fileName = answers.file,
                    fileKey;

                for (let file of response.data.files) {
                    if (file.name === fileName) {
                        fileKey = file.key;
                    }
                }

                if (fileKey) {
                    config.colorsFileKey = fileKey;
                    
                    getFileStyles(fileKey);
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Get all styles in a file:

function getFileStyles(fileKey) {

    console.log('');
    console.log('  Reading file ...');
    console.log('');

    axios.get(`https://api.figma.com/v1/files/${fileKey}`, {
        headers: {
            'X-Figma-Token': config.figmaToken
        }
    })
        .then(function (response) {
            let styles = response.data.styles;

            console.log('  Colors:');

            for (let key in response.data.styles) {
                if (response.data.styles.hasOwnProperty(key)) {
                    let style = response.data.styles[key];

                    if (style.styleType === 'FILL') {
                        console.log('    - ' + style.name);
                    }
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

