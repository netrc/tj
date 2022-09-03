
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

const searchFileList = (rList, fname, type='document') => rList.files.filter( f => (f.title.substring(0,fname.length)==fname && f.type==type) )
// or type=='folder'
const searchFileListForFolders = (rList) => rList.files.filter( f => f.type=='folder')

const searchIDList = (rList, id) => rList.files.filter( f => f.id==id )

const getFileInfo = async fname => { // only searches for first name match
  const rj = await list().catch( err => throwErr )
  return searchFileList(rj, fname)
}

const mapChildrenToFilesList = (rl,ca) => {   // so we match the list API 
  return { 
    files: ca.map( c => searchIDList(rl,c)[0] )
  }
}


//////////////////////////////
//
// main funcs to do things for tj
//

// rl starts as list of all folders/docs in dynalist
const findFile = ( rl, rootId, dirList, fName ) => { // console.log('findFile', rootId)
  if (dirList.length == 0) { // console.log('dirlist == 0,  now check for', fName)
    //console.log('findFile, dirList done..., fName: ', fName)
    //console.dir(rl)
    const root = searchIDList(rl, rootId)[0]    // console.dir(root)
    const childFiles = mapChildrenToFilesList(rl, root.children) // console.dir(childFiles)
    const thisEntry = searchFileList( childFiles, fName)[0]
    return thisEntry
  }

  // still traversing 'directories'
  const root = searchIDList(rl, rootId)[0]    // get the root  // console.dir(root)
  const childFiles = mapChildrenToFilesList(rl, root.children) // make new sublist of docs // console.dir(childFiles)
  const thisPathName = dirList.shift() // no longer looking in first dir
  const thisEntry = searchFileList( childFiles, thisPathName, 'folder')[0] // get current item name
  // should this be 'rl' or childFiles?
  return findFile( rl, thisEntry.id, dirList, fName )
}


// Todo: use find file inside of getFileInfo
const getFileInfoOrCreate = async (fname, pname, ntype='document') => {
  const rj = await list().catch( throwErr )
  const f = searchFileList(rj, fname)
  //console.log(`gfioc: searching for ${fname}`); console.dir(f)
  if (f.length>0) { // got it
    //console.log(`gfioc: ${fname} exists...done`)
    return [f[0]] // getFileInfo returns list
  } // could also check that p folder is correct
  // console.log(`gfioc: ${fname} does not exist...searching for folder ${pname}`)
  const p = searchFileList(rj, pname, 'folder')
  //console.log(`p.....`); console.dir(p)
  if (p.length == 0) {
    //console.log('gfioc: failed looking for folder ${pname}')
    throw `createFile fail ${pname} parent folder doesnt exist`
  }
  //console.log(`gfioc: found folder ${pname}`)
//TODO: make all the body creates funcs
  const b = {
    changes: [ {
      action: 'create',
      type: ntype,   // 'document' or 'folder'
      parent_id: p[0].id,
      index: 0,
      title: fname
    } ]
  }
  //console.log(`gfioc: creating for ${fname}`); console.dir(b)
  const r = await create(b).catch( throwErr )
  if (r._code != "Ok")
    throw `createFile fail - couldnt create ${fname} under ${pname}:${p[0].id}`
  //console.log('gfioc: create return...'); console.dir(r)
  const f2 = await getFileInfo(fname).catch( throwErr )
  if (f2.length>0) { // got it
    return [f2[0]]
  } else
    throw `createFile fail - thought we made ${fname} under ${pname}:${p[0].id} but now cant find it`
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
  list, get, change, create, 
  searchFileList, searchFileListForFolders, mapChildrenToFilesList, getFileInfo, findFile, getFileInfoOrCreate, 
  tf, 
  j, t
}

