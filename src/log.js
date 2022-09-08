
const { Logtail } = require('@logtail/node')
const u = require('./utils.js')

if (!process.env.LOGTAIL_API) {
  u.fatalErr('must set LOGTAIL_API')
}

var l = {}

if (!l.info) {
  l = new Logtail(process.env.LOGTAIL_API)
}

module.exports = l
