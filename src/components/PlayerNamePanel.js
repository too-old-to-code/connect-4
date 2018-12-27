class PlayerNamePanel {
  constructor (opponentName, {p1Color, p2Color}, playerNumber) {
    this.opponentName = opponentName
    this.p1Color = p1Color
    this.p2Color = p2Color
    this.playerNumber = playerNumber
  }

  render (turn) {
    let playerTurn = turn % 2

    return (`
      <div class="players">
        <div class="players__name players__name--one ${playerTurn === 0 ? '' : 'players__name--active'}">
          <span class="players__text" style="border-color:${this.p1Color};">
            ${this.playerNumber === 0 ? 'You' : this.opponentName }
          </span>
        </div>
        <div class="players__name players__name--two ${playerTurn === 0 ? 'players__name--active' : ''}">
          <span class="players__text" style="border-color:${this.p2Color};">
            ${this.playerNumber === 1 ? 'You' : this.opponentName }
          </span>
        </div>
      <div>
    `)
  }

}

module.exports = PlayerNamePanel