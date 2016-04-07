let Tc = require("tcomb")

let Uid = Tc.subtype(Tc.String, (x) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(x)
}, "Uid")

let Username = Tc.subtype(Tc.String, (x) => {
  return /^\w{2,10}$/.test(x)
}, "Username")

let Email = Tc.subtype(Tc.String, (x) => {
  return /^(.+)@(.+){2,}\.(.+){2,}$/.test(x)
}, "Email")

let User = Tc.struct({
  id: Uid,
  username: Username,
  email: Email,
}, "User")

exports.Uid = Uid
exports.Username = Username
exports.Email = Email
exports.User = User