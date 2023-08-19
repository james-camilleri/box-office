import { promises as fs } from 'fs'
import { crossPlatform, exec, spawn } from '../utils/process.mjs'

export async function configureNetlify(...paths) {
  try {
    exec('netlify')
  } catch {
    await spawn(crossPlatform('npm'), ['install', '--global', 'netlify-cli'])
  }

  await spawn(crossPlatform('netlify'), ['switch'])

  for (const path of paths) {
    await spawn(crossPlatform('netlify'), ['init'], path)

    try {
      await fs.access(`${path}/.env`)
      await spawn(crossPlatform('netlify'), ['env:import', `${path}/.env`], path)
    } catch {
      // .env file does not exist, keep calm and carry on
    }
  }
}
