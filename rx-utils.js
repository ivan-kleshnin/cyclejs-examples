let V = require("tcomb-validation")

// ($ a ->) Type -> $ (String | null)
let validate = function (type) {
  return this
    .debounce(500)
    .map((val) => V.validate(val, type).firstError())
    .map((e) => e && e.message || null)
    .distinctUntilChanged()
    .shareReplay(1)
}

exports.validate = validate
