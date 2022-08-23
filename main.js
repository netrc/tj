#!/usr/bin/env node

const u = require('./utils.js')
const tj = require('./tj.js')

// commonly,
// alias t="node /full/instal/path/tj -t"
// alias j="node /full/instal/path/tj -j"

const helpStr = `
todo/journal project cli tool, linked to Dynalist version 0.2
usage:
  tj -t|j [@command] options text strings to end of the line

  tj -j this text is just added w/ timestamp to this months journal file
  tj -j @list // show this months journal

  tj -t @create projName  // creates a project
  tj t -l  // lists your projectd
  tj t -d  // show current project
  tj t -p projName // sets default
  tj t -p projName with some text to insert a todo // also sets default
  tj t with some text to insert a todo checkbox into current default project
  tj t DONE some text todo inserted with marked off checkbox

  tj -h // or -help or --help or -?, show help w/ version
`
const doHelp = () => console.log(helpStr)

const mkCLog = s => () => console.log('dummy...',s) // for command placeholders

const commands = {
  j: {
    _d: tj.j_add,
    '@list': mkCLog('j list')   // list current day journal
  },
  t: {
    _d: tj.t_add,
    '@list': tj.t_listp,                // list projects
    '@create': tj.t_createp,            // create a project
    '@show': tj.t_show,                 // show current project Current
    '@done': tj.t_done,                 // move done to Done
    '@set': mkCLog('t set project')     // set default project
  },
  h: {
    _d: doHelp
  }
}

const coptions = require('./coptions')
coptions.parseAndDo(commands)
