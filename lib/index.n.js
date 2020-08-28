const { src } = require('gulp')
const { scan, generate } = require('./task')

/**
 * 扫描js生成路由
 */
module.exports = function (path, callback) {
  src(path).pipe(scan()).pipe(generate(callback))
}
