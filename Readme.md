
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

Create Journal, Projects folder. 

`j using tj cli` will add to Journal/YYYY-MM document

`t --create projName` will init a project
`t note something to do` in that projName

Note, j and t are my usual shell aliases,  see modfile.tj



# Alternatives
* files - easy; also not (usually) distributed; need GUI/web
* database - sure, but still need GUI/web

...therefore, use free online todo system with API

* OneNote - good notetaking system (great photo add functions). But not enough structure
only three levels notebook, section, page. A Notebook just for projects (sections)? 
API seems to be getting better; auth is a hassle. Otherwise, this would be best as other notes about
project can be stored better than a 'todo' style checklist app.

* roam
* foam
* tiddlywiki


