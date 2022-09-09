
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

const nDoneToText = n => (n.checked ? n.content : null) // e.g. just the Done items

const t_done = async av => {
  l.debug(`enter t_done`)
  const projTodo = await dyn.infoFromPath(Names.projTodoPath())
  if (! projTodo) {
    u.fatalErr(`can't find ${Names.projTodoPath()}`)
  }
  const projDone = await dyn.infoFromPath(Names.projDonePath())
  if (! projDone) {
    u.fatalErr(`can't find ${Names.projDonePath()}`)
  }
  const todoContent = await dyn.t.get(projTodo.id).catch( u.fatalErr )
  l.debug(todoContent)
  const todoNodeInfo = todoContent.nodes.reduce( (o,n) => {o[n.id] = n;return o}, {} ) // all the todo info
  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoCurrentNodeName )[0]
  const allDone = currentNode.children.map( c => todoNodeInfo[c] ).filter( n=> n.checked )
  let retStr = null // either null or 'nothing done'
  if (allDone.length==0) {
    retStr = 'nothing done'
    return retStr // note quick return
  }
  // stuff is checked 'done', so move them
  //l.debug(allDone) // array of allDone items
  // Get the Done doc content and find first node
  const doneContent = await dyn.t.get(projDone.id).catch( u.fatalErr )
  //console.dir(doneContent)
  const doneRoot = doneContent.nodes.filter( n => n.id=='root' )[0] // 
  let firstNode = null
  let insertNode = null
  if ('children' in doneRoot) { // Done doc has items
    firstNode = doneContent.nodes.filter( n => n.id==doneRoot.children[0] )[0]
    insertNode = firstNode.id
  }
  //console.log('first fn'); console.dir(firstNode)
  //console.dir(firstNode)
  const ymdStr = u.ymdTimestamp()
  if (!firstNode || firstNode.content != ymdStr) { // either new day or brand new Done doc
    l.debug('need to make date entry: ', ymdStr)
    firstNode = await dyn.t.insert( doneContent.file_id, ymdStr, 'root', false ).catch( u.fatalErr )
    //console.log('2nd fn'); console.dir(firstNode)
    if (firstNode._code == 'Ok') {
      insertNode = firstNode.new_node_ids[0]
    }
    //console.dir(firstNode)
  }
  const doneTitles = todoContent.nodes.map( n => nDoneToText(n) ).filter(x=>x) // just the DOne lines
  // use allDone titles
  l.debug(doneTitles)
  const r = await dyn.t.insertArray( doneContent.file_id, doneTitles, insertNode, false, false, -1 ).catch( u.fatalErr )
  //console.dir(r)
  if (r._code == 'Ok') { // now delete the old ones
    //console.log('to be deleted'); console.dir(allDone)
    const doneIds = allDone.map( d => d.id )
    //console.dir(doneIds)
    const r2 = await dyn.t.deleteArray( todoContent.file_id, doneIds ).catch( u.fatalErr )
    //console.dir(r2)
  }

  return retStr
}

module.exports = t_done
