

const isoTimestamp = ( x=(new Date()) ) => {
  const xx = x.toString()
  const m = x.getMonth() + 1 // !! zero-based
  const d = x.getDay()
  mm = (m<10) ? '0'+m : m
  dd = (d<10) ? '0'+d : d
  return `${x.getFullYear()}-${mm}-${dd}T${xx.substring(16,24)}`
}

const journalMonth = ( x=(new Date()) ) => {
  const m = x.getMonth() + 1 // !! zero-based
  mm = (m<10) ? '0'+m : m
  return `${x.getFullYear()}-${mm}`
}

const projectFiles = ( p='tProj' ) => {
  // read ~/.tj
  return {
    todo: 'Todo',
    done: 'Done'
  }
}
  

//console.log(isoTimestamp())
//'Fri May 13 2022 18:37:56 GMT-0400 (Eastern Daylight Time)'

module.exports = {
  isoTimestamp, journalMonth
}
