#!/usr/bin/env node

const l = require('./src/log.js')
const u = require('./utils.js')
const tj = require('./tj.js')
const coptions = require('./coptions')

const doHelp = require('./src/help.js')

const commands = {
  j: {
    _d: tj.j_add,
    '@list': coptions.dummy('j list')   // list current day journal
  },
  t: {
    _d: tj.t_add,
    '@list': tj.t_listp,                // list projects
    '@create': tj.t_createp,            // create a project
    '@show': tj.t_show,                 // show current project Current
    '@done': tj.t_done,                 // move done to Done
    '@set': coptions.dummy('t set project')     // set default project
  },
  h: {
    _d: doHelp
  }
}

l.info(process.argv[1], process.argv.slice(1))
coptions.parseAndDo(commands)
