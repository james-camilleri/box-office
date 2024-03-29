import inquirer from 'inquirer'

export function getProjectInfo(defaults) {
  return inquirer.prompt([
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
      name: 'name',
      message: 'Organisation name:',
      default: defaults.name,
    },
    {
      type: 'input',
      name: 'EMAIL',
      message: 'Email address (for tickets):',
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
      name: 'PUBLIC_STRIPE_TEST_API_KEY',
      message: 'Stripe API key (test):',
    },
    {
      type: 'input',
      name: 'STRIPE_TEST_SECRET_KEY',
      message: 'Stripe secret key (test):',
    },
    {
      type: 'input',
      name: 'STRIPE_TEST_WEBHOOK_SECRET',
      message: 'Stripe webhook secret (test, own account):',
    },
    {
      type: 'input',
      name: 'STRIPE_TEST_CONNECT_WEBHOOK_SECRET',
      message: 'Stripe webhook secret (test, connected accounts):',
    },
    {
      type: 'input',
      name: 'PUBLIC_STRIPE_LIVE_API_KEY',
      message: 'Stripe API key (live):',
    },
    {
      type: 'input',
      name: 'STRIPE_LIVE_SECRET_KEY',
      message: 'Stripe secret key (live):',
    },
    {
      type: 'input',
      name: 'STRIPE_LIVE_WEBHOOK_SECRET',
      message: 'Stripe webhook secret (live, own account):',
    },
    {
      type: 'input',
      name: 'STRIPE_LIVE_CONNECT_WEBHOOK_SECRET',
      message: 'Stripe webhook secret (live, connected accounts):',
    },
    {
      type: 'input',
      name: 'REPORT_EMAILS',
      message: 'Report emails (comma separated):',
    },
  ])
}
