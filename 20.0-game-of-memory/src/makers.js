let {curry, merge} = require("ramda")
let {User} = require("./types")

let c = 0

let makeId = function () {
  c = c + 1
  return String(c)
}

let makeUser = curry((makeId, data) => {
  return User(merge({
    id: makeId(),
  }, data))
})

exports.makeId = makeId
exports.makeUser = makeUser(makeId)
exports.draftUser = makeUser(() => "1")