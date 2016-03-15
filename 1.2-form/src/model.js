let UUID = require("node-uuid")
let {merge} = require("ramda")

// makeUser :: {*} -> {*}
let makeUser = function (data) {
  return merge({id: UUID.v4()}, data)
}

exports.makeUser = makeUser