
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')
const fs = require('fs')

const x_writeList = async av => {
  const rl = await dyn.list().catch( u.fatalErr )
  fs.writeFileSync('./rl.json', JSON.stringify(rl),null,2)
}

const x_content = async av => {
  const all = await dyn.getAll().catch( u.fatalErr )
  console.log('f: ', av.restOfString, all.paths[av.restOfString])
  const fInfo = all.paths[av.restOfString]
  const content = await dyn.get({file_id: fInfo.id}).catch( u.fatalErr )
  console.log('content', content)
}

const x_names = async av => {
  console.dir(Names)
}

const x_argv = async av => {
  console.dir(av)
}
  
const x_copts = {
  x: {
    _d: x_writeList,
    '@content': x_content,
    '@names': x_names,
    '@argv': x_argv,
    '@rl': x_writeList
  }
}

module.exports = {
  x_copts
}


