const initialOffset = 20
const App = require('../../app')
const leftOffset = (id, cols) => (id % cols) * 10 + initialOffset
const topOffset = (id, cols) => Math.floor(id/cols) * 10 + initialOffset

module.exports = (id, cols, hasCoin) => {
  let { p1Color, p2Color } = app.game.state
  let color = hasCoin ? `background-color: ${hasCoin === 1 ? p1Color : p2Color};` : ''
  return `
  <td
    class="apparatus__cell"
    data-id="${id}"
    style="left: -${leftOffset(id, cols)}px; top: -${topOffset(id, cols)}px; ${color}}"
  />
`}