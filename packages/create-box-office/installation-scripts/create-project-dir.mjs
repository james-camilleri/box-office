import fs from 'fs'

import inquirer from 'inquirer'

import { mkdirp } from '../utils/file.mjs'

export async function createProjectDir(cwd) {
  if (fs.existsSync(cwd)) {
    if (fs.readdirSync(cwd).length > 0) {
      const response = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'value',
          message: 'Directory not empty. Continue?',
          initial: false,
        },
      ])

      if (!response.value) {
        process.exit(1)
      }
    }
  } else {
    await mkdirp(cwd)
  }
}
