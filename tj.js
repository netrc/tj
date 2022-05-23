#!/usr/bin/env node


const y = require('yargs')
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

const addJ = async l => {
  const jm = u.journalMonth()
  const journalInfo = await dyn.getFileInfoOrCreate(jm).catch( fatalErr )
  //console.log('---- journal info'); console.dir(journalInfo)
  const newContent = `${dyn.tf.code(u.isoTimestamp())} ${l}`
  const r = await dyn.j.insert( journalInfo[0].id, newContent ).catch( fatalErr )
}

const addT = async l => {
console.log('---------------')
  const rl = await dyn.list().catch( fatalErr )
  const projDone = await dyn.findFile( rl, rl.root_file_id,['Projects', 'tProj'], 'Todo' )
  console.dir(projDone)
  const doneContent = await dyn.t.get(projDone.id).catch( fatalErr )
//  console.dir(doneContent)
  const currentNode = doneContent.nodes.filter( n => n.content=="CURRENT" )
  console.dir(currentNode)
  const makeCheckbox = true
  const dontCheck = false
  const r = await dyn.j.insert( projDone.id, l, currentNode[0].id, makeCheckbox, dontCheck ).catch( fatalErr )
}

const argsToText = a => a['_'].slice(1).join(' ')

const journalHandler = a => {
  console.log('YARGS just journal handler')
  //console.dir(a)  // { _: [ 'journal', 'someting' ], '$0': 'tj.js' }
  const lineStr = argsToText(a)
  addJ( lineStr )
}
const journalListHandler = a => {
  console.log('YARGS journa list handler')
  console.dir(a)
}
const todoHandler = a => {
  console.log('YARGS just todo handler')
  console.dir(a)
  //const projTodo = await dyn.getFileInfoOrCreate(jm).catch( fatalErr )
  const lineStr = argsToText(a)
  addT( lineStr )
}
const todoListHandler = a => {
  console.log('YARGS todo lisat handler')
  console.dir(a)
}

y.usage()
  .version('a.b.c')
  .command( {
    command: 'journal',
    alias: ['j'], // not working
    description: 'do journal entries',
    builder: (yargs) => { //console.log('builder journal!');
      return yargs.command( {
        command: "list",
        description: "child command of foo",
        builder: function() { // console.log("builder journal list!");
        },
        handler: journalListHandler
        } )
      },
      handler: journalHandler
    } )
  .command( {
    command: 'todo',
    description: 'do todo entries',
    builder: (yargs) => { //console.log('builder todos!');
      return yargs.command( {
        command: "list",
        description: "child command of foo",
        builder: function() { // console.log("builder journal list!");
        },
        handler: todoListHandler
        } )
      },
      handler: todoHandler
    } )
  .demand(1, "must provide valid subcommand 'journal' or 'todo'")
  .help("h")
  .alias("h", "help")
  .argv

