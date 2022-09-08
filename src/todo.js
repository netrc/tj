
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

const t_add = async av => {
  if (av.restOfString.length == 0) {
    return 't: nothing to add'
  }
  const thisProjTodo = await dyn.infoFromPath(Names.projTodoPath())
  // TODO if !thisProjTodo
  const todoContent = await dyn.t.get(thisProjTodo.id).catch( u.fatalErr )
  // TODO if !todoContent
  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoInsertNodeName ) 
  if (currentNode.length==0) {
    u.fatalErr(`can't find ${Names.todoInsertNodeName} node`)
  }
  const makeCheckbox = true
  const dontCheck = false
  const r = await dyn.t.insertArray( thisProjTodo.id, [av.restOfString], currentNode[0].id, makeCheckbox, dontCheck ).catch( u.fatalErr )
}

const t_listp = async av => {
  const projFolder = await dyn.infoFromPath(Names.projTopPath())
  if (!projFolder) {
    u.fatalErr('cant find Projects folder')
  }
  const projectsInfo = await dyn.infoFromIdArray( projFolder.children )
  const projects = projectsInfo.map( i => i.title )
  const retStr = projects.length==0 ? 'no projects!' : projects.join('\n')
  return retStr
}

const nDoneToText = n => (n.checked ? n.content : null) // e.g. just the Done items

const t_done = async av => {
  l.debug(`enter t_done`)
  const projTodo = await dyn.infoFromPath(Names.projTodoPath())
  const projDone = await dyn.infoFromPath(Names.projDonePath())
  const todoContent = await dyn.t.get(projTodo.id).catch( u.fatalErr )
  l.debug(todoContent)
  const todoNodeInfo = todoContent.nodes.reduce( (o,n) => {o[n.id] = n;return o}, {} ) // all the todo info
  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoCurrentNodeName )[0]
  const allDone = currentNode.children.map( c => todoNodeInfo[c] ).filter( n=> n.checked )
  let retStr = null
  if (allDone.length==0) {
    retStr = 'nothing done'
  } else {
    //console.dir(allDone) // array of allDone items
    const doneContent = await dyn.t.get(projDone.id).catch( u.fatalErr )
    //console.dir(doneContent)
    const doneRoot = doneContent.nodes.filter( n => n.id=='root' )[0] // 
    let firstNode = doneContent.nodes.filter( n => n.id==doneRoot.children[0] )[0]
    //console.log('first fn'); console.dir(firstNode)
    let insertNode = firstNode.id
    //console.dir(firstNode)
    const ymdStr = u.ymdTimestamp()
    if (!firstNode || firstNode.content != ymdStr) {
      l.info('need to make date entry: ', ymdStr)
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
  }
  return retStr
}

const t_create = require('./todo_create.js')
const t_show = require('./todo_show.js')

const t_copts = {
  t: {
    _d: t_add,
    '@list': t_listp,                // list projects
    '@create': t_create,            // create a project
    '@show': t_show,                 // show current project Current
    '@done': t_done,                 // move done to Done
    '@set': u.dummy('t set project')     // set default project
  }
}

module.exports = {
  t_copts
}
