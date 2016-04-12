let R = require("ramda")
let {curry, pipe, split, update} = require("ramda")

let fst = (xs) => xs[0]

let snd = (xs) => xs[1]

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

let swap = curry((i1, i2, array) => {
  let v1 = array[i1]
  let v2 = array[i2]
  return pipe(
    update(i1, v2),
    update(i2, v1)
  )(array)
})

let randomInt = curry((min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
})

let pickRandom = curry((array) => {
  return array[randomInt(0, array.length)]
})

let shuffle = curry((array) => {
  let counter = array.length
  while (counter > 0) {
    let index = randomInt(0, counter)
    counter -= 1
    array = swap(index, counter, array)
  }
  return array
})

exports.fst = fst
exports.snd = snd

exports.always = always
exports.lens = lens

exports.adjustBy = adjustBy
exports.updateBy = updateBy

exports.swap = swap

exports.randomInt = randomInt
exports.pickRandom = pickRandom

exports.shuffle = shuffle
