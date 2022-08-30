
const fatalErr = err => {
  console.error(err)
  process.exit(1)
}

const zeroPre = n => (n<10) ? '0'+n : n

const journalMonth = ( x=(new Date()) ) => {  // year-mm
  const m = x.getMonth() + 1 // !! zero-based
  return `${x.getFullYear()}-${zeroPre(m)}`
}

const ymdTimestamp = ( x=(new Date()) ) => {  // year-mm-dd
  const m = x.getMonth() + 1 // !! zero-based
  const d = x.getDate()  // n.b. getDay is day of week
  return `${x.getFullYear()}-${zeroPre(m)}-${zeroPre(d)}`
}

const isoTimestamp = ( x=(new Date()) ) => {  // year-mm-ddThh:mm // no seconds
  const xx = x.toString()
  const m = x.getMonth() + 1 // !! zero-based
  const d = x.getDate()
  return `${x.getFullYear()}-${zeroPre(m)}-${zeroPre(d)}T${xx.substring(16,21)}`
}

module.exports = {
  fatalErr,
  ymdTimestamp,
  journalMonth,
  isoTimestamp 
}
