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

// <this> --> String -> Observable
let lensView = function (path) {
  let lens = R.lensPath(path.split("."))
  return this.map((v) => (s) => R.view(lens, s))
}

// <this> --> String, (a -> (b -> c)) -> Observable
let lensOver = function (path, fn) {
  let lens = R.lensPath(path.split("."))
  return this.map((v) => (s) => R.over(lens, fn(v), s))
}

// <this> --> String, (a -> b) -> Observable
let lensSet = function (path, fn) {
  let lens = R.lensPath(path.split("."))
  return this.map((v) => (s) => R.set(lens, fn(v), s))
}

// <this> --> String -> Observable
let lensTo = function (path) {
  return this::lensSet(path, R.identity)
}

// store :: SelectedElement -> Observable String
let inputReader = curry((element) => {
  return element
    .events("input")
    .map((event) => event.target.value)
    .map(value => value.trim()) // cut extra whitespace (most often required)
    .share()
})

// store :: SelectedElement -> Observable Boolean
let clickReader = curry((element) => {
  return element
    .events("click")
    .map((event) => true)
    .share()
})

// store :: s -> Observable (s -> s)
let store = curry((seed, update) => {
  return update
    .startWith(seed)
    .scan(scanFn)
    .distinctUntilChanged()
    .shareReplay(1)
})

exports.scanFn = scanFn

exports.pluck = pluck
exports.lensView = lensView
exports.lensOver = lensOver
exports.lensSet = lensSet
exports.lensTo = lensTo

exports.inputReader = inputReader
exports.clickReader = clickReader
exports.store = store