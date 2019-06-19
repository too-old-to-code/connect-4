// Example of understanding of closures and the revealing module pattern
module.exports = ruleSet => {

  const { win: NUM_TO_WIN, rows: NUM_OF_ROWS, cols: NUM_OF_COLUMNS } = ruleSet

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

  // Example of regular expressions
  const gameHasBeenWon = (tableState, players) => {
    const re = new RegExp(`.{${NUM_OF_COLUMNS}}`,'g')
    const stringifiedTable = tableState.join('').match(re).join('|');
    const p1Winner = p1WinCondition.test(stringifiedTable)
    const p2Winner = p2WinCondition.test(stringifiedTable)
    const hasWinner = p1Winner || p2Winner
    // Example of familiarity with tuples
    return [hasWinner, hasWinner && (p1Winner ? players[0] : players[1])]
  }

  const findParentColumnOfCell = id => id % NUM_OF_COLUMNS

  const findBottomCellOfColumn = columnId =>
    NUM_OF_ROWS * NUM_OF_COLUMNS - (NUM_OF_COLUMNS - columnId)

  const coinInCellAlready = (tableState, cell) => Boolean(tableState[cell])

  const findUppermostEmptyCellInColumn = (bottomCellOfColumn, tableState) => {
    let currentCell = bottomCellOfColumn
    while (coinInCellAlready(tableState, currentCell)) {
      currentCell -= NUM_OF_COLUMNS
    }
    return currentCell >= 0 ? currentCell : null
  }
  // Example of functional style with function composition
  const findEmptyCellInColumn = (id, tableState) =>
    findUppermostEmptyCellInColumn(findBottomCellOfColumn(findParentColumnOfCell(id)), tableState)

  const gameDrawn = tableState => {
    return !tableState.includes(0)
  }

  return {
    gameDrawn,
    gameHasBeenWon,
    findEmptyCellInColumn
  }
}