const { getObject, routerPath } = require('./lib')
const routerAuto = require('./lib/index.n.js')
const path = require('path')
/**
 * start
 * @param {EggApplication} app 实例
 */
module.exports = (app) => {
  const { baseDir } = app
  // controller 目录
  const applicationDir = path.join(baseDir, 'app', 'controller')
  // 路由数据
  app.routerData = []

  /**
   * 异步
   */
  app.beforeStart(async () => {
    const { router, controller } = app
    // 插件配置
    let { baseApi } = app.config.routerAuto

    routerAuto(path.join(applicationDir, '**/*.js'), function (data) {
      let relative = path.relative(applicationDir, data.dirname)
      let pathList = []
      if (relative !== '') pathList = relative.split(path.sep)
      pathList.push(data.fileName)
      let controllerClass = getObject(controller, pathList)
      if (!controllerClass) return
      app.logger.info(
        `[egg-router-auto] ---------------------- Load ${pathList.join(
          '.'
        )} controller file----------------------`
      )
      data.routers.forEach((item) => {
        if (controllerClass[item.method]) {
          let methodPath = [...pathList, item.method]
          let tempRouter = routerPath(baseApi, data.controller, item.action)
          if (
            app.routerData.find(
              (e) => item.type === e.type && e.router === tempRouter
            )
          ) {
            app.logger.warn(
              `[egg-router-auto] 未能加载 ${methodPath}.${
                item.method
              } 方法，已经存在相同请求的路由: ${item.type.toUpperCase()} ${tempRouter} `
            )
          } else {
            app.routerData.push({
              type: item.type,
              router: tempRouter,
              method: item.method,
            })
            router[item.type](tempRouter, controllerClass[item.method])
            app.logger.info(
              `[egg-router-auto] ${item.type.toUpperCase()} ${tempRouter} => controller.${methodPath}.${
                item.method
              }`
            )
          }
        } else {
          app.logger.warn(
            `[egg-router-auto] controller ${relative} 文件中未找到 ${item.method}方法`
          )
        }
      })
    })
  })
}
