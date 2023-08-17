import { promises as fs } from 'fs'

// import { generate } from '@james-camilleri/sanity-schema-setup/generate/index.mjs'
import inquirer from 'inquirer'

// import { replacePlaceholdersInFile } from '../utils/file.mjs'
import { spawn } from '../utils/process.mjs'

export async function configureSanity({ name, dest }) {
  await spawn(
    'pnpm',
    [
      'create',
      'sanity@latest',
      '-y',
      '--create-project',
      name,
      '--dataset',
      'production',
      '--output-path',
      '.',
      '--typescript',
    ],
    dest,
  )

  // `sanity init` seems to be auto-creating a git repository and screwing a
  // bunch of things up. Delete the `.git` folder.
  try {
    await fs.rm(`${dest}/.git`, { recursive: true, force: true })
  } catch {
    // Don't worry if the git repository hasn't actually been created.
  }

  let sanityConfig
  try {
    sanityConfig = await fs.readFile(`${dest}/sanity.cli.ts`, 'utf8')
  } catch (e) {
    console.error('Could not read sanity.cli.ts')
    return
  }

  const [_, projectId] = sanityConfig.match(
    /export default defineCliConfig\({[\s\S]+api:\s+{[\s\S]+projectId:\s+'(.*)',/m,
  )

  const sanityApiKey = (
    await inquirer.prompt({
      type: 'input',
      name: 'key',
      message: 'Sanity read/write API key:',
    })
  ).key

  const sanityProperties = {
    sanityProjectId: projectId,
    sanityApiVersion: new Date().toISOString().slice(0, 8) + '01',
    sanityApiKey,
  }

  // console.log('Generating Sanity schema.')
  // await generate(dest, projectInfo, sanityApiKey)

  return sanityProperties
}
