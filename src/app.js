// const io = require('socket.io-client');
const LoginForm = require('./components/LoginForm')
const PlayerList = require('./components/PlayerList')
const Game = require('./components/Game')
const Socket = require('./components/Socket')

// Example of Object oriented programming
class App extends Socket {
  constructor(element) {
    super()
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
      <div class="modal__box">
        <span class="modal__title">${player.name} has invited you to play a game</span>
        <hr/>
        <button class="btn" onclick="app.acceptInvitation('${player.id}')">Accept</button>
        <button class="btn" onclick="app.declineInvitation('${player.id}')">Decline</button>
      </div>
    `
  }

  render () {
    // Example of using localStorage and try catch statements
    try {
      let appState = localStorage.getItem('appState')
      if (appState) {
        this.state = JSON.parse(appState)
      }
    } catch (e) {
      console.log('Couldn\t deserialise appstate')
    }
    // Example using IIFE
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
    this.element.classList.add('main--modal')
    this.modal.classList.add('modal--show')
    this.modal.innerHTML = modal
  }

  hideModal () {
    this.element.classList.remove('main--modal')
    this.modal.classList.remove('modal--show')
  }
}

// Example of self defining function
window.app = {
  init: () => app = new App(document.getElementById('app'))
}

window.onload = app.init

