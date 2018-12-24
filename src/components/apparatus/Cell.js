const initialOffset = 20
const leftOffset = (id, cols) => (id % cols) * 10 + initialOffset
const topOffset = (id, cols) => Math.floor(id/cols) * 10 + initialOffset

module.exports = (id, cols, state) => {
  console.log('state:', state)
  let color = state ? `background-color: ${state === 1 ? 'red' : 'yellow'};` : ''
  return `
  <td
    data-id="${id}"
    style="left: -${leftOffset(id, cols)}px; top: -${topOffset(id, cols)}px; ${color}}"
  />
`}