const NUM_OF_COLUMNS = 7
const NUM_OF_ROWS = 6
const NUM_OF_CELLS = NUM_OF_COLUMNS * NUM_OF_ROWS
const NUM_TO_WIN = 2
const COLOUR1 = 'red'
const COLOUR2 = 'yellow'

const detectHorizontalWin = player =>
  `${player.repeat(NUM_TO_WIN)}`

const detectVerticalWin = player =>
  `(${player}.{${NUM_OF_COLUMNS}}){${NUM_TO_WIN - 1}}${player}`

const detectDiagonalUpRightWin = player =>
  `(${player}.{${NUM_OF_COLUMNS + 1}}){${NUM_TO_WIN - 1}}${player}`

const detectDiagonalDownRightWin = player =>
  `(${player}.{${NUM_OF_COLUMNS - 1}}){${NUM_TO_WIN - 1}}${player}`

const detectAWin = player => {
  let hW = detectHorizontalWin(player)
  let vW = detectVerticalWin(player)
  let dURW = detectDiagonalUpRightWin(player)
  let dDRW = detectDiagonalDownRightWin(player)
  return `${hW}|${vW}|${dURW}|${dDRW}`
}

const p1WinCondition = new RegExp(detectAWin('1'), 'g')
const p2WinCondition = new RegExp(detectAWin('2'), 'g')

module.exports = {
  p1WinCondition,
  p2WinCondition,
  NUM_OF_CELLS,
  NUM_OF_COLUMNS,
  NUM_OF_ROWS,
  COLOUR1,
  COLOUR2
}