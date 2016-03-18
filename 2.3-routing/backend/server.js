import Http from "http";
import app from "./app";

// DEFAULTS ========================================================================================
process.env.HTTP_PORT = process.env.HTTP_PORT || 3000;

// SERVER ==========================================================================================
let server = Http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(process.env.HTTP_PORT);

// HELPERS =========================================================================================
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      console.log(process.env.HTTP_PORT + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(process.env.HTTP_PORT + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  console.log("Listening on port " + process.env.HTTP_PORT);
}
