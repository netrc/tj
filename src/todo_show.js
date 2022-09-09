
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

// e.g. 'some todo item', or 'DONE: item thats done'
// TODO - use emoji for DONE? (but easier to grep DONE) yellow text?
const nToText = n => (n.checked ? 'DONE: ' : '      ') + n.content  

const zeroChildren = pNode => (!('children' in pNode) || pNode.children.length==0)

const t_show = async av => {
  l.info(`doing t_show`)
  // TODO: see t_done - common get Projects/TJPROJ/Todo  ; get current node
  const thisProjTodo = await dyn.infoFromPath(Names.projTodoPath())
  if (! thisProjTodo) {
    u.fatalErr(`can't find ${Names.projTodoPath()}`)
  }
  const todoContent = await dyn.t.get(thisProjTodo.id).catch( u.fatalErr )
  //l.debug(todoContent)
  // all the todo lines
  const todoNodeTitles = todoContent.nodes.reduce( (o,n) => {o[n.id] = nToText(n);return o}, {} )
  //l.debug(todoNodeTitles)

  const cNode = todoContent.nodes.filter( n => n.content==Names.todoCurrentNodeName )[0]  // should be array sz 1
  const retStr = zeroChildren(cNode) ? 'nothing CURRENT' : cNode.children.map( c => todoNodeTitles[c] ).join('\n')
  return retStr
}

module.exports = t_show
