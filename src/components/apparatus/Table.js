const row = require('./Row')

const table = (rows, cols, state) => {
  let html = ''
  for (let i = 0; i < rows; i++) {
    html += row(i * cols, cols, state.slice(i * cols, i * cols + cols))
  }
  return `
    <table
      id="table"
      style="left: ${cols * 10}px; top: ${rows * 10}px"
    />
      ${html}
    </table>`
}

module.exports = table