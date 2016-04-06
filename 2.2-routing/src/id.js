let c = 0

module.exports = function makeId() {
  c = c + 1
  return String(c)
}