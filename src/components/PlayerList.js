class PlayerList {
  constructor(parent) {
    this.parent = parent
    this.element = this.parent.element
    this.players = {}
  }

  renderInviteModal (player) {
    return `
      <div class="modal-box">
        <span class="modal-title">Waiting for ${player.name} to accept your invitation</span class="modal-title">
        <hr />
        <button onclick="app.declineInvitation('${player.id}')">Cancel</button>
      </div>
    `
  }

  render () {
    return `
      <div class="player-list-wrapper">
        <div class="player-list">
          <select size="5" >
            ${
                this.options().reduce((acc, option) => {
                  return `${acc}<option
                    onclick="app.playerList.selected = '${option}'"
                    value="${option}"
                    >
                      ${this.players[option].name}
                    </option>`
                }, '')
            }
          </select>
          <button onclick="app.playerList.handleInvite()">Invite</button>
        </div>
        ${
            this.options().length
              ? ''
              : '<span class="warning">Currently, no other players are online</span>'
          }
      </div>
    `
  }

  options() {
    return  Object.keys(this.players)
      .filter(playerId => playerId !== this.parent.state.id)
  }

  handleInvite (user) {
    if(!this.selected) return
    let invitation = {
      to: this.selected,
      from: this.parent.state.id
    }
    let player = this.players[this.selected]
    this.parent.socket.emit('invite', invitation)
    this.parent.showModal(this.renderInviteModal(player))


  }
}

module.exports = PlayerList