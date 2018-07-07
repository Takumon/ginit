const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
  askGithubCredentialsWithToken: () => {
    const questions = [
      {
        name: 'token',
        type: 'password',
        message: 'Enter your Github token:',
        validate: value => (value.length ? true : 'Please enter your token')
      }
    ];

    return inquirer.prompt(questions);
  },

  askRepoDetails: () => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the repository:',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: value => (value.length ? true : 'Please enter a name for the repository.')
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private',
        choices: ['public', 'private'],
        default: 'public'
      }
    ];
    return inquirer.prompt(questions);
  },

  askIgnoreFiles: filelist => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components']
      }
    ];
    return inquirer.prompt(questions);
  }
};
