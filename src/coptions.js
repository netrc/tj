
///  command options
///  progname -a -x -n all the rest of the line
///  ... main command is -a
///  ... other options are -x -n
///  ... 'all the rest of the line' are passed to -a
///  ... the '-a' command can have sub-commands, the first word after

const l = require('./log.js')
const u = require('./utils.js')

const parseAndDo = commands => {
  const commandKeys = Object.keys(commands)

  // use minimist parsing
  const opts = {
    boolean: commandKeys
  }
  var av = require('minimist')(process.argv.slice(2),opts)
  l.debug(av)

  if ( ! commandKeys.map(k => av[k]).some(x => x) ) { // must have one of the command keys
    u.fatalErr(`at least one of ${commandKeys.map(c => `-${c}`).join(', ')}`)
  }

  const c = commandKeys.filter( k => av[k] )[0]
  if (av[c]) { // ok, the command 'c' is to be run
    var comm = commands[c]._d // default subcommand
    if (av._.length>0 && commands[c][av._[0]]) {
      comm = commands[c][av._[0]] // oh, this subcommand
      av._.shift()
    }
  av.restOfString = av._.join(' ')
  l.info(`coptions: doing ${c}`)
  return comm(av) // command output to main
  }
}

module.exports = {
  parseAndDo
}
