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

let isPlainObject = curry((value) => {
  return value && value.constructor.prototype === Object.prototype
})

let flattenObject = curry((target) => {
  let result = {}

  function step(object, prev) {
    Object.keys(object).forEach((key) => {
      let value = object[key]
      let newKey = prev ? prev + `.` + key : key

      if (isPlainObject(value) && Object.keys(value).length) {
        return step(value, newKey)
      }

      result[newKey] = value
    })
  }

  step(target)

  return result
})

let unflattenObject = curry((target) => {
  let result = {}

  if (!isPlainObject(target)) {
    return target
  }

  function getkey(key) {
    let parsedKey = Number(key)
    return isNaN(parsedKey) || key.indexOf(`.`) !== -1 ? key : parsedKey
  }

  Object.keys(target).forEach((key) => {
    let split = key.split(`.`)
    let key1 = getkey(split.shift())
    let key2 = getkey(split[0])
    let recipient = result

    while (typeof key2 !== `undefined`) {
      if (!isPlainObject(recipient[key1])) {
        recipient[key1] = {}
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    recipient[key1] = unflattenObject(target[key])
  })

  return result
})

let withPrefix = curry((s, st) => {
  if (st.startsWith(s)) { return st }
  else                  { return s + st }
})

let withSuffix = curry((s, st) => {
  if (st.endsWith(s)) { return st }
  else                { return st + s }
})

exports.always = always

exports.fst = fst
exports.snd = snd
exports.adjustBy = adjustBy
exports.updateBy = updateBy
exports.swap = swap

exports.lens = lens

exports.randomInt = randomInt
exports.pickRandom = pickRandom
exports.shuffle = shuffle

exports.isPlainObject = isPlainObject
exports.flattenObject = flattenObject
exports.unflattenObject = unflattenObject

exports.withPrefix = withPrefix
exports.withSuffix = withSuffix
