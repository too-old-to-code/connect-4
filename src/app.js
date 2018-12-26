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
    this.suggestedRuleSet = {}
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
    try {
      let appState = localStorage.getItem('appState')
      if (appState) {
        this.state = JSON.parse(appState)
      }
    } catch (e) {
      console.log('Couldn\t deserialise appstate')
    }
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

    this.startGame(opponentId, true, this.suggestedRuleSet)
  }

  declineInvitation (opponentId) {
    this.socket.emit('deny', opponentId)
    this.hideModal()
    this.suggestedRuleSet = {}
  }

  startGame (opponentId, isPlayer2, ruleSet) {
    let rs = ruleSet || this.playerList.cheatPanel.ruleSet
    let players = [this.state.id]
    players[isPlayer2 ? 'push' : 'unshift'](opponentId)
    this.game = new Game(this, players, rs)
    this.element.innerHTML = this.game.render()
    this.hideModal()
    this.socket.emit('occupied', this.state.id, true)
    this.suggestedRuleSet = {}
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

window.app = {
  init: () => app = new App(document.getElementById('app'))
}

window.onload = app.init

