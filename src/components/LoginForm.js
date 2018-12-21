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
      this.element.innerHTML = this.parent.render()
    }
  }
}

module.exports = LoginForm