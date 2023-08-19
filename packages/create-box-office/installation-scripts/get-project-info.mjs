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
    {
      type: 'input',
      name: 'sveltekitUrl',
      message: 'Front-end URL:',
    },
    {
      type: 'input',
      name: 'sanityUrl',
      message: 'Back-end URL:',
      default: (answers) => `manage.${answers.sveltekitUrl}`,
    },
    {
      type: 'input',
      name: 'MAILJET_API_KEY',
      message: 'Mailjet API key:',
    },
    {
      type: 'input',
      name: 'MAILJET_SECRET_KEY',
      message: 'Mailjet secret key:',
    },
    {
      type: 'input',
      name: 'STRIPE_API_KEY',
      message: 'Stripe API key:',
    },
    {
      type: 'input',
      name: 'STRIPE_SECRET_KEY',
      message: 'Stripe secret key:',
    },
    {
      type: 'input',
      name: 'STRIPE_WEBHOOK_SECRET',
      message: 'Stripe webhook secret:',
    },
    {
      type: 'input',
      name: 'REPORT_EMAILS',
      message: 'Report emails (comma separated):',
    },
  ])
}
