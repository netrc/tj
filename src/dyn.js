
const l = require('./log.js')

const D = "https://dynalist.io/api/v1"
const dListFiles = D + "/file/list"     // get list of all files
const dFileEdit = D + "/file/edit"      // move to other folder, edit==rename, create file/folder
const dReadContent = D + "/doc/read"    // get contents of document
const dChangeContent = D + "/doc/edit"  // insert/move/delete node; edit==update whole content

const throwErr = err => { throw err }

///////////////////////////////
//
// funcs to help with basic API
//

const tokenBody = { token : process.env['DYNALIST_API'] }

const optsTemplate = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
}

const makeOpts = (b={}) => {
  const bodyJSON = JSON.stringify( {...b, ...tokenBody} )
  return { ...optsTemplate, ...{ body: bodyJSON } }
}

const dFetch = dUrl => async ( b ) => {
  const rj = await fetch( dUrl, makeOpts(b) ).then( r => r.json() ).catch( throwErr )
  if (rj._code != "Ok") 
    throw `${dUrl}: error ${rj._code}`
  return rj
}

const list = dFetch(dListFiles)
const get = dFetch(dReadContent) // takes a body with file_id set
const change = dFetch(dChangeContent) // takes a body with file_id and others set
const create = dFetch(dFileEdit) // takes a body with file_id and others set


///////////////////////////////
//
// helper funcs to query Dynalist info
//

const _allFiles = {
  ids: null,     // keys are id, vals are the info obj ( id, title, permissions, type, children )
  paths: {}   // keys are full file 'pathname', vals are the info obj
}

const _pRecur = ( thisId, thisStr ) => {
  _allFiles.paths[thisStr] = _allFiles.ids[thisId]
  if ('children' in _allFiles.ids[thisId]) {
    _allFiles.ids[thisId].children.forEach(c => _pRecur( c, thisStr+'/'+_allFiles.ids[c].title ))
  }
}
  
const _getAll = async () => {
  l.log('_getAll')
  if (!_allFiles.ids) {
    const rl = await list().catch( throwErr )
    _allFiles.ids = rl.files.reduce( (a,c) => { a[c.id]=c; return a}, {} )
    _pRecur( rl.root_file_id, '' )
    l.debug('_getAll now with ', Object.keys(_allFiles.paths).length, ' names')
  }
  return _allFiles
}

const infoFromPath = async p => {
  const a = await _getAll()
  return (p in a.paths) ? a.paths[p] : null
}

const infoFromId = async id => {
  const a = await _getAll()
  l.debug(a)
  return (id in a.ids) ? a.ids[id] : null
}

const infoFromIdArray = async idArray => {
  const a = await _getAll()
  return idArray.map( id => (id in a.ids) ? a.ids[id] : null )
}


//////////////////////////////
//
// main funcs to do things for tj
//

const createItem = async (pId, name, ntype = 'document') => {
  //TODO: make all the body creates funcs
  const b = {
    changes: [ {
      action: 'create',
      parent_id: pId,
      type: ntype,   // 'document' or 'folder'
      title: name,
      index: 0
    } ]
  }
  l.debug(`createItem: creating for ${name}`,b)
  const r = await create(b).catch( throwErr )
  if (r._code != 'Ok') {
    l.debug(r)
    throwErr('failed to make ',name)
  }
  return r.created[0] // ? must have created one
}


////////////////////////////////////////
//
//  text formatting - https://help.dynalist.io/article/90-formatting-reference
//
const tf = {}
tf.code = s => `\`${s}\``
tf.bold = s => `**${s}**`
tf.italic = s => `__${s}__`


//////////////////////////////////////
//
// general wrappers for journal and todo
//

// j helpers
const j = {}
j.insert = async (jid, l, parentId="root", isCheckbox=false, isChecked=false) => {
  const changesBody = {
    file_id: jid,
    changes: [ { 
      action: "insert", 
      parent_id: parentId,
      index: 0, 
      content: l,
      checkbox: isCheckbox,
      checked: isChecked
    } ]
  }
  const r2 = await change( changesBody ).catch( throwErr )
}

// t helpers
const t = {}
t.get = async (tid) => {
  const getBody = {
    file_id: tid
    }
  const r2 = await get( getBody ).catch( throwErr )
  return r2
}

const makeChangeItem = (action, l, pid, isCheckbox, isChecked, index) => ({
  action: "insert", 
  parent_id: pid,
  content: l,
  checkbox: isCheckbox,
  checked: isChecked,
  index: index
})
const makeDeleteItem = (id) => ({
  action: "delete", 
  node_id: id
})

t.insert = async (tid, l, parentId="root", isCheckbox=true, isChecked=false, index=0) => {
  const changesArray = [ makeChangeItem( "insert", l, parentId, isCheckbox, isChecked, index) ]
  const changesBody = {
    file_id: tid,
    changes: changesArray
  }
  const r2 = await change( changesBody ).catch( throwErr )
  return r2
}

t.insertArray = async (tid, lArray, parentId="root", isCheckbox=true, isChecked=false, index=0) => {
  const changesArray = lArray.map( l => makeChangeItem("insert", l, parentId, isCheckbox, isChecked, index) )
  const changesBody = {
    file_id: tid,
    changes: changesArray
  }
  const r = await change( changesBody ).catch( throwErr )
  return r
}

t.deleteArray = async (fileId, idArray) => {
  const deleteArray = idArray.map( i => makeDeleteItem(i) )
  const changesBody = {
    file_id: fileId,
    changes: deleteArray
  }
  l.log(changesBody)
  const r = await change( changesBody ).catch( throwErr )
  return r
}


module.exports = {
  list, get, change, create,  // low-level dynalist
  infoFromPath, infoFromId, infoFromIdArray, createItem, // new use cases
  tf,  // text formatting
  j, t // journal, todo helper funcs
}

