
///  command options
///  progname -a -x -n all the rest of the line
///  ... main command is -a
///  ... other options are -x -n
///  ... 'all the rest of the line' are passed to -a
///  ... the '-a' command can have sub-commands, the first word after

const l = require('./src/log.js')

const parseAndDo = commands => {
  const commandKeys = Object.keys(commands)

  // use minimist parsing
  const opts = {
    boolean: commandKeys
  }
  var av = require('minimist')(process.argv.slice(2),opts)
  //console.log(av)

  if ( ! commandKeys.map(k => av[k]).some(x => x) ) { // must have one of the command keys
    console.error(`at least one of ${commandKeys.map(c => `-${c}`).join(', ')}`)
    process.exit(1)
  }

  commandKeys.forEach( c => {
    if (av[c]) { // ok, the command 'c' is to be run
      var comm = commands[c]._d // default subcommand
      if (av._.length>0 && commands[c][av._[0]]) {
        comm = commands[c][av._[0]] // oh, this subcommand
        av._.shift()
      }
      l.info(`coptions: doing ${c}`)
      av.restOfString = av._.join(' ')
      comm(av)
    }
  }) // or map commandKeys to array of funcs or nulls; and do first (only) func
}

const dummy = s => () => console.log('dummy...',s) // for command placeholders

module.exports = {
  parseAndDo,
  dummy
}
