#!/usr/bin/env node

const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')

const Names = {
  JournalFolder: 'Journal',
  ProjectFolder: 'Projects',
  TodoDocument: 'Todo',
  todoInsertNodeName: 'CURRENT',
  currentProject: process.env.TJPROJ
}
if (!Names.currentProject) {
  u.fatalErr('must set env TJPROJ to current project name')
}

const j_add = async av => {
  const jm = u.journalMonth()
  //console.log(jm, Names.JournalFolder)
  const journalInfo = await dyn.getFileInfoOrCreate(jm, Names.JournalFolder).catch( u.fatalErr )
  //console.log('---- journal info'); console.dir(journalInfo)
  const newContent = `${dyn.tf.code(u.isoTimestamp())} ${av.restOfString}`
  const r = await dyn.j.insert( journalInfo[0].id, newContent ).catch( u.fatalErr )
}

const t_add = async av => {
  const rl = await dyn.list().catch( u.fatalErr )
  const projTodo = await dyn.findFile( rl, rl.root_file_id,[Names.ProjectFolder, Names.currentProject], Names.TodoDocument )
  const todoContent = await dyn.t.get(projTodo.id).catch( u.fatalErr )
  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoInsertNodeName ) 
  const makeCheckbox = true
  const dontCheck = false
  const r = await dyn.t.insert( projTodo.id, av.restOfString, currentNode[0].id, makeCheckbox, dontCheck ).catch( u.fatalErr )
}

module.exports = {
  j_add,
  t_add
}
