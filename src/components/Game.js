const {
  NUM_OF_COLUMNS,
  NUM_OF_ROWS,
  NUM_OF_CELLS,
  p1WinCondition,
  p2WinCondition
} = require('../constants')

const tableUI = require('./apparatus/Table')

let isLocalPlayersTurn = (playerToMoveID, localPlayerID) => playerToMoveID === localPlayerID

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

const findEmptyCellInColumn = (id, tableState) =>
  findUppermostEmptyCellInColumn(findBottomCellOfColumn(findParentColumnOfCell(id)), tableState)

function gameHasBeenWon (tableState, players) {
  const re = new RegExp(`.{${NUM_OF_COLUMNS}}`,'g')
  const stringifiedTable = tableState.join('').match(re).join('|');
  const p1Winner = p1WinCondition.test(stringifiedTable)
  const p2Winner = p2WinCondition.test(stringifiedTable)
  const hasWinner = p1Winner || p2Winner
  return [hasWinner, hasWinner && (p1Winner ? players[0] : players[1])]
}

function gameDrawn (tableState) {
  return !tableState.includes(0)
}

const determinePlayerTurn = turn => (turn % 2) + 1

class Game {
  constructor(parent, players){
    this.parent = parent
    this.state = {
      players: players,
      turn: 0,
      table: (() => {
        let arr = Array.apply(null, new Array(NUM_OF_CELLS))
        return arr.map(el => 0)
      })()
    }
    this.localPlayerId = players.filter(id => id === this.parent.state.id)[0]
    this.remotePlayerId = players.filter(id => id !== this.parent.state.id)[0]

    // game events
    this.parent.socket.on('tableUpdate', this.handleTableUpdate.bind(this))
  }

  renderGameEndMessage(text) {
    return (`
      <div class="modal-box">
        <span class="modal-title">${text}</span>
      </div>
    `)
  }

  render () {
    return (`
      <div
        class="game"
        style="min-width: ${7 * 90}px"
        onclick="app.game.handleAction(event)"
      >
        ${tableUI(6, 7, this.state.table)}
      </div>
    `)
  }

  handleTableUpdate(updatedTable, turnAlreadyIncremented) {
    this.state.table = updatedTable
    this.parent.element.innerHTML = this.render()

    let [gameWasWon, winner] = gameHasBeenWon(updatedTable, this.state.players)
    if (gameWasWon) {
      let endMessage = winner === this.localPlayerId
        ? 'You won dude!!!'
        : 'You got smashed mate!!!'
      this.showEndMessage(endMessage)
    } else if (gameDrawn(updatedTable)) {
      this.showEndMessage('This game was a draw')
    } else if (!turnAlreadyIncremented){
      this.state.turn ++
    }
  }

  showEndMessage (msg) {
    setTimeout(() => {
      this.parent.game = null
      this.parent.hideModal()
      this.parent.element.innerHTML = this.parent.playerList.render()
      this.parent.socket.emit('occupied', this.localPlayerId, false)
    }, 3000)
    this.parent.showModal(this.renderGameEndMessage(msg))
  }

  handleAction (evt) {
    const { players, turn } = this.state
    const { id: cellId } = evt.target.dataset
    if(!isLocalPlayersTurn(players[turn % 2], this.localPlayerId) || (cellId == null)) return
    this.state.turn ++
    let emptyCellInColumn = findEmptyCellInColumn(cellId, this.state.table)
    if (emptyCellInColumn != null) {
      this.state.table[emptyCellInColumn] = (turn % 2) + 1
      this.parent.socket.emit('table', this.state.table, this.remotePlayerId)
      this.handleTableUpdate(this.state.table, true)
    }
  }
}

module.exports = Game