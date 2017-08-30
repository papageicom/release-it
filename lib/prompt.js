import inquirer from 'inquirer';
import { config } from './config';
import { format } from './util';

const { options } = config;

const noop = Promise.resolve();

const prompts = {
  status: {
    type: 'confirm',
    message: () => 'Show staged files?'
  },
  commit: {
    type: 'confirm',
    message: (subject, version) => `Commit (${format(options[subject].commitMessage, version)})?`
  },
  tag: {
    type: 'confirm',
    message: (subject, version) => `Tag (${format(options[subject].tagName, version)})?`
  },
  push: {
    type: 'confirm',
    message: () => 'Push?'
  },
  release: {
    type: 'confirm',
    message: (subject, version) => `Create a release on GitHub (${format(options.github.releaseName, version)})?`
  },
  publish: {
    type: 'confirm',
    message: () => `Publish ${options.name} to npm?`
  }
};

export default async function(subject, version, promptName, task) {
  const prompt = Object.assign({}, prompts[promptName], {
    name: promptName,
    message: prompts[promptName].message(subject, version),
    default: options.prompt[subject][promptName]
  });

  const answers = await inquirer.prompt([prompt]);

  return answers[promptName] ? await task() : noop;
}