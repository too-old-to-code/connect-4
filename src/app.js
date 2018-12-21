const io = require('socket.io-client');
const LoginForm = require('./components/LoginForm')
const PlayerList = require('./components/PlayerList')

class Game {
  constructor(element) {
    this.element = element
    this.login = new LoginForm(this)
    this.playerList = new PlayerList(this)

    this.state = {
      token: ''
    }
    this.element.innerHTML = this.render()

  }

  render () {
    return !this.state.token
      ? this.login.render()
      : (() => {
          this.listenForConnection()
          return this.playerList.render()
        })()
  }

  listenForConnection () {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('connected:')
      this.socket.emit('login', this.state.token)

      this.state.id = this.socket.id
      console.log('this:', this.state)

      this.socket.on('private', function (msg) {
        console.log('private:', msg)
      })

      this.socket.on('newConnection', (players) => {
        console.log('newjoiner:', players)
        this.playerList.options = players
        this.element.innerHTML = this.playerList.render()
      })

      this.socket.on('newClient', (player) => {
        console.log('newClient:', player)
        this.playerList.options.push(player)
        this.element.innerHTML = this.playerList.render()
      })

      this.socket.on('clientLeft', function(playerId) {
        console.log('client left:', playerId)
      })

      this.socket.on('invitationDenied', function(msg) {
        console.log('invitation denied:')
      })

      this.socket.on('tableUpdate', function(msg) {
        console.log('tableupdated:')
      })

      this.socket.on('invitationAccepted', function(gamePlayers) {
        console.log('invitationaccepted:')
      })

    })
  }

}

window.app = {
  init: () => app.game = new Game(document.getElementById('app'))
}

window.onload = app.init

