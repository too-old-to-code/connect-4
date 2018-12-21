class PlayerList {
  constructor(parent) {
    this.parent = parent
    this.element = this.parent.element
    this.options = []
  }

  render () {
    return `
      <div class="player-list-wrapper">
        <div class="player-list">
          <select size="5" >
            ${
                this.options.reduce((acc, option) => {
                  return `${acc}<option
                    onclick="app.game.playerList.selected = '${option.id}'"
                    value="${option.id}"
                    >
                      ${option.name}
                    </option>`
                }, '')
            }
          </select>
          <button onclick="app.game.playerList.handleInvite()">Invite</button>
        </div>
        ${
            this.options.length
              ? ''
              : '<span class="warning">Currently, no other players are online</span>'
          }
      </div>
    `
  }


  // options () {
  //   return [
  //     {id: 1, name: 'Billy'},
  //     {id: 2, name: 'Robert'},
  //     {id: 3, name: 'Kirk'}
  //   ]
  // }

  handleInvite (user) {
    let invitation = {
      to: this.selected,
      from: this.parent.state.id,
      name: this.parent.state.token
    }
    this.parent.socket.emit('invite', invitation)
    console.log(invitation)
  }
}

module.exports = PlayerList