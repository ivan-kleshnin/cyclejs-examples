import Path from "path";
import Express from "express";
import {renderHtml, render404, render500} from "./renders";
import DB from "./db";

// CONSTANTS =======================================================================================
const PROJECT_DIR = Path.dirname(__dirname);
const PUBLIC_DIR = Path.join(PROJECT_DIR, "public");

// APP =============================================================================================
function main(req, res, cb) {
  if (req.path.startsWith("/public/")) {
    return cb();
  } else if (req.path.startsWith("/api/")) {
    return cb();
  } else {
    let globals = {
      url: req.url,
      robots: DB,
    };
    let html = renderHtml(globals);
    res.write("<!doctype html>");
    res.write(html);
    res.end();
  }
}

let staticRouter = Express.static(PUBLIC_DIR, {etag: false});
let app = Express();

app.use("/public", staticRouter);
app.use("/", main);

app.use((req, res) => {
  res.status(404).send(render404(req.url));
});

app.use((err, req, res) => {
  console.log(err.stack);
  res.status(err.status || 500);
  res.send(render500({
    message: err.message,
    error: (app.get("env") == "development") ? err : {}
  }));
});

export default app;
