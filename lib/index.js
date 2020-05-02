const fs = require('fs')
const path = require('path')
const { fommatText } = require('./doc')

const exists = async (filePath) => {
  return new Promise((resolve) => {
    fs.access(filePath, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

const getFiles = async (baseDir) => {
  let files = []
  if (!this.exist) {
    this.exist = await exists(baseDir)
    if (!this.exist) return files
  }
  let stat = await fs.promises.stat(baseDir)
  if (stat.isFile()) {
    files.push(baseDir)
  } else {
    let dirs = await fs.promises.readdir(baseDir)
    dirs = dirs.map(async (dir) => {
      let temp = await getFiles.apply(this, [path.join(baseDir, dir)])
      files = files.concat(temp)
    })
    await Promise.all(dirs)
  }
  return files
}

const readFiles = async (baseDir) => {
  let files = await getFiles(baseDir)
  let result = []
  if (files.length > 0) {
    files.forEach((t) => {
      let content = fs.readFileSync(t, { encoding: 'utf-8' })
      let temp = {}
      temp.tag = fommatText(content)
      temp.path = t
      result.push(temp)
    })
  }
  return result
}

const readFilesSync = (baseDir) => {
  if (!this.root) this.root = baseDir
  let result = []
  try {
    let stat = fs.statSync(baseDir)
    if (stat.isFile()) {
      let content = fs.readFileSync(baseDir, { encoding: 'utf-8' })
      let temp = {}
      let file = path.parse(baseDir)
      temp.dir = baseDir
      temp.fileName = file.name || file.base.name
      temp.eggPath = path.relative(this.root, file.dir).split(path.sep) || []
      temp.path = path.relative(this.root, file.dir).replace(path.sep, '/')
      temp.eggPath.push(temp.fileName).res
      temp.eggPath = temp.eggPath.filter((t) => t)
      let tag = fommatText(content, true)
      temp.tags = tag.tags
      temp.controller = tag.tags.find((t) => t.title === 'controller')
        ? tag.tags.find((t) => t.title === 'controller').description
        : ''
      temp.description = tag.description || ''
      temp.controller = temp.controller || temp.fileName
      let router = tag.tags.filter(
        (e) =>
          e.type &&
          ['get', 'post', 'delete', 'put', 'patch', 'options', 'head'].includes(
            e.type.name
          )
      )
      temp.router = router.map((t) => {
        t.type = t.type || {}
        let tempRouter = {
          action: t.description || '',
          type: t.type.name || 'get',
          method: t.name,
        }
        return tempRouter
      })
      result.push(temp)
    } else {
      let dirs = fs.readdirSync(baseDir)
      dirs.forEach((dir) => {
        let temp = readFilesSync.apply(this, [path.join(baseDir, dir)])

        result = result.concat(temp)
      })
    }
  } catch (error) {
    console.error(error)
    return result
  }

  return result
}

const getObject = (obj, props) => {
  let temp = obj
  props = props || []

  props.forEach((t) => {
    if (temp) temp = temp[t]
    else temp = null
  })
  return temp
}

const routerPath = (...router) => {
  let path = ''
  router = router.filter((t) => t)
  router.forEach((t) => {
    if (t.indexOf('/') !== 0) path += '/' + t
    else path += t
  })
  return path || '/'
}

module.exports = {
  getFiles,
  readFiles,
  readFilesSync,
  routerPath,
  path,
  fs,
  getObject,
}
