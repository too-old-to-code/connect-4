const cell = require('./Cell')

const row = (startIndex, cols, row) => {
  cols = Number(cols)
  let html = ''
  for (let i = startIndex; i < startIndex + cols; i++) {
    html += cell(i, cols, row.slice(i % cols, i % cols + 1)[0])
  }
  return `
    <tr class="apparatus__row">${html}</tr>
  `
}

module.exports = row
