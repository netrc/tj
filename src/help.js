
const helpStr = `
todo/journal project cli tool, linked to Dynalist version 0.2
usage:
  tj -t|-j|-h [@command] options text strings to end of the line

  tj -j this text is just added w/ timestamp to this months journal file
  tj -j @show [day|week|month] // TODO

  tj -t with some text to insert a todo checkbox into current default project Todo BACKLOG
  tj -t @list            // lists all Projects names
  tj -t @done             // move checked/done entries in CURRENT to Done document
  tj -t @create projName  // makes new project folder, with todo and done docs
  // TODO
  tj -t @done a todo inserted with marked off checkbox // TODO and then moved to Done
  tj -t -p projName       // TODO sets default in ~/.tj.json
  tj -t -p projName with some text to insert a todo // TODO also sets default

  tj -h // or -help or --help or -?, show help w/ version

  // dev helpers
  tj -x @names            // dev option, prints out final Names values
  tj -x @rl            // dev option, prints out dynalist files info struct
  tj -x @content /path/name  // dev option, prints out content of doc
  tj -x @argv       // dev option, prints out parsed av struct
`

const doHelp = () => console.log(helpStr)

const copts = { // command options
  h: {
    _d: doHelp
  }
}

module.exports = {
  copts
}
