let makeURLDriver = function () {
  return function (url) {
    url.subscribe((url) => {
      window.history.pushState(null, "", url) // no associated state, no title
    })
  }
}

let makeConsoleDriver = function () {
  return function (message) {
    message.subscribe((msg) => {
      console.log(msg)
    })
  }
}

exports.makeURLDriver = makeURLDriver
exports.makeConsoleDriver = makeConsoleDriver