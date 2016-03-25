let UUID = require("node-uuid")
let {curry, merge} = require("ramda")
let {User} = require("./types")

// Generate default required values...

let makeUser = curry((data) => {
  return User(merge({
    id: UUID.v4(),
  }, data))
})

exports.makeUser = makeUser