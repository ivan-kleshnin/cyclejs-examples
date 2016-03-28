let {assoc, curry, keys, props, range, reduce, values} = require("ramda")
let {Observable} = require("rx")
let {isPlainObject, flattenObject, unflattenObject} = require("./helpers")

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
    .shareReplay(1)
    .distinctUntilChanged()
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
    .shareReplay(1)
    .distinctUntilChanged()
})

exports.scanFn = scanFn
exports.inputReader = inputReader
exports.clickReader = clickReader
exports.store = store
exports.storeUnion = storeUnion