#!/usr/bin/env node

const l = require('./src/log.js')
const u = require('./src/utils.js')
const coptions = require('./src/coptions')

const j = require('./src/journal.js')
const t = require('./src/todo.js')
const help = require('./src/help.js')
const x = require('./src/xcmd.js')

const commands = {
  ...help.copts, // -h first
  ...j.j_copts,
  ...t.t_copts,
  ...x.x_copts
}

const main = async () => {
  l.info(process.argv[1], process.argv.slice(1))
  const s = await coptions.parseAndDo(commands)
  if (s) { // BUG: 
    console.log(s) // command output
  }
}
const r = main()
