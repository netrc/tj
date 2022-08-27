
const helpStr = `
todo/journal project cli tool, linked to Dynalist version 0.2
usage:
  tj -t|-j|-h [@command] options text strings to end of the line

  tj -j this text is just added w/ timestamp to this months journal file
  tj -j @show [day|week|month] 

  tj -t with some text to insert a todo checkbox into current default project, BACKLOG
  tj -t -p projName       // sets default in ~/.tj.json
  tj -t -p projName with some text to insert a todo // also sets default
  tj -t @names            // shows current project info, ~/.tj.json
  tj -t @create projName  
  tj -t @done             // move checked/done entries in CURRENT to Done document
  tj -t @done a todo inserted with marked off checkbox // and then moved to Done

  tj -h // or -help or --help or -?, show help w/ version
`

const doHelp = () => console.log(helpStr)

module.exports = doHelp
