#!/usr/bin/env node

const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')

const Names = {
  JournalFolder: 'Journal',
  ProjectFolder: 'Projects',
  TodoDocument: 'Todo',
  todoCurrentNodeName: 'CURRENT',
  todoInsertNodeName: 'BACKLOG',  // was CURRENT
  DoneDocument: 'Done',
  currentProject: process.env.TJPROJ
}
if (!Names.currentProject) {
  u.fatalErr('must set env TJPROJ to current project name')
}

const j_add = async av => {
  const jm = u.journalMonth()
  //console.log(jm, Names.JournalFolder)
  // TODO:  getFileInfoOrCreate - create what? folder or document
  const journalInfo = await dyn.getFileInfoOrCreate(jm, Names.JournalFolder).catch( u.fatalErr )
  //console.log('---- journal info'); console.dir(journalInfo)
  const newContent = `${dyn.tf.code(u.isoTimestamp())} ${av.restOfString}`
  const r = await dyn.j.insert( journalInfo[0].id, newContent ).catch( u.fatalErr )
}

const t_add = async av => {
  //console.log('t_add: ', av.restOfString)
  const rl = await dyn.list().catch( u.fatalErr )
  const projTodo = await dyn.findFile( rl, rl.root_file_id,[Names.ProjectFolder, Names.currentProject], Names.TodoDocument )
  const todoContent = await dyn.t.get(projTodo.id).catch( u.fatalErr )
  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoInsertNodeName ) 
  if (currentNode.length==0) {
    u.fatalErr(`can't find ${Names.todoInsertNodeName} node`)
  }
  const makeCheckbox = true
  const dontCheck = false
  //const r = await dyn.t.insert( projTodo.id, av.restOfString, currentNode[0].id, makeCheckbox, dontCheck ).catch( u.fatalErr )
  const r = await dyn.t.insertArray( projTodo.id, [av.restOfString], currentNode[0].id, makeCheckbox, dontCheck ).catch( u.fatalErr )
}

const t_listp = async av => {
  //console.log('doing t_listp')
  const rl = await dyn.list().catch( u.fatalErr )
  const projFolder = dyn.searchFileList( rl, Names.ProjectFolder, 'folder' )
  //console.dir(projFolder)
  if (projFolder.length == 0) {
    u.fatalErr('cant find Projects folder')
  }
  // TODO: 'ToFiles' == ToNodes
  const projChildrenNodes = dyn.mapChildrenToFilesList(rl, projFolder[0].children)
  //console.dir(projChildrenNodes)  
  const projects = projChildrenNodes.files.filter( n => n.type=='folder' )
  const s = projects.length==0 ? 'no projects!' : projects.map( p => p.title ).join('\n')
  console.log(s)
}

const t_createp = async av => {
  if (av._.length == 0) {
    u.fatalErr('must specify project name')
  }
  const newpName = av._[0]
  console.log(`doing t_listp: new project: ${newpName}`)
  // !! projects must be unique across all dynalist folders !!!!
  const newp = await dyn.getFileInfoOrCreate(newpName, Names.ProjectFolder, 'folder').catch( u.fatalErr )
}

const nToText = n => (n.checked ? 'DONE: ' : '      ') + n.content  // e.g. 'some todo item', or 'DONE: item thats done'
const nDoneToText = n => (n.checked ? n.content : null) // e.g. just the Done items

const t_show = async av => {
  // console.log(`doing t_show`)
  // TODO: see t_done - common get Projects/TJPROJ/Todo  ; get current node
  const rl = await dyn.list().catch( u.fatalErr )
  const projTodo = await dyn.findFile( rl, rl.root_file_id,[Names.ProjectFolder, Names.currentProject], Names.TodoDocument )

  const todoContent = await dyn.t.get(projTodo.id).catch( u.fatalErr )
  //console.dir(todoContent) ; console.log('======================')
  const todoNodeTitles = todoContent.nodes.reduce( (o,n) => {o[n.id] = nToText(n);return o}, {} ) // all the todo lines
  //console.log(todoNodeTitles);  console.log('======================')

  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoCurrentNodeName )[0]  // should be array sz 1
  //console.dir(currentNode); console.log('======================')
  const s = currentNode.children.length==0 ? 'nothing CURRENT' : currentNode.children.map( c => todoNodeTitles[c] ).join('\n')
  console.log(s)
}

const t_done = async av => {
  console.log(`doing t_done`)
  // TODO: see t_done - common get Projects/TJPROJ/Todo  ; get current node
  const rl = await dyn.list().catch( u.fatalErr )
  const projTodo = await dyn.findFile( rl, rl.root_file_id,[Names.ProjectFolder, Names.currentProject], Names.TodoDocument )
  const projDone = await dyn.findFile( rl, rl.root_file_id,[Names.ProjectFolder, Names.currentProject], Names.DoneDocument )
  const todoContent = await dyn.t.get(projTodo.id).catch( u.fatalErr )
  //console.dir(todoContent)
  const todoNodeInfo = todoContent.nodes.reduce( (o,n) => {o[n.id] = n;return o}, {} ) // all the todo info
  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoCurrentNodeName )[0]
  const allDone = currentNode.children.map( c => todoNodeInfo[c] ).filter( n=> n.checked )
  if (allDone.length==0) {
    console.log('nothing done')
  } else {
    //console.dir(allDone) // array of allDone items

    const doneContent = await dyn.t.get(projDone.id).catch( u.fatalErr )
    console.log('....')
    //console.dir(doneContent)
    const doneRoot = doneContent.nodes.filter( n => n.id=='root' )[0] // 
    let firstNode = doneContent.nodes.filter( n => n.id==doneRoot.children[0] )[0]
    //console.dir(firstNode)
    const ymdStr = u.ymdTimestamp()
    if (!firstNode || firstNode.content != ymdStr) {
      console.log('need to make node: ', ymdStr)
      firstNode = await dyn.t.insert( doneContent.file_id, ymdStr, 'root', false ).catch( u.fatalErr )
      //console.dir(firstNode)
    }
    const doneTitles = todoContent.nodes.map( n => nDoneToText(n) ).filter(x=>x) // just the DOne lines
    // use allDone titles
    console.log(doneTitles)
    const r = await dyn.t.insertArray( doneContent.file_id, doneTitles, doneRoot.children[0], false, false, -1 ).catch( u.fatalErr )
    //console.dir(r)
    if (r._code == 'Ok') {
      // now delete the old ones
      //console.log('to be deleted')
      //console.dir(allDone)
      const doneIds = allDone.map( d => d.id )
      //console.dir(doneIds)
      const r2 = await dyn.t.deleteArray( todoContent.file_id, doneIds ).catch( u.fatalErr )
      //console.dir(r2)
    }
  }
}

module.exports = {
  j_add,
  t_add,
  t_listp,
  t_show,
  t_done,
  t_createp
}
