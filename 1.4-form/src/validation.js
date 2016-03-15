let {curry} = require("ramda")

/**
 *  Validations should probably have async API to support backend-aware validations
 */

// validateRegex :: RegExp -> String -> String -> Promise (String | Null)
let validateRegex = curry((regex, errorMessage, value) => {
  return new Promise((resolve, reject) => {
    if (regex.test(value)) {
      resolve(null)
    } else {
      resolve(errorMessage)
    }
  })
})

exports.validateRegex = validateRegex