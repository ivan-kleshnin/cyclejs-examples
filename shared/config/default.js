// IMPORTS =========================================================================================
let Path = require("path");

// EVALS ===========================================================================================
let projectDir = Path.dirname(__dirname);
let staticDir = Path.join(projectDir, "static");

// CONFIG ==========================================================================================
export default {
  // HTTP
  "http-port": 80,
  "http-use-etag": true,

  // DIRS
  "project-dir": projectDir,
  "static-dir": staticDir,

  // SMTP
  "smtp-host": "localhost",
  "smtp-port": 25,

  // MAIL
  "mail-robot": "robot@localhost",
  "mail-support": "support@localhost",

  // HOSTS (redeclare in development env!)
  "production-ssh": "xxx@dgo",
  "production-host": "cyclejs-examples.xxx.com",
  "production-service": "cyclejs-examples.xxx.node.service",

  "staging-ssh": "yyy@dgo",
  "staging-host": "demo.cyclejs-examples.xxx.com",
  "staging-service": "demo.cyclejs-examples.xxx.node.service",
};
