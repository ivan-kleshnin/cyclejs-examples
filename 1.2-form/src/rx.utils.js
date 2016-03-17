let {curry} = require("ramda")

// scanFn :: s -> (s -> s) -> s
let scanFn = curry((state, updateFn) => {
  if (typeof updateFn != "function" || updateFn.length != 1) {
    throw Error("updateFn must be a function with arity 1, got " + updateFn)
  } else {
    return updateFn(state)
  }
})

exports.scanFn = scanFn