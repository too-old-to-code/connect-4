const row = require('./Row')

const Table = ({rows, cols, table}) => {
  let html = ''
  for (let i = 0; i < rows; i++) {
    html += row(i * cols, cols, table.slice(i * cols, (i * +cols) + +cols))
  }
  return `
    <table
      class="apparatus"
      style="left: ${cols * 10}px; top: ${rows * 10}px"
    />
      ${html}
    </table>`
}

module.exports = Table