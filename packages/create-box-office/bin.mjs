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
  // replacePlaceholders,
} from './installation-scripts/index.mjs'
import { replacePlaceholdersInFile, copyDir } from './utils/file.mjs'

async function initialise() {
  const defaults = { name: process.argv[2] }
  const cwd = defaults.name || '.'

  await createProjectDir(cwd)

  const projectInfo = await getProjectInfo(defaults)
  const environmentVariables = Object.entries(projectInfo).filter(
    ([key]) => key[0] === key[0].toUpperCase(),
  )
  // .reduce((envVariables, [key, value]) => ({ ...envVariables, [key]: value }), [])

  const packageName = projectInfo.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9~.-]+/g, '')

  console.log()
  console.log('Copying templates.')
  await copyDir(fileURLToPath(new URL(`./template`, import.meta.url).href), cwd)

  // npm won't publish .gitignore, so we need to save
  // it under a different name and then rename it.
  await fs.rename(`${cwd}/gitignore`, `${cwd}/.gitignore`)
  await fs.rename(`${cwd}/sites/cms/gitignore`, `${cwd}/sites/cms/.gitignore`)
  // await fs.rename(`${cwd}/sites/web/gitignore`, `${cwd}/sites/web/.gitignore`)

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
      devDependencies: ['@the-gods/box-office'],
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
  await fs.copyFile('./template/sites/cms/tsconfig.json', `${cwd}/sites/cms/tsconfig.json`)

  const dictionary = {
    name: projectInfo.name,
    packageName,
    ...sanityConfig,
  }
  console.log('dictionary', dictionary)

  console.log()
  console.log('Replacing template placeholders.')
  await Promise.all(
    ['sites/cms/package.json', 'sites/cms/sanity.config.ts', 'sites/web/package.json'].map((path) =>
      replacePlaceholdersInFile(`${cwd}/${path}`, dictionary),
    ),
  )

  console.log()
  console.log('Writing environment variables to .env file.')
  const environmentVarString = [
    ...environmentVariables,
    ['SANITY_API_KEY', sanityConfig.sanityApiKey],
  ]
    .map((kvPair) => kvPair.join('='))
    .join('\n')
  await fs.writeFile(`${cwd}/sites/cms/.env`, environmentVarString, { encoding: 'utf-8' })
  await fs.writeFile(`${cwd}/sites/web/.env`, environmentVarString, { encoding: 'utf-8' })

  if (projectInfo.initGit) {
    console.log()
    console.log('Initialising git repository.')
    await configureGit(cwd, projectInfo.pushToGitHub, packageName)
  }

  if (projectInfo.configNetlify) {
    console.log()
    console.log('Configuring Netlify.')
    await configureNetlify(`${cwd}/sites/web`, `${cwd}/sites/cms`)

    // TODO: Post ENV variables to Netlify
  }
}

initialise()
