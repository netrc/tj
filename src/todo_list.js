
const dyn = require('./dyn.js') // uses DYNALIST_API env var
const u = require('./utils.js')
const l = require('./log.js')
const Names = require('./defaults.js')

const t_list = async av => {
  const projFolder = await dyn.infoFromPath(Names.projTopPath())
  if (!projFolder) {
    u.fatalErr('cant find ${Names.projTopPath()} folder')
  }
  const projectsInfo = await dyn.infoFromIdArray( projFolder.children )
  const projects = projectsInfo.map( i => i.title )
  const retStr = projects.length==0 ? 'no projects!' : projects.join('\n')
  return retStr
}

module.exports = t_list
