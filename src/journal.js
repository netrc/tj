
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

const j_add = async av => {
  if (av.restOfString.length == 0) {
    console.log('j: nothing to add')
    return
  }
  const all = await dyn.getAll().catch( u.fatalErr )
  const jInfo = all.paths[Names.journalTopPath()] // must!? be there
  const ymName = u.journalMonth()
  const ymInfo = all.paths[Names.journalYMPath(ymName)] || null
  const ymId = (ymInfo) ? ymInfo.id : await dyn.createItem(jInfo.id, ymName, 'folder').catch( u.fatalErr )
  const newContent = `${dyn.tf.code(u.isoTimestamp())} ${av.restOfString}`
  const r = await dyn.j.insert( ymId, newContent ).catch( u.fatalErr )
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


