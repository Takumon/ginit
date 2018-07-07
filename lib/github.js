const octokit = require('@octokit/rest')();
const Configstore = require('configstore');
const pkg = require('../package.json');
const _ = require('lodash');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const inquirer = require('./inquirer');

const conf = new Configstore(pkg.name);

module.exports = {
  getInstance: () => octokit,

  setGithubCredentialsWithToken: async () => {
    const credentials = await inquirer.askGithubCredentialsWithToken();

    return credentials.token;
  },

  authWithToken: token => octokit.authenticate({ type: 'token', token }),

  getStoredGithubToken: () => conf.get('github.token'),
  saveGithubToken: token => conf.set('github.token', token)
};
