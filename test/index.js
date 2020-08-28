const routerAuto = require('../lib/index.n.js')
const { getObject } = require('../lib/doc')
const path = require('path')
let routerData = []
routerAuto('./test/app/controller/**/*.js', function (router) {
  let base = path.relative('./test/app/controller', router.dirname)
  let pathList = []
  let prefix = 'api'
  if (base != '') pathList = base.split(path.sep)
  pathList.push(router.controller)
  console.log(
    `[egg-router-auto] ---------------------- Load ${pathList.join(
      '/'
    )} controller file----------------------`
  )
  router.routers.forEach((item) => {
    if (action && action[item.method]) {
    }
  })
  // if (base == '') console.log(router)
})
console.log(12)
