let UUID = require("node-uuid")
let {curry, merge} = require("ramda")

// Generate default required values...

let User = curry((data) => {
  return merge({
    id: UUID.v4(),
  }, data)
})

exports.User = User