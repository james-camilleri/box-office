import { exec } from '../utils/process.mjs'

export async function configureGit(cwd, pushToGitHub, name) {
  await exec('git init', cwd)
  await exec('git branch -m main', cwd)
  await exec('git add .', cwd)
  await exec('git commit -m"Initial commit"', cwd)

  if (pushToGitHub) {
    await exec(`gh repo create ${name} --private --source=.`, cwd)
    await exec('git push --set-upstream origin main', cwd)
  }
}
