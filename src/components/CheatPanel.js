const {
  NUM_OF_ROWS,
  NUM_OF_COLUMNS,
  NUM_TO_WIN,
  P1_COLOR,
  P2_COLOR,
  CHEAT_CODE
} = require('../constants')

class CheatPanel {
  constructor (parent) {
    this.parent = parent
    this.root = parent.parent
    document.onkeyup = this.detectCheatCode.bind(this)
    this.characters = ''
    this.isVisible = false
    this.resetRuleSet()
  }

  resetRuleSet () {
    this.ruleSet = {
      rows: NUM_OF_ROWS,
      cols: NUM_OF_COLUMNS,
      win: NUM_TO_WIN,
      p1Color: P1_COLOR,
      p2Color: P2_COLOR
    }
  }

  render () {
    return `
      <form class="secret-panel" onchange="app.playerList.cheatPanel.handleChange()">
        <div>
          <span>Rows:</span>
            <span class="range-group">
            <input
              type="range"
              max="10"
              min="4"
              placeholder="Num of rows"
              value="${this.ruleSet.rows}"
              oninput="app.playerList.cheatPanel.ruleSet.rows = this.value"
            />
            <span class="rows panel-value">${this.ruleSet.rows}</span>
          </span>
        </div>
        <div>
          <span>Columns:</span>
          <span class="range-group">
            <input
              type="range"
              max="10"
              min="4"
              placeholder="Num of columns"
              value="${this.ruleSet.cols}"
              oninput="app.playerList.cheatPanel.ruleSet.cols = this.value"
            />
            <span class="cols panel-value">${this.ruleSet.cols}</span>
          <span>
        </div>
        <div>
          <span>Win condition:</span>
          <span class="range-group">
            <input
              type="range"
              placeholder="Num to win"
              min="3"
              max="7"
              value="${this.ruleSet.win}"
              oninput="app.playerList.cheatPanel.ruleSet.win = this.value"
            />
            <span class="win panel-value">${this.ruleSet.win}</span>
          </span>
        </div>
        <div>
          <span>Your coin color:</span>
          <input
            type="color"
            placeholder="Player 1"
            value="${this.ruleSet.p1Color}"
            oninput="app.playerList.cheatPanel.ruleSet.p1Color = this.value"
          />
        </div>
        <div>
          <span>Opponent coin color:</span>
          <input
            type="color"
            placeholder="Player 2"
            value="${this.ruleSet.p2Color}"
            oninput="app.playerList.cheatPanel.ruleSet.p2Color = this.value"
          />
        </div>
      </form>
    `
  }

  handleChange() {
    const secretPanel = document.getElementsByClassName('secret-panel')[0]
    let cols = secretPanel.querySelector('.cols')
    let rows = secretPanel.querySelector('.rows')
    let win = secretPanel.querySelector('.win')
    cols.textContent = this.ruleSet.cols
    rows.textContent = this.ruleSet.rows
    win.textContent = this.ruleSet.win
  }

  detectCheatCode (evt) {
    this.characters = this.characters.length >= 8 ?
      `${this.characters.substring(1,8)}${evt.key}` :
      `${this.characters}${evt.key}`
    if (this.characters.includes(CHEAT_CODE)){
      this.characters = ''
      this.isVisible = true
      this.root.element.innerHTML = this.parent.render()
    }
  }
}

module.exports = CheatPanel