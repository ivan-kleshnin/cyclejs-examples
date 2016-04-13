let {merge} = require("ramda")
let UUID = require("node-uuid")
let {User} = require("./types")

let makeUser = (data) => {
  return User(merge({
    id: UUID.v4(),
  }, data))
}

exports.makeUser = makeUser