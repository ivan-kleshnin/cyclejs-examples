let {curry} = require("ramda")

// always :: a -> b -> a
let always = curry((x, y) => x)

// strict behavior (we NEED this)
let isPlainObject = curry((value) => {
  return value && (value.constructor.prototype === Object.prototype)
})

// ported from (npm install flat) TODO refactor
let flattenObject = curry((target) => {
  let result = {}

  let step = function (object, prev) {
    Object.keys(object).forEach((key) => {
      let value = object[key]
      let newKey = prev ? prev + "." + key : key

      if (isPlainObject(value) && Object.keys(value).length) {
        return step(value, newKey)
      }

      result[newKey] = value
    })
  }

  step(target)

  return result
})

// ported from (npm install flat) TODO refactor
let unflattenObject = curry((target) => {
  let result = {}

  if (!isPlainObject(target)) {
    return target
  }

  let getkey = function (key) {
    let parsedKey = Number(key)
    return (isNaN(parsedKey) || key.indexOf('.') !== -1) ? key : parsedKey
  }

  Object.keys(target).forEach((key) => {
    let split = key.split(".")
    let key1 = getkey(split.shift())
    let key2 = getkey(split[0])
    let recipient = result

    while (key2 !== undefined) {
      let type = Object.prototype.toString.call(recipient[key1])

      if ((!isPlainObject(recipient[key1]))) {
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

exports.always = always
exports.isPlainObject = isPlainObject
exports.flattenObject = flattenObject
exports.unflattenObject = unflattenObject