import inquirer from 'inquirer'

export function getProjectInfo(defaults) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Performance name (use the correct case & punctuation):',
      default: defaults.name,
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialise git repository:',
      default: true,
    },
    {
      type: 'confirm',
      name: 'pushToGitHub',
      message: 'Push project to GitHub:',
      default: true,
      when: ({ initGit }) => initGit,
    },
    {
      type: 'confirm',
      name: 'configNetlify',
      message: 'Configure Netlify:',
      default: true,
      when: ({ pushToGitHub }) => pushToGitHub,
    },
  ])
}
