let T = require("tcomb")

let Id = T.subtype(T.String, (x) => {
  return /^\d+$/.test(x)
}, "Id")

let Username = T.subtype(T.String, (x) => {
  return /^\w{2,10}$/.test(x)
}, "Username")

let Email = T.subtype(T.String, (x) => {
  return /^(.+)@(.+){2,}\.(.+){2,}$/.test(x)
}, "Email")

let User = T.struct({
  id: Id,
  username: Username,        // required (create & edit)
  email: Email,              // required (create & edit)
  points: T.Number,          // required (edit)
  bonus: T.maybe(T.Number),  // optional
}, "User")

let UserEdit = T.struct({
  points: T.Number,
  bonus: T.maybe(T.Number),
}, "UserEdit")

exports.Id = Id
exports.Username = Username
exports.Email = Email
exports.User = User
exports.UserEdit = UserEdit