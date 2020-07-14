const doctrine = require('doctrine')

/**
 * 格式化
 * @param val doc text
 */
const fommat = (val) => {
  let data = {}
  if (val instanceof Array) {
    // data = doctrine.parse(val.join('\n'), { unwrap: true })
    data = []
    val.forEach((t) => {
      data.push(doctrine.parse(t, { unwrap: true, recoverable: true }))
    })
  } else data = doctrine.parse(val, { unwrap: true })
  return data
}

/**
 * 格式化
 * @param {string} text  js file
 * @param {boolean} isFirst  js file
 */
const fommatText = (text, isFirst) => {
  const REGEX = /\/\*{2}(.|\s|\r\n)*?\*\//g
  const val = text.match(REGEX)
  if (val && isFirst) return fommat(val[0])
  if (val) return fommat(val)
  return []
}

module.exports = {
  fommat,
  fommatText,
}
