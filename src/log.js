
if (!process.env.LOGZ_API) {
  console.error('must set LOGZ_API')
  process.exit(1)
}

var l = {}

if (!l.log) {
  l = require('logzio-nodejs').createLogger( {
    token: process.env.LOGZ_API,
    addTimestampWithNanoSecs: true,
    type: 'tj'
  } )
}

//l.mob = (m, o) => l.log({message:m, param1: o})

module.exports = l

//l.log(`${process.argv[1]}: starting`)


//l.sendAndClose()  !! must add to all exit points???


// const l = require('log.js')
// 
