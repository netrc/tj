
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')
const fs = require('fs')

const x_writeList = async av => {
  const rl = await dyn.list().catch( u.fatalErr )
  return JSON.stringify(rl,null,2)
}

const x_content = async av => {
  const fInfo = await dyn.infoFromPath(av.restOfString)
  l.debug('x_content ', av.restOfString, '  fInfo', fInfo)
  let content = null
  if (fInfo && ('id' in fInfo)) {
    content = await dyn.get({file_id: fInfo.id}).catch( u.fatalErr )
  } else {
    u.fatalErr(`can't find content for ${av.restOfString}`)
  }
  return content
}

const x_names = async av => {
  return JSON.stringify(Names,null,2)
}

const x_argv = async av => {
  return JSON.stringify(av,null,2)
}
  
const x_copts = {
  x: {
    _d: x_argv,
    '@content': x_content,
    '@names': x_names,
    '@argv': x_argv,
    '@rl': x_writeList
  }
}

module.exports = {
  x_copts
}


