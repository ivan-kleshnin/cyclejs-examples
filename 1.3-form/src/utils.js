let {assoc, curry, props, range, reduce} = require("ramda")
let flat = require("flat")
let {Observable} = require("rx")

// always :: a -> b -> a
let always = curry((x, y) => x)

// flattenObject :: {} -> {}
let flattenObject = curry((object) => {
  return flat(object, {safe: true})
})

// scanFn :: s -> (s -> s) -> s
let scanFn = curry((state, updateFn) => {
  if (typeof updateFn != "function" || updateFn.length != 1) {
    throw Error("updateFn must be a function with arity 1, got " + updateFn)
  } else {
    return updateFn(state)
  }
})

// store :: SelectedElement -> Observable String
let inputReader = curry((element) => {
  return element
    .events("input")
    .debounce(500)
    .map((event) => event.target.value)
    .map(value => value.trim()) // remove leading and trailing whitespace (sane default behavior)
    .startWith("")
    .share()
})

// store :: SelectedElement -> Observable Boolean
let clickReader = curry((element) => {
  return element
    .events("click")
    .throttle(500)
    .map((event) => true)
    .share()
})

// store :: s -> Observable (s -> s)
let store = curry((seed, update) => {
  return update
    .startWith(seed)
    .scan(scanFn)
    .shareReplay(1)
    .distinctUntilChanged()
})

// storeUnion :: [String] -> {Observable *} -> Observable {*}
let storeUnion = curry((keys, state) => { // naive one-level implementation
  return Observable.combineLatest(
    ...props(keys, state),
    (...args) => {
      return reduce((memo, i) => {
        return assoc(keys[i], args[i], memo)
      }, {}, range(0, keys.length))
    }
  )
    .shareReplay(1)
    .distinctUntilChanged()
})

exports.always = always
exports.flattenObject = flattenObject
exports.scanFn = scanFn
exports.inputReader = inputReader
exports.clickReader = clickReader
exports.store = store
exports.storeUnion = storeUnion