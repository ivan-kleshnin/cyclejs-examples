let R = require("ramda")
let {curry, is, map, split} = require("ramda")
let V = require("tcomb-validation")
let {Observable} = require("rx")
let {always} = require("./helpers")

// scanFn :: s -> (s -> s) -> s
let scanFn = curry((state, updateFn) => {
  if (!is(Function, updateFn) || updateFn.length != 1) {
    throw Error("updateFn must be a function with arity 1, got " + updateFn)
  } else {
    return updateFn(state)
  }
})

// pluck :: (Observable a ->) String -> Observable b
let pluck = function (path) {
  let lens = R.lensPath(split(".", path))
  return this.map((v) => R.view(lens, v)).share()
}

// pluckN :: (Observable a ->) [String] -> Observable b
let pluckN = function (paths) {
  let lenses = map(R.lensPath, map(split("."), paths))
  return this.map((v) => map((lens) => R.view(lens, v), lenses)).share()
}

// store :: s -> Observable (s -> s) -> Observable s
let store = curry((seed, update) => {
  return update
    .startWith(seed)
    .scan(scanFn)
    .distinctUntilChanged()
    .shareReplay(1)
})

// view :: (Observable a ->) String -> Observable b
let view = function (path) {
  let lens = R.lensPath(split(".", path))
  return this
    .map((v) => R.view(lens, v))
    .distinctUntilChanged()
    .shareReplay(1)
}

// viewN :: (Observable a ->) [String] -> Observable b
let viewN = function (paths) {
  let lenses = map(R.lensPath, map(split("."), paths))
  return this
    .map((v) => map((lens) => R.view(lens, v), lenses))
    .distinctUntilChanged()
    .shareReplay(1)
}

// overState :: (Observable a ->) String, (a -> (b -> c)) -> Observable c
let overState = function (path, fn) {
  let lens = R.lensPath(split(".", path))
  return this.map((v) => (s) => R.over(lens, fn(v), s))
}

// setState :: (Observable a ->) String, (a -> b) -> Observable b
let setState = function (path, fn) {
  let lens = R.lensPath(split(".", path))
  return this.map((v) => (s) => R.set(lens, fn(v), s))
}

// toState :: (Observable a ->) String -> Observable a
let toState = function (path) {
  return this::setState(path, R.identity)
}

// validateToState :: (Observable a ->) String, Type -> Observable (String | null)
let validateToState = function (path, type) {
  return this
    .debounce(500)
    .map((v) => V.validate(v, type).firstError())
    .map((e) => e && e.message || null)
    ::toState(path)
}

// samplePluck :: (Observable a ->) String -> Observable b
let samplePluck = function (path) {
  return this.sample(this::pluck(path))
}

// sampleView :: (Observable a ->) String -> Observable b
let sampleView = function (path) {
  return this.sample(this::view(path))
}

// derive :: [Observable *] -> (* -> Observable a) -> Observable a
let derive = function (os, deriveFn) {
  return Observable.combineLatest(...os, deriveFn).distinctUntilChanged().shareReplay(1)
}

exports.scanFn = scanFn

exports.pluck = pluck
exports.pluckN = pluckN

exports.store = store

exports.view = view
exports.viewN = viewN
exports.overState = overState
exports.setState = setState
exports.toState = toState

exports.validateToState = validateToState

exports.samplePluck = samplePluck
exports.sampleView = sampleView

exports.derive = derive
