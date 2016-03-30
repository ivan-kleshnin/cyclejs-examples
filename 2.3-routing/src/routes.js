let Route = require("route-parser")
let {Home, About, Users, User, NotFound} = require("./pages")

module.exports = [
  [new Route("/"), Home],
  [new Route("/about"), About],
  [new Route("/users"), Users],
  [new Route("/users/:id"), User],
  [new Route("/*path"), NotFound],
]
