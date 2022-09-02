#!/usr/bin/env node

const l = require('./src/log.js')
const u = require('./utils.js')
const tj = require('./tj.js')
const help = require('./src/help.js')
const coptions = require('./coptions')

const commands = {
  ...tj.j_copts,
  ...tj.t_copts,
  ...help.copts
}

l.info(process.argv[1], process.argv.slice(1))
coptions.parseAndDo(commands)
