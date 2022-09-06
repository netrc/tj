
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

// create new project folder   (under Names.ProjectFolder)
//  create new Done document    (Names.DoneDocument)
//  create new Todo document    (Names.TodoDocument)
//    insert node Summary       (Names.todoSummaryNodeName)
//      with note 'Status/Working On/URL/Github/Working dev/logs/notes'
//    insert node CURRENT (Names.)  (Names.todoCurrentNodeName)
//    insert node BACKLOG (Names.insert)  (Names.todoInsertNodeName)

const newTodoContent = {
  file_id: null,
  changes: [
    {
      action: 'insert',
      parent_id: 'root',
      index: 0,
      content: 'Summary',
      note: 'Status: \nSite/URL: \nThis Sprint MVP: \nGithub: \nDev site: \nLogs: '
    }, {
      action: 'insert',
      parent_id: 'root',
      index: 1,
      content: 'CURRENT'
    }, {
      action: 'insert',
      parent_id: 'root',
      index: 2,
      content: 'BACKLOG'
    }
  ]
}

const t_create = async av => {
  if (av._.length == 0) {
    u.fatalErr('must specify project name')
  }
  const newpName = av._[0]
  l.info(`doing t_listp: new project: ${newpName}`)
  const all = await dyn.getAll().catch( u.fatalErr )
  if (all.paths[Names.projPath(newpName)]) {
    u.fatalErr(`project ${newpName} already exists`)
  }

  const projTop = all.paths[Names.projTopPath()]
  const newpId = await dyn.createItem(projTop.id, newpName, 'folder').catch( u.fatalErr )
  const doneDocId = await dyn.createItem(newpId, Names.DoneDocument).catch( u.fatalErr )
  const todoDocId = await dyn.createItem(newpId, Names.TodoDocument).catch( u.fatalErr )
  newTodoContent.file_id = todoDocId
  const r = await dyn.change(newTodoContent)
  console.log('r',r)
}

module.exports = t_create
