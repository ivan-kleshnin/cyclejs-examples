let R = require("ramda")
let {curry, map, split} = require("ramda")
let {Observable} = require("rx")

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

// <this> --> [String], [String], (s -> a) -> Observable
let derive = function (sourcePaths, targetPath, deriveFn) {
  let sourceLenses = map((path) => R.lensPath(split(".", path)), sourcePaths)
  let targetLens = R.lensPath(split(".", targetPath))
  let sourceStreams = map((lens) => {
    return this.map((state) => R.view(lens, state)).distinctUntilChanged()
  }, sourceLenses)
  let targetStream = Observable.combineLatest(...sourceStreams, (...args) => {
    return deriveFn(...args)
  }).distinctUntilChanged()
  return this.combineLatest(targetStream, (state, stateFragment) => {
    return R.set(targetLens, stateFragment, state)
  })
    .distinctUntilChanged()
    .shareReplay(1)
    .debounce(1) // suppress glitches (tradeoff: squash sync updates)
}

// <this> --> String, (s -> a) -> Observable
let deriveAll = function (path, deriveFn) {
  let lens = R.lensPath(path.split("."))
  return this.map((state) => {
    let stateFragment = deriveFn(state)
    return R.set(lens, stateFragment, state)
  })
    .distinctUntilChanged()
    .shareReplay(1)
    .debounce(1) // suppress glitches (tradeoff: squash sync updates)
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
exports.overState = overState
exports.setState = setState
exports.toState = toState
exports.derive = derive
exports.deriveAll = deriveAll

exports.inputReader = inputReader
exports.clickReader = clickReader
exports.store = store