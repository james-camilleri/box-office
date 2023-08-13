import * as childProcess from 'child_process'

export async function exec(command, cwd) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, { cwd }, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }

      resolve({ stdout, stderr })
    })
  })
}

export async function spawn(command, args, cwd) {
  const proc = childProcess.spawn(command, args, {
    stdio: 'inherit',
    cwd,
  })

  await new Promise((resolve, reject) => {
    proc.on('error', reject)
    proc.on('exit', (exitCode) => {
      if (exitCode !== 0) {
        reject(
          new Error(
            `The command "${command} ${args.join(
              ' ',
            )}" exited with status code ${exitCode}`,
          ),
        )
      } else {
        resolve()
      }
    })
  })
}

export function crossPlatform(command) {
  return /^win/.test(process.platform) ? `${command}.cmd` : command
}
