import { spawn } from '../utils/process.mjs'

export async function installDependencies({ dependencies, devDependencies }, dest) {
  if (dependencies) {
    await spawn('pnpm', ['i', ...dependencies], dest)
  }

  if (devDependencies) {
    await spawn('pnpm', ['i', '-D', ...devDependencies], dest)
  }
}
