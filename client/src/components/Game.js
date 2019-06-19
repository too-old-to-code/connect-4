const gameLogicHelpers = require('../helpers/game-logic')
const tableUI = require('./apparatus/Table')
const { modalMessages: { WIN, LOSE, DRAW}} = require('../constants')
const PlayerNamePanel = require('./PlayerNamePanel')

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
    this.localPlayerName = this.parent.playerList.players[this.localPlayerId].name
    this.remotePlayerName = this.parent.playerList.players[this.remotePlayerId].name
    this.playerNumber = this.state.players.indexOf(this.localPlayerId)
    this.playerNamePanel = new PlayerNamePanel(this.remotePlayerName, ruleSet, this.playerNumber)
    this.helpers = gameLogicHelpers(this.state)
    // game events
    this.parent.socket.on('tableUpdate', this.handleTableUpdate.bind(this))
  }

  renderGameEndMessage(msg) {
    return (`
      <div class="modal__box modal__box--${msg[1]}">
        <span class="modal__title">${msg[0]}</span>
      </div>
    `)
  }

  get playersCoin () {
    const { turn } = this.state
    return (turn % 2) + 1
  }

  insertCoin (emptyCellInColumn) {
    this.state.table[emptyCellInColumn] = this.playersCoin
    this.state.turn ++
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
      ${this.playerNamePanel.render(this.state.turn)}
    `)
  }

  handleTableUpdate(updatedTable, turnAlreadyIncremented) {
    const { gameHasBeenWon, gameDrawn } = this.helpers
    this.state.table = updatedTable
    if (!turnAlreadyIncremented) {
      this.state.turn ++
    }
    this.parent.element.innerHTML = this.render()
    let [gameWasWon, winner] = gameHasBeenWon(updatedTable, this.state.players)
    if (gameWasWon) {
      let endMessage = winner === this.localPlayerId
        ? [WIN, 'winner']
        : [LOSE, 'loser']
      this.showEndMessage(endMessage)
    } else if (gameDrawn(updatedTable)) {
      this.showEndMessage([DRAW, 'draw'])
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
    this.parent.playerList.cheatPanel.resetRuleSet()
  }

  handleAction (evt) {
    const { players, turn } = this.state
    const { id: cellId } = evt.target.dataset
    if(!isLocalPlayersTurn(players[turn % 2], this.localPlayerId) || (cellId == null)) return
    let emptyCellInColumn = this.helpers.findEmptyCellInColumn(cellId, this.state.table)
    if (emptyCellInColumn != null) {
      this.insertCoin(emptyCellInColumn)
      this.parent.socket.emit('table', this.state.table, this.remotePlayerId)
      this.handleTableUpdate(this.state.table, true)
    }
  }
}

module.exports = Game