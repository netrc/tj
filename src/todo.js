
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

const t_add = async av => {
  if (av.restOfString.length == 0) {
    return 't: nothing to add'
  }
  const thisProjTodo = await dyn.infoFromPath(Names.projTodoPath())
  // TODO if !thisProjTodo
  const todoContent = await dyn.t.get(thisProjTodo.id).catch( u.fatalErr )
  // TODO if !todoContent
  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoInsertNodeName ) 
  if (currentNode.length==0) {
    u.fatalErr(`can't find ${Names.todoInsertNodeName} node`)
  }
  const makeCheckbox = true
  const dontCheck = false
  const r = await dyn.t.insertArray( thisProjTodo.id, [av.restOfString], currentNode[0].id, makeCheckbox, dontCheck ).catch( u.fatalErr )
}

const t_list = require('./todo_list.js')
const t_create = require('./todo_create.js')
const t_show = require('./todo_show.js')
const t_done = require('./todo_done.js')

const t_copts = {
  t: {
    _d: t_add,
    '@list': t_list,                // list projects
    '@create': t_create,            // create a project
    '@show': t_show,                 // show current project Current
    '@done': t_done,                 // move done to Done
    '@set': u.dummy('t set project')     // set default project
  }
}

module.exports = {
  t_copts
}
