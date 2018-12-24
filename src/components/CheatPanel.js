class CheatPanel {
  constructor (parent) {
    this.parent = parent
    this.root = parent.parent
    document.onkeyup = this.detectCheatCode.bind(this)
    this.characters = ''
    this.isVisible = false
    this.custom = {
      rows: '',
      cols: '',
      win: '',
      p1Color: '',
      p2Color: ''
    }
  }

  render () {
    return `
      <div class="secret-panel">
        <input
          type="number"
          placeholder="Num of rows"
          value="${this.custom.rows}"
          oninput="app.playerList.cheatPanel.custom.row = this.value"
        />
        <input
          type="number"
          placeholder="Num of columns"
          value="${this.custom.cols}"
          oninput="app.playerList.cheatPanel.custom.cols = this.value"
        />
        <input
          type="number"
          placeholder="Num to win"
          value="${this.custom.win}"
          oninput="app.playerList.cheatPanel.custom.win = this.value"
        />
        <input
          type="color"
          placeholder="Player 1"
          value="${this.custom.p1Color}"
          oninput="app.playerList.cheatPanel.custom.p1Color = this.value"
        />
        <input
          type="color"
          placeholder="Player 2"
          value="${this.custom.p2Color}"
          oninput="app.playerList.cheatPanel.custom.p2Color = this.value"
        />
      </div>
    `
  }

  detectCheatCode (evt) {
    this.characters = this.characters.length >= 8 ?
      `${this.characters.substring(1,8)}${evt.key}` :
      `${this.characters}${evt.key}`
    if (this.characters.includes('custom')){
      this.characters = ''
      this.isVisible = true
      this.root.element.innerHTML = this.parent.render()
      console.log('cheat activated:')
    }
  }
}

module.exports = CheatPanel