let Express = require("express");

let router = Express.Router();

router.get("/", function(req, res, next) {
  return res.render("home.html");
});

router.get("/examples/:name", function(req, res, next) {
  let appName = req.params.name;
  let appTitle = appName; // TODO
  return res.render("example.html", {appName, appTitle});
}); // TODO frontend routing, splat ?!

export default router;

