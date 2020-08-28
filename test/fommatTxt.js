const { fommatText } = require('../lib/doc')
const ss = `
/**
 * 首页
 * @controller home
 * @param {get} index :id
 */`

let s = fommatText(ss)
console.log(s[0])
