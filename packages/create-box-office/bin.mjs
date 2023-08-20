#!/usr/bin/env node

import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'

import {
  configureGit,
  configureNetlify,
  configureSanity,
  createProjectDir,
  getProjectInfo,
  installDependencies,
  populateEnvFile,
  // replacePlaceholders,
} from './installation-scripts/index.mjs'
import { replacePlaceholdersInFile, copyDir } from './utils/file.mjs'

async function initialise() {
  const defaults = { name: process.argv[2] }
  const cwd = defaults.name || '.'

  await createProjectDir(cwd)

  const projectInfo = await getProjectInfo(defaults)

  const packageName = projectInfo.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9~.-]+/g, '')

  console.log()
  console.log('Copying templates.')
  await copyDir(fileURLToPath(new URL('./template', import.meta.url).href), cwd)

  // npm won't publish .gitignore, so we need to save
  // it under a different name and then rename it.
  await fs.rename(`${cwd}/gitignore`, `${cwd}/.gitignore`)

  console.log()
  console.log('Installing dependencies.')
  await installDependencies(
    {
      dependencies: [
        'nodemailer',
        'react-dom',
        'react-is',
        'react',
        'sanity',
        'styled-components@^5.2',
      ],
      devDependencies: [
        '@netlify/functions',
        '@sanity/icons',
        '@sanity/ui',
        '@sanity/vision',
        '@the-gods/box-office',
        'env-cmd',
        'ts-node',
      ],
    },
    `${cwd}/sites/cms`,
  )
  await installDependencies(
    {
      devDependencies: [
        '@sveltejs/adapter-auto',
        '@sveltejs/kit',
        '@the-gods/box-office',
        'svelte',
        'svelte-preprocess',
        'vite',
      ],
    },
    `${cwd}/sites/web`,
  )

  console.log()
  console.log('Initialising Sanity project.')
  const sanityConfig = await configureSanity({
    name: projectInfo.name,
    dest: `${cwd}/sites/cms`,
    corsOrigins: [
      'http://sveltekit-prerender',
      `https://${projectInfo.sveltekitUrl}`,
      `https://${projectInfo.sanityUrl}`,
    ],
  })

  // Re-copy tsconfig that gets overwritten.
  await fs.copyFile(
    fileURLToPath(new URL('./template/sites/cms/tsconfig.json', import.meta.url).href),
    `${cwd}/sites/cms/tsconfig.json`,
  )

  // Remove unneeded schemas directory.
  await fs.rm(`${cwd}/sites/cms/schemas`, { recursive: true, force: true })

  const dictionary = {
    name: projectInfo.name,
    packageName,
    ...sanityConfig,
  }

  console.log()
  console.log('Replacing template placeholders.')
  await Promise.all(
    ['sites/cms/package.json', 'sites/cms/sanity.config.ts', 'sites/web/package.json'].map((path) =>
      replacePlaceholdersInFile(`${cwd}/${path}`, dictionary),
    ),
  )

  console.log()
  console.log('Writing environment variables to .env file.')
  const environmentVariables = {
    ...Object.entries(projectInfo)
      .filter(([key]) => key[0] === key[0].toUpperCase())
      .reduce((envVariables, [key, value]) => ({ ...envVariables, [key]: value }), []),

    ORGANISATION_NAME: projectInfo.name,
    FRONT_END_URL: projectInfo.sveltekitUrl,
    SANITY_API_KEY: sanityConfig.sanityApiKey,
    SANITY_API_VERSION: sanityConfig.sanityApiVersion,
    SANITY_PROJECT_ID: sanityConfig.sanityProjectId,
    SANITY_DATASET: 'production',
    PUBLIC_USE_STRIPE_TEST: 'true',
  }

  await populateEnvFile(`${cwd}/sites/cms/.env`, environmentVariables)
  await populateEnvFile(`${cwd}/sites/web/.env`, environmentVariables)

  if (projectInfo.initGit) {
    console.log()
    console.log('Initialising git repository.')
    await configureGit(cwd, projectInfo.pushToGitHub, `${packageName}-tickets`)
  }

  if (projectInfo.configNetlify) {
    console.log()
    console.log('Configuring Netlify.')
    await configureNetlify(`${cwd}/sites/web`, `${cwd}/sites/cms`)
  }
}

initialise()
