

const u = require('./utils.js')
const l = require('./log.js')

const nameDefaults = { // real defaults
  JournalFolder: 'Journal',
  ProjectFolder: 'Projects',
  TodoDocument: 'Todo',
  todoCurrentNodeName: 'CURRENT',
  todoInsertNodeName: 'BACKLOG',  // was CURRENT
  DoneDocument: 'Done',
  currentProject: process.env.TJPROJ
}

let Names = null // exported name vals
let userDefaults = {} // possible user overrides

if (!Names) {
  try {
    userDefaults = require(`${process.env.HOME}/.tj.json`)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') { // ignore if not found
      throw e // most likely a json error in the file
    } 
  }
  const envProj = process.env.TJPROJ ? { currentProject: process.env.TJPROJ } : {} 
  Names = { ...nameDefaults, ...userDefaults, ...envProj }
  l.debug('defaults',{ userDefaults, Names })
  if (!Names.currentProject) {
    u.fatalErr('must set ~/.tj.json "currentProject" or TJPROJ env to project name')
  }

  Names.projTopPath = () => `/${Names.ProjectFolder}`
  Names.projPath = (p = Names.currentProject) => `${Names.projTopPath()}/${p}`
  Names.projTodoPath = p => `${Names.projPath(p)}/${Names.TodoDocument}`
  Names.projDonePath = p => `${Names.projPath(p)}/${Names.DoneDocument}`

  Names.journalTopPath = () => `/${Names.JournalFolder}`
  Names.journalYMPath = ymStr => `${Names.journalTopPath()}/${ymStr}`
}

module.exports = Names
