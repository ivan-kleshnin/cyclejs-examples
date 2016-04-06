// Use Globalize or similar projects here to get locale-aware results (an overkill for many cases)

let parseString = function (value) {
  value = value.trim();
  if (value == "") {
    return null;
  } else {
    return value;
  }
}

let parseInteger = function (value) {
  value = value.trim();
  if (value == "") {
    return null;
  } else {
    if (/^-?\d+$/.test(value)) {
      return Number(value);
    } else {
      return value;
    }
  }
}

exports.parseString = parseString
exports.parseInteger = parseInteger