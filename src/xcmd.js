
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')
const fs = require('fs')

const x_writeList = async av => {
  const rl = await dyn.list().catch( u.fatalErr )
  fs.writeFileSync('./rl.json', JSON.stringify(rl),null,2)
}
  
const x_copts = {
  x: {
    _d: x_writeList,
    '@rl': x_writeList
  }
}

module.exports = {
  x_copts
}


