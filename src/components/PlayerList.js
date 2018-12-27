const CheatPanel = require('./CheatPanel')

class PlayerList {
  constructor(parent) {
    this.parent = parent
    this.element = this.parent.element
    this.players = {}
    this.cheatPanel = new CheatPanel(this)
  }

  renderInviteModal (player) {
    return `
      <div class="modal__box">
        <span class="modal__title">Waiting for ${player.name} to accept your invitation</span>
        <hr />
        <button class="btn" onclick="app.declineInvitation('${player.id}')">Cancel</button>
      </div>
    `
  }

  render () {
    return `
      <div class="panel">
          <select size="5" class="${this.options().length ? 'list' : 'list list--empty'}" >
            ${
                this.options().reduce((acc, option) => {
                  return `${acc}<option
                    onclick="app.playerList.selected = '${option}'"
                    value="${option}"
                    ${this.players[option].busy ? 'disabled' : ''}
                    >
                      ${this.players[option].name} ${this.players[option].busy ? '&lt;-- busy --&gt;' : ''}
                    </option>`
                }, '')
            }
          </select>
          <button class="btn btn--fullwidth" onclick="app.playerList.handleInvite()" ${this.options().length ? '' : 'disabled'}>Invite</button>
        ${
            this.options().length
              ? ''
              : '<span class="list__warning">Currently, no other players are online</span>'
          }
      </div>
      ${this.cheatPanel.isVisible ? this.cheatPanel.render() : '' }
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
      from: this.parent.state.id,
      customRuleSet: this.cheatPanel.ruleSet
    }
    let player = this.players[this.selected]
    this.parent.socket.emit('invite', invitation)
    this.parent.showModal(this.renderInviteModal(player))


  }
}

module.exports = PlayerList