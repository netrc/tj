
const u = require('../src/utils.js')

//const journalMonth = ( x=(new Date()) ) => {  // year-mm
//const ymdTimestamp = ( x=(new Date()) ) => {  // year-mm-dd
//const isoTimestamp = ( x=(new Date()) ) => {  // year-mm-ddThh:mm // no seconds

test('checks journalMonth', () => {
  expect(u.journalMonth( new Date('2022-01-01T12:30'))).toBe('2022-01')  // have to offset Z to get eastern
  expect(u.journalMonth( new Date('2022-01-31T12:30'))).toBe('2022-01')
  expect(u.journalMonth( new Date('2022-11-15T12:30'))).toBe('2022-11')
})

test('checks ymdTimestamp', () => {
  expect(u.ymdTimestamp( new Date('2022-01-01T12:30'))).toBe('2022-01-01')
  expect(u.ymdTimestamp( new Date('2022-01-31T12:30'))).toBe('2022-01-31')
  expect(u.ymdTimestamp( new Date('2022-11-05T12:30'))).toBe('2022-11-05')
  expect(u.ymdTimestamp( new Date('2022-11-15T12:30'))).toBe('2022-11-15')
})

test('checks isoTimestamp', () => {
  expect(u.isoTimestamp( new Date('2022-01-01T12:10'))).toBe('2022-01-01T12:10')
  expect(u.isoTimestamp( new Date('2022-01-31T14:25'))).toBe('2022-01-31T14:25')
  expect(u.isoTimestamp( new Date('2022-11-05T16:40'))).toBe('2022-11-05T16:40')
  expect(u.isoTimestamp( new Date('2022-11-15T18:59'))).toBe('2022-11-15T18:59')
})
