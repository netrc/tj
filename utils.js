
const zeroPre = n => (n<10) ? '0'+n : n

const isoTimestamp = ( x=(new Date()) ) => {  // year-mm-ddThh:mm // no seconds
  const xx = x.toString()
  const m = x.getMonth() + 1 // !! zero-based
  const d = x.getDay()
  return `${x.getFullYear()}-${zeroPre(m)}-${zeroPre(d)}T${xx.substring(16,21)}`
}

const journalMonth = ( x=(new Date()) ) => {
  const m = x.getMonth() + 1 // !! zero-based
  return `${x.getFullYear()}-${zeroPre(m)}`
}

const projectFiles = ( p='tProj' ) => {
  // read ~/.tj
  return {
    todo: 'Todo',
    done: 'Done'
  }
}
  
module.exports = {
  isoTimestamp, journalMonth
}
