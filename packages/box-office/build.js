import { promises as fs } from 'fs'
import path from 'path'

export async function copyDirAndRewritePaths(srcPath, destPath) {
  let dest = path.resolve(destPath)
  const current = path.resolve(srcPath)

  mkdirp(dest)

  const files = await fs.readdir(current)

  for (const file of files) {
    const src = path.resolve(path.join(current, file))
    dest = path.resolve(path.join(destPath, file))

    const srcObj = await fs.lstat(src)
    if (srcObj.isDirectory()) {
      await copyDirAndRewritePaths(src, dest)
    } else {
      // await fs.copyFile(src, dest)
      await readAndRewrite(src, dest)
    }
  }
}

async function mkdirp(dir) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (e) {
    if (e.code === 'EEXIST') return
    throw e
  }
}

async function readAndRewrite(src, dest) {
  const replacements = { $shared: `_shared` }

  return Promise.all(
    Object.entries(replacements).map(async ([alias, replacementPath]) => {
      const dir = path.dirname(src)
      const fullPath = path
        .relative(dir, replacementPath)
        .replaceAll(path.sep, '/')
        .replace('../', '') // Remove first level because we're working in a directory below the cwd

      const sourceText = await fs.readFile(src, { encoding: 'utf-8' })
      const destinationText = sourceText.replaceAll(
        new RegExp('\\' + alias + `/(.*)(['"])`, 'g'),
        `${fullPath}/$1/index.js$2`,
      )

      return fs.writeFile(dest, destinationText, { encoding: 'utf-8' })
    }),
  )
}

async function build() {
  await fs.rm('./dist', { recursive: true, force: true })
  await copyDirAndRewritePaths('./src', './dist')
}

build()
