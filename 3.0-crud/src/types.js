let T = require("tcomb")

let Id = T.subtype(T.String, (s) => {
  return /^\d+$/.test(s)
}, "Id")

let Username = T.subtype(T.String, (s) => {
  return /^\w{2,10}$/.test(s)
}, "Username")

let Email = T.subtype(T.String, (s) => {
  return /^(.+)@(.+){2,}\.(.+){2,}$/.test(s)
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