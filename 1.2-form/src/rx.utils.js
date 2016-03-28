let R = require("ramda")
let {curry} = require("ramda")

// scanFn :: s -> (s -> s) -> s
let scanFn = curry((state, updateFn) => {
  if (typeof updateFn != "function" || updateFn.length != 1) {
    throw Error("updateFn must be a function with arity 1, got " + updateFn)
  } else {
    return updateFn(state)
  }
})

// <this> --> String -> Observable
let pluck = function (path) {
  let lens = R.lensPath(path.split("."))
  return this.map((v) => R.view(lens, v))
}

// <this> --> String, (a -> (b -> c)) -> Observable
let overState = function (path, fn) {
  let lens = R.lensPath(path.split("."))
  return this.map((v) => (s) => R.over(lens, fn(v), s))
}

// <this> --> String, (a -> b) -> Observable
let setState = function (path, fn) {
  let lens = R.lensPath(path.split("."))
  return this.map((v) => (s) => R.set(lens, fn(v), s))
}

// <this> --> String -> Observable
let toState = function (path) {
  return this::setState(path, R.identity)
}

exports.scanFn = scanFn

exports.pluck = pluck
exports.overState = overState
exports.setState = setState
exports.toState = toState