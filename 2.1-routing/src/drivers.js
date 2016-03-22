let makeURLDriver = function () {
  return function (url) {
    url.subscribe((url) => {
      window.history.pushState(null, "", url) // no associated state, no title
    })
  }
}

exports.makeURLDriver = makeURLDriver