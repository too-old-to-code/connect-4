const gameLogicHelpers = require('../helpers/game-logic')
const tableUI = require('./apparatus/Table')

const isLocalPlayersTurn = (playerToMoveID, localPlayerID) => playerToMoveID === localPlayerID

class Game {
  constructor(parent, players, ruleSet){
    this.parent = parent
    this.state = {
      players: players,
      turn: 0,
      table: (() => {
        let arr = Array.apply(null, new Array((ruleSet.rows * ruleSet.cols)))
        return arr.map(el => 0)
      })(),
      ...ruleSet,
    }
    this.localPlayerId = players.filter(id => id === this.parent.state.id)[0]
    this.remotePlayerId = players.filter(id => id !== this.parent.state.id)[0]

    this.helpers = gameLogicHelpers(this.state)
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
        style="min-width: ${this.state.cols * 90}px"
        onclick="app.game.handleAction(event)"
      >
        ${tableUI(this.state)}
      </div>
    `)
  }

  handleTableUpdate(updatedTable, turnAlreadyIncremented) {
    const { gameHasBeenWon, gameDrawn } = this.helpers
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
    this.parent.suggestedRuleSet = {}
    this.parent.playerList.cheatPanel.isVisible = false
  }

  handleAction (evt) {
    const { players, turn } = this.state
    const { id: cellId } = evt.target.dataset
    if(!isLocalPlayersTurn(players[turn % 2], this.localPlayerId) || (cellId == null)) return
    this.state.turn ++
    let emptyCellInColumn = this.helpers.findEmptyCellInColumn(cellId, this.state.table)
    if (emptyCellInColumn != null) {
      this.state.table[emptyCellInColumn] = (turn % 2) + 1
      this.parent.socket.emit('table', this.state.table, this.remotePlayerId)
      this.handleTableUpdate(this.state.table, true)
    }
  }
}

module.exports = Game