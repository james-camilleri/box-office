import { promises as fs } from 'fs'

export async function populateEnvFile(file, envVariables) {
  let env = await fs.readFile(file, 'utf-8')

  Object.entries(envVariables).forEach(([key, value]) => {
    env = env.replace(`${key}=`, `${key}=${value}`)
  })

  await fs.writeFile(file, env, { encoding: 'utf-8' })
}
