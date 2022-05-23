

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

const findFile = ( rl, rootId, dirList, fName ) => { // console.log('findFile', rootId)
  if (dirList.length == 0) { // console.log('dirlist == 0,  now check for', fName)
    const thisEntry = searchFileList( rl, fName)[0]
    return thisEntry
  }

  // still traversing 'directories'
  const root = searchIDList(rl, rootId)[0]    // console.dir(root)
  const childFiles = mapChildrenToFilesList(rl, root.children) // console.dir(childFiles)
  const thisPathName = dirList.shift()
  const thisEntry = searchFileList( childFiles, thisPathName, 'folder')[0]
  return findFile( rl, thisEntry.id, dirList, fName )
}


// use find file inside of getFileInfo
const getFileInfoOrCreate = async (fname, pname) => {
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
      type: 'document',
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


module.exports = {
  list, get, change, create, searchFileList, getFileInfo, findFile, getFileInfoOrCreate, tf, j, t
}

