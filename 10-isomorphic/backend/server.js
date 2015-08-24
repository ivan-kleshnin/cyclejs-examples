import Express from "express";
import app from "./app";

// SERVER ==========================================================================================
let server = Express();
server.use(app);
server.listen(3000);
