const cell = require('./Cell')

const row = (startIndex, cols, state) => {
  let html = ''
  for (let i = startIndex; i < startIndex + cols; i++) {
    html += cell(i, cols, state.slice(i % cols, i % cols + 1)[0])
  }
  return `
    <tr>${html}</tr>
  `
}

module.exports = row
