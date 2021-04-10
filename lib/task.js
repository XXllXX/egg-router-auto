const through = require('through2')
const { fommatText } = require('./doc')
const Vinyl = require('vinyl')
function scan() {
  var stream = through.obj(async function (file, encoding, down) {
    if (file.isBuffer()) {
      const content = file.contents.toString(encoding)
      let tags = fommatText(content, true)
      let temp = new Vinyl({
        stem: file.stem,
        path: file.path,
        contents: file.contents,
        customOption: tags,
      })
      this.push(temp)
      return down()
    }
  })
  return stream
}

function generate(callback) {
  var stream = through.obj(async function (file, encoding, down) {
    if (file.customOption && file.customOption.tags) {
      let tags = file.customOption.tags
      let data = {
        fileName: file.stem,
        controller: file.stem,
        routers: [],
        dirname: file.dirname,
        path: file.path,
        description: file.customOption.description,
      }
      let tag = tags.find((t) => t.title === 'controller')
      if (tag) data.controller = tag.description
      let routers = tags.filter(
        (e) =>
          e.type &&
          ['get', 'post', 'delete', 'put', 'patch', 'options', 'head'].includes(
            e.type.name
          )
      )
      data.routers = routers.map((t) => {
        t.type = t.type || {}
        let tempRouter = {
          action: t.description || '',
          type: t.type.name || 'get',
          method: t.name,
        }
        return tempRouter
      })

      await callback(data)
    }
    down()
  })
  return stream
}

module.exports = {
  scan,
  generate,
}
