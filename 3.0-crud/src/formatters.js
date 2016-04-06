// Use Globalize or similar projects here to get locale-aware results (an overkill for many cases)

let formatString = function (value) {
  if (value === undefined || value === null) {
    return "";
  } else {
    return `${value}`;
  }
}

let formatInteger = function (value) {
  if (value === undefined || value === null) {
    return "";
  } else {
    return `${value}`;
  }
}

exports.formatString = formatString
exports.formatInteger = formatInteger