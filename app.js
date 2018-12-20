class LoginForm {
  constructor(parent){
    this.parent = parent
    this.element = this.parent.element
  }

  render () {
    this.element.onclick = this.handleClick.bind(this)
    return `
      <div class="login-form">
        <input placeholder="Name" class="name"/>
        <button class="btn1">Join</button>
      </div>
    `
  }

  handleClick (e) {
    if (e.target.className.includes('btn1')) {
      this.parent.state.token = this.element.querySelector('.name').value
      this.parent.render()
    }
  }
}


class PlayerList {
  constructor(parent) {
    this.parent = parent
    this.element = this.parent.element
  }

  render () {

  }
}

class BoardPage {
  constructor(parent) {
    this.parent = parent
    this.element = parent.element
  }

  render () {
    return `
      <div>
        <div>Some text here</div>
        <button onclick="app.game.page.handleButtonClick()">Page button</button>
      </div>
    `
  }

  handleButtonClick (e) {
    console.log('hello:')
    this.parent.render()
  }
}


class Game {
  constructor(element) {
    this.element = element
    this.page = new BoardPage(this)
    this.login = new LoginForm(this)
    this.state = {
      token: ''
    }
    this.render()

  }

  render () {

    this.element.innerHTML = !this.state.token
      ? this.login.render()
      : `
        <div id="game">
          <h1>Welcome, ${this.state.token}.</h1>
          <button onclick="app.game.handleBtn1()">Press me</button>
          <button onclick="app.game.handleBtn2()">Press me</button>
          <button onclick="app.game.handleBtn3()">Press me</button>
          <div class="anchor"></div>
        </div>
      `
  }

  handleBtn1(){
    this.element.innerHTML = this.page.render()
  }

  handleBtn2(){
    this.element.querySelector('.anchor').innerHTML = this.page.render()
    console.log('button2:')

  }
  handleBtn3(){
    console.log('button3:')
  }
}

const app = {
  init: () => app.game = new Game(document.getElementById('app'))
}

window.onload = app.init

