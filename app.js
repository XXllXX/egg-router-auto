const { path, readFilesSync, getObject, routerPath } = require('./lib')
/**
 * start
 * @param {EggApplication} app 实例
 */
module.exports = (app) => {
  const { baseDir } = app
  const applicationDir = path.join(baseDir, 'app', 'controller')
  let routerData = readFilesSync(applicationDir)
  app.routerDoc = routerData || []

  /**
   * 异步
   */
  app.beforeStart(async () => {
    const { router, controller } = app
    let { baseApi } = app.config.routerAuto
    app.routerData = []

    routerData.forEach((t) => {
      let action = getObject(controller, t.eggPath)

      let path = routerPath(baseApi, t.path, t.controller)
      let methodPath = t.eggPath.join('.')
      let flag = true
      t.router.forEach((item) => {
        if (action && action[item.method]) {
          if (flag) {
            app.logger.info(
              `[egg-router-auto] ---------------------- Load ${methodPath} controller file----------------------`
            )
          }
          // 路由地址
          let tempPath = routerPath(path, item.action)
          if (
            app.routerData.find(
              (e) => item.type === e.type && e.router === tempPath
            )
          ) {
            app.logger.warn(
              `[egg-router-auto] 未能加载 ${methodPath}.${
                item.method
              } 方法，已经存在相同请求的路由: ${item.type.toUpperCase()} ${tempPath} `
            )
          } else {
            app.routerData.push({
              type: item.type,
              router: tempPath,
              method: item.method,
            })
            router[item.type](tempPath, action[item.method])
            app.logger.info(
              `[egg-router-auto] ${item.type.toUpperCase()} ${tempPath} => controller.${methodPath}.${
                item.method
              }`
            )
          }
        } else {
          app.logger.warn(
            `[egg-router-auto] ${t.path} 文件中未找到 ${item.method}方法`
          )
        }
        flag = false
      })
    })
  })
}
