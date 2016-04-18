let R = require("ramda")
let {assoc, curry, identity, is, keys, map, not, range, reduce, split, values} = require("ramda")
let V = require("tcomb-validation")
let {Observable} = require("rx")
let {always, fst, snd, flattenObject, unflattenObject} = require("./helpers")

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

// storeUnion :: {Observable *} -> Observable {*}
let storeUnion = curry((state) => {
  let flatState = flattenObject(state)
  let names = keys(flatState)
  return Observable.combineLatest(
    ...values(flatState),
    (...args) => {
      return unflattenObject(reduce((memo, i) => {
        return assoc(names[i], args[i], memo)
      }, {}, range(0, names.length)))
    }
  )
    .distinctUntilChanged()
    .shareReplay(1)
})

// derive :: (* -> a) -> [Observable *] -> Observable a
let derive = curry((deriveFn, os) => {
  return Observable.combineLatest(...os, deriveFn).distinctUntilChanged().shareReplay(1)
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

// swapState :: (Observable a ->) String, (a -> b) -> Observable a
let swapState = function (path, fn) {
  let lens = R.lensPath(split(".", path))
  return this.map((_) => (s) => R.over(lens, fn, s))
}

// toState :: (Observable a ->) String -> Observable a
let toState = function (path) {
  return this::setState(path, identity)
}

// validate :: (Observable a ->) Type -> Observable (String | null)
let validate = function (type) {
  return this
    .debounce(500)
    .map((val) => V.validate(val, type).firstError())
    .map((e) => e && e.message || null)
    .distinctUntilChanged()
    .shareReplay(1)
}

// samplePluck :: (Observable a ->) String -> Observable b
let samplePluck = function (path) {
  return this.sample(this::pluck(path))
}

// sampleView :: (Observable a ->) String -> Observable b
let sampleView = function (path) {
  return this.sample(this::view(path))
}

// filterBy :: (Observable a ->) Observable Boolean -> Observable a
let filterBy = function (o) {
  return this.withLatestFrom(o).filter(snd).map(fst)
}

// rejectBy :: (Observable a ->) Observable Boolean -> Observable a
let rejectBy = function (o) {
  return this::filterBy(o.map(not))
}

exports.scanFn = scanFn

exports.pluck = pluck
exports.pluckN = pluckN

exports.store = store
exports.storeUnion = storeUnion
exports.derive = derive

exports.view = view
exports.viewN = viewN
exports.overState = overState
exports.setState = setState
exports.swapState = swapState
exports.toState = toState

exports.validate = validate

exports.samplePluck = samplePluck
exports.sampleView = sampleView

exports.filterBy = filterBy
exports.rejectBy = rejectBy