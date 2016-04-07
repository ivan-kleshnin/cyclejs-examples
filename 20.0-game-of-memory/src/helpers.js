let R = require("ramda")
let {curry, split} = require("ramda")

// always :: a -> b -> a
let always = curry((x, y) => x)

// lens :: String -> Lens
let lens = curry((path) => {
  return R.lensPath(split(".", path))
})

// updateBy :: (a -> Boolean) -> a -> [a] -> [a]
let updateBy = curry((pred, val, array) => {
  let i = findIndex(pred, array);
  if (i >= 0) {
    return update(i, val, array);
  } else {
    return array;
  }
})

// adjustBy :: (a -> Boolean) -> (a -> b) -> [a] -> [a]
let adjustBy = curry((pred, adjustFn, array) => {
  let i = findIndex(pred, array);
  if (i >= 0) {
    return adjust(adjustFn, i, array);
  } else {
    return array;
  }
})

exports.always = always
exports.lens = lens
exports.updateBy = updateBy
exports.adjustBy = adjustBy

