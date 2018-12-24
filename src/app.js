const io = require('socket.io-client');
const LoginForm = require('./components/LoginForm')
const PlayerList = require('./components/PlayerList')
const Game = require('./components/Game')

class App {
  constructor(element) {
    this.element = element
    this.modal = document.querySelector('.modal')
    this.login = new LoginForm(this)
    this.playerList = new PlayerList(this)

    this.state = {
      token: ''
    }
    this.element.innerHTML = this.render()

  }

  renderInviteModal (player) {
    return `
      <div class="modal-box">
        <span class="modal-title">${player.name} has invited you to play a game</span>
        <hr/>
        <button onclick="app.acceptInvitation('${player.id}')">Accept</button>
        <button onclick="app.declineInvitation('${player.id}')">Decline</button>
      </div>
    `
  }

  render () {
    return !this.state.token
      ? this.login.render()
      : (() => {
          this.listenForConnection()
          return this.playerList.render()
        })()
  }

  acceptInvitation (opponentId) {
    this.socket.emit('accept', {
      p1: opponentId,
      p2: this.state.id
    })
    // this.socket.emit('accept', this.state.id)
    this.startGame(opponentId, true)
  }

  declineInvitation (opponentId) {
    this.socket.emit('deny', opponentId)
    this.hideModal()
  }

  startGame (opponentId, isPlayer2) {
    let players = [this.state.id]
    players[isPlayer2 ? 'push' : 'unshift'](opponentId)
    console.log('this.players:', players)
    this.game = new Game(this, players)
    this.element.innerHTML = this.game.render()
    this.hideModal()
  }

  showModal (modal) {
    this.element.classList.add('show-modal')
    this.modal.classList.add('show')
    this.modal.innerHTML = modal
  }

  hideModal () {
    this.element.classList.remove('show-modal')
    this.modal.classList.remove('show')
  }

  listenForConnection () {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('connected:')
      this.socket.emit('login', this.state.token)

      this.state.id = this.socket.id
      console.log('this:', this.state)

      this.socket.on('private', (invitation) => {
        if (this.game) return
        console.log('private:', invitation)
        const player = this.playerList.players[invitation.from]
        this.showModal(this.renderInviteModal(player))
      })

      this.socket.on('newConnection', (players) => {
        console.log('newjoiner:', players)
        this.playerList.players = players
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
        console.log('invitation denied:')
        this.hideModal()

      })

      this.socket.on('invitationAccepted', (opponent) => {
        console.log('invitationaccepted:', opponent)
        this.startGame(opponent)
      })

    })
  }

}

window.app = {
  init: () => app = new App(document.getElementById('app'))
}

window.onload = app.init

