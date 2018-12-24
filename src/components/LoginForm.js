class LoginForm {
  constructor(parent){
    this.parent = parent
    this.element = this.parent.element
    this.value = ''
  }

  render () {
    return `
      <div class="login-form">
        <input
          placeholder="Name"
          class="name"
          value="${this.value}"
          oninput="app.login.handleInput(this.value)"
        />
        <button onclick="app.login.handleConnect()">Join</button>
      </div>
    `
  }

  handleInput (val) {
    this.value = val
  }

  handleConnect (e) {
    this.parent.state.token = this.value
    this.element.innerHTML = this.parent.render()
  }
}

module.exports = LoginForm