
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

// e.g. 'some todo item', or 'DONE: item thats done'
// TODO - use emoji for DONE? (but easier to grep DONE) yellow text?
const nToText = n => (n.checked ? 'DONE: ' : '      ') + n.content  

const t_show = async av => {
  l.info(`doing t_show`)
  // TODO: see t_done - common get Projects/TJPROJ/Todo  ; get current node
  const thisProjTodo = await dyn.infoFromPath(Names.projTodoPath())
  const todoContent = await dyn.t.get(thisProjTodo.id).catch( u.fatalErr )
  //console.dir(todoContent) ; console.log('======================')
  const todoNodeTitles = todoContent.nodes.reduce( (o,n) => {o[n.id] = nToText(n);return o}, {} ) // all the todo lines
  //console.log(todoNodeTitles);  console.log('======================')

  const currentNode = todoContent.nodes.filter( n => n.content==Names.todoCurrentNodeName )[0]  // should be array sz 1
  //console.dir(currentNode); console.log('======================')
  const s = (!('children' in currentNode) || currentNode.children.length==0) ? 'nothing CURRENT' : currentNode.children.map( c => todoNodeTitles[c] ).join('\n')
  console.log(s)
}

module.exports = t_show
