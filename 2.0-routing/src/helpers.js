let {curry} = require("ramda")

// always :: a -> b -> a
let always = curry((x, y) => x)

exports.always = always