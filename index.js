const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const github = require('./lib/github');
const repo = require('./lib/repo');
const files = require('./lib/files');

clear();
console.log(chalk.yellow(figlet.textSync('Ginit', { horizontalLayout: 'full' })));

if (files.directoryExists('.git')) {
  console.log(chalk.red('Already a git repository!'));
  process.exit();
}

const getGithubToken = async () => {
  const sotredToken = github.getStoredGithubToken();
  if (sotredToken) {
    github.authWithToken(sotredToken);
    console.log(chalk.green('Use stored token.'));
    return sotredToken;
  }

  const [token] = await inquirer.askGithubCredentialsWithToken();
  github.authWithToken(token);
  github.saveGithubToken(token); // 次回以降トークンを入力しないですむように
  return token;
};

const run = async () => {
  try {
    await getGithubToken();

    const url = await repo.createRemoteRepo();

    await repo.createGitignore();

    const done = await repo.setupRepo(url);
    if (done) {
      console.log(chalk.green('All done!'));
    }
  } catch (err) {
    if (err) {
      switch (err.code) {
        case 401:
          console.log(chalk.red('Could\'t log you in. Please provide correct credentials/token.'));
          break;
        case 422:
          console.log(chalk.red('There already exists a remote repository with the same name'));
          break;
        default:
          console.log(err);
      }
    }
  }
};

run();
