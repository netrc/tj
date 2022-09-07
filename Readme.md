
# tj - journal, todo w/ dynalist

Overloaded CLI for managing journal entries and todo lists with GUI/storage handled by [dynalist](https://dynalist.io)

# Setup

This works with free tier of dynalist - Get your API key from the [developer page](https://dynalist.io/developer); need to set that as DYNALIST_API env var.

In your dynalist, create folders 'Journal' and 'Projects'. (can be overridden in ~/.tj.json)

Once you've created a named project folder, you can set TJPROJ environment variable (or in ~/.tj.json). 

With various todo text entered, you can interact with the CURRENT and BACKLOG checkboxed list of items as you want via the dynalist GUI. The only actions the CLI does are insert into BACKLOG section, and, with the @done sub-command, move checked items from CURRENT to the DONE document.

Any other text, notes, commments are untouched.

# CLI

See help for the command options; here, using aliases (in modfile.tj) to simplify:

```
$ tj  worked on tj code // add timestamped text to this months journal doc, created as needed

$ t @create projectName // creates a named project folder, with Todo and Done docs

$ t something to do     // adds text to top of current project todo

$ t @done             // reads Todo, moves CURRENT items that are checked to DONE folder

$ t @list           // shows list of current projects
```


# Alternatives
random notes on how I got here...

Storage?

* files - easy; also not (usually) distributed; need GUI/web
* cloud database - sure, but still need GUI/web

...therefore, use free online todo system with API

* OneNote - good notetaking system (great photo add functions). But not enough structure
only three levels notebook, section, page. A Notebook just for projects (sections)? 
API seems to be getting better; auth is a hassle. Otherwise, this would be best as other notes about
project can be stored better than a 'todo' style checklist app.

* roam
* foam
* tiddlywiki


