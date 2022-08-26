
# tj - journal, todo w/ dynalist

Overloaded CLI for managing journal entries and todo lists with GUI/storage handled by [dynalist](https://dynalist.io)

Get your API key from the [developer page](https://dynalist.io/developer); need to set that as DYNALIAST_API env var

# CLI

j whatever text you want  // add timestamped text to this months journal entry

j -l  // show current months journal entry

j -g regex  // grep in this months journal

t -p projName fix typos and stuff  // set current project and add text
  // current project stored in json object ~/.tj.json

t something to do // adds text to top of current project todo
  // if no current project, lists projects

t -d something that i just fixed  // adds text, marked as done

t -l // show current project todo

t -e  // dump current project todo to EDITOR // and then what?????   DONE ??

# Setup

DYNALIST_API - your dynalist API key (where to find this....)

Note, j and t are aliases for node tj.js -j "$@" and node tj.js -t "$@"

aliases

alias j='doppler run -- node --no-warnings /home/ric/src/tj/main.js -j'
alias t='doppler run -- node --no-warnings /home/ric/src/tj/main.js -t'
