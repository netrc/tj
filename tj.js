#!/usr/bin/env node



const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')

const helpStr = `
todo/journal CLI  version 0.1
usage:
  tj command options text strings to end of the line
  // command must be either journal or todo, abbreviated up to j or t

  tj j this text is just added w/ timestamp to this months journal file
  tj j -l // show this months journal

  tj t -c projName  // creates a project
  tj t -l  // lists your projectd
  tj t -d  // show current project
  tj t -p projName // sets default
  tj t -p projName with some text to insert a todo // also sets default
  tj t with some text to insert a todo checkbox into current default project
  tj t DONE some text todo inserted with marked off checkbox

  tj -h // or -help or --help or -?, show help w/ version
`
// commonly,
// alias t="node /full/instal/path/tj t"
// alias j="node /full/instal/path/tj j"

const fatalErr = err => {
  console.error(err)
  process.exit(1)
}

const Names = {
  JournalFolder: 'Journal',
  ProjectFolder: 'Projects',
  TodoDocument: 'Todo',
  todoInsertNodeName: 'CURRENT',
  currentProject: process.env.TJPROJ
}
if (!Names.currentProject) {
  fatalErr('must set env TJPROJ to current project name')
}

const addJ = async l => {
  const jm = u.journalMonth()
  //console.log(jm, Names.JournalFolder)
  const journalInfo = await dyn.getFileInfoOrCreate(jm, Names.JournalFolder).catch( fatalErr )
  //console.log('---- journal info'); console.dir(journalInfo)
  const newContent = `${dyn.tf.code(u.isoTimestamp())} ${l}`
  const r = await dyn.j.insert( journalInfo[0].id, newContent ).catch( fatalErr )
}

const addT = async l => {
  const rl = await dyn.list().catch( fatalErr )
  const projTodo = await dyn.findFile( rl, rl.root_file_id,[Names.ProjectFolder, Names.currentProject], Names.TodoDocument )
  const todoContent = await dyn.t.get(projTodo.id).catch( fatalErr )
  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoInsertNodeName ) 
  const makeCheckbox = true
  const dontCheck = false
  const r = await dyn.t.insert( projTodo.id, l, currentNode[0].id, makeCheckbox, dontCheck ).catch( fatalErr )
}


const journalHandler = av => {
  //console.log('journal handler: ',av.restOfString)
  addJ( av.restOfString )
}
const journalListHandler = a => {
  //console.log('journa list handler')
  console.dir(a)
}
const todoHandler = av => {
  //console.log('todo handler')
  addT( av.restOfString )
}
const todoListHandler = a => {
  console.log('todo lisat handler')
  console.dir(a)
}

const doHelp = () => console.log(`
${process.argv[1]} - tj project cli tool, linked to Dynalist

-t text to add    - adds text to current project todo
-t lsit - lists

-j text to add 
`)

const mkCLog = s => () => console.log(s)

const commands = {
  j: {
    _d: journalHandler,
    list: journalListHandler   // list current day journal
  },
  t: {
    _d: todoHandler,
    listprojects: mkCLog('doTlistProjects'),  // list projects
    lp: mkCLog('doTlistProjects'),  // list projects
    list: mkCLog('dotlist'),  // list current project todo
    set: mkCLog('doTset')     // set default project
  },
  h: {
    _d: doHelp
  }
}

const coptions = require('./coptions')
coptions.parseAndDo(commands)
