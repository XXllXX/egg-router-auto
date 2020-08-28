'use strict'

const Controller = require('egg').Controller

/**
 * 首页1
 * @controller home
 * @param {get} index :id
 */
class HomeController extends Controller {
  async index() {
    const { ctx } = this

    ctx.body = { records: data.count, data: data.rows }
  }
}

module.exports = HomeController
