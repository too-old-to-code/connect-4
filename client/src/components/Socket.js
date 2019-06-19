const io = require('socket.io-client');

class Socket {
  listenForConnection () {
    this.socket = io('http://localhost:3000');
    // this.socket = io('/socket');

    this.socket.on('connect', () => {
      this.socket.emit('login', this.state.token)

      this.state.id = this.socket.id

      this.socket.on('private', (invitation) => {
        if (this.game) return
        const player = this.playerList.players[invitation.from]
        this.suggestedRuleSet = invitation.customRuleSet
        this.showModal(this.renderInviteModal(player))
      })

      this.socket.on('playerBusyStatusChange', clients => {
        this.playerList.players = clients
        if (this.game) return
        this.element.innerHTML = this.playerList.render()
      })

      this.socket.on('newConnection', (players) => {
        this.playerList.players = players
        if (this.game) return
        this.element.innerHTML = this.playerList.render()
      })

      this.socket.on('newClient', (player) => {
        this.playerList.players = {
          ...this.playerList.players,
          [player.id]: player
        }
        if (this.game) return
        this.element.innerHTML = this.playerList.render()
      })

      this.socket.on('clientLeft', (playerId) => {
        delete this.playerList.players[playerId]
        if (this.game) return
        this.element.innerHTML = this.playerList.render()
      })

      this.socket.on('invitationDenied', (opponentId) => {
        this.hideModal()
      })

      this.socket.on('invitationAccepted', (opponent) => {
        this.startGame(opponent)
      })

    })
  }
}

module.exports = Socket