
const { Logtail } = require('@logtail/node')

if (!process.env.LOGTAIL_API) {
  console.error('must set LOGTAIL_API')
  process.exit(1)
}

var l = {}

if (!l.info) {
  l = new Logtail(process.env.LOGTAIL_API)
}

module.exports = l
