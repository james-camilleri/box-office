import { promises as fs } from 'fs'
import path from 'path'

// Adapted from @nmicht/create-nodejs-project
// https://github.com/nmicht/create-nodejs-project
export async function copyDir(srcPath, destPath) {
  let dest = path.resolve(destPath)
  const current = path.resolve(srcPath)

  // Create the dest folder
  mkdirp(dest)

  // Read files in folder
  const files = await fs.readdir(current)

  for (const file of files) {
    const src = path.resolve(path.join(current, file))
    dest = path.resolve(path.join(destPath, file))

    const srcObj = await fs.lstat(src)
    if (srcObj.isDirectory()) {
      // Recursive copy for folders
      await copyDir(src, dest)
    } else {
      // Copy file
      await fs.copyFile(src, dest)
    }
  }
}

export async function mkdirp(dir) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (e) {
    if (e.code === 'EEXIST') return
    throw e
  }
}

export async function deleteFiles(fileList, dest) {
  if (!fileList) return

  for (const file of fileList) {
    await fs.unlink(`${dest}/${file}`)
  }
}

export async function readJson(file) {
  const contents = await fs.readFile(file, 'utf8')
  return JSON.parse(contents)
}

export async function replacePlaceholdersInFile(filePath, dictionary) {
  let contents = await fs.readFile(filePath, 'utf8')

  for (const [key, value] of Object.entries(dictionary)) {
    contents = contents.replace(`{{${key}}}`, value)
  }

  await fs.writeFile(filePath, contents)
}
