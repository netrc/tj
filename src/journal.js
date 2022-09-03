
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

const j_add = async av => {
  if (av.restOfString.length == 0) {
    console.log('j: nothing to add')
    return
  }
  const jm = u.journalMonth()
  //console.log(jm, Names.JournalFolder)
  // TODO:  getFileInfoOrCreate - create what? folder or document
  const journalInfo = await dyn.getFileInfoOrCreate(jm, Names.JournalFolder).catch( u.fatalErr )
  //console.log('---- journal info'); console.dir(journalInfo)
  const newContent = `${dyn.tf.code(u.isoTimestamp())} ${av.restOfString}`
  const r = await dyn.j.insert( journalInfo[0].id, newContent ).catch( u.fatalErr )
}

const j_copts = {
  j: {
    _d: j_add,
    '@list': u.dummy('j list')   // list current day journal
  }
}

module.exports = {
  j_copts
}

