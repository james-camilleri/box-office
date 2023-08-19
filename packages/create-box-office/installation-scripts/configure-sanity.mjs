import { promises as fs } from 'fs'
import stripAnsi from 'strip-ansi'

import { crossPlatform, spawn, exec } from '../utils/process.mjs'

export async function configureSanity({ name, dest, corsOrigins }) {
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
    sanityConfig = await fs.readFile(`${dest}/sanity.cli.ts`, 'utf-8')
  } catch (e) {
    console.error('Could not read sanity.cli.ts')
    return
  }

  const [, projectId] = sanityConfig.match(
    /export default defineCliConfig\({[\s\S]+api:\s+{[\s\S]+projectId:\s+'(.*)',/m,
  )

  const sanityInfo = stripAnsi(await exec(crossPlatform('sanity debug --secrets'), dest))
  const [, sanityAuthToken] = sanityInfo.match(/Auth token:\s+'(.*)'/)

  const sanityApiVersion = new Date().toISOString().slice(0, 8) + '01'

  const headers = {
    Authorization: `Bearer ${sanityAuthToken}`,
    'Content-Type': 'application/json',
  }

  console.log('Creating Sanity.io API key.')
  const sanityApiKey = await fetch(
    `https://api.sanity.io/v${sanityApiVersion}/projects/${projectId}/tokens`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        label: 'website',
        roleName: 'editor',
      }),
    },
  )
    .then((response) => response.json())
    .then(({ key }) => key)

  console.log('Adding Sanity.io CORS origins:')
  await Promise.all(
    corsOrigins?.map(async (origin) => {
      console.log('>', origin)
      return fetch(`https://api.sanity.io/v${sanityApiVersion}/projects/${projectId}/cors`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ origin }),
      })
    }),
  )

  const sanityProperties = {
    sanityProjectId: projectId,
    sanityApiVersion,
    sanityApiKey,
  }

  return sanityProperties
}
