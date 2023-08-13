import { crossPlatform, spawn } from '../utils/process.mjs'

export async function configureNetlify(...paths) {
  // TODO add some try catch to avoid doing this unnecessarily.
  await spawn(crossPlatform('npm'), ['install', '--global', 'netlify-cli'])
  await spawn(crossPlatform('netlify'), ['switch'])

  for (const path of paths) {
    await spawn(crossPlatform('netlify'), ['init'], path)
  }
}
