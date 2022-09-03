#!/usr/bin/env node

const l = require('./src/log.js')
const u = require('./src/utils.js')
const coptions = require('./src/coptions')

const j = require('./src/journal.js')
const t = require('./src/todo.js')
const help = require('./src/help.js')

const commands = {
  ...j.j_copts,
  ...t.t_copts,
  ...help.copts
}

l.info(process.argv[1], process.argv.slice(1))
coptions.parseAndDo(commands)
