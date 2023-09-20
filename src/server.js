require("dotenv").config();
const http = require("http");
const debug = require("debug")("nasa-express-api:server");
const mongoose = require("mongoose");

const app = require("./app");

const port = normalizePort(process.env.PORT || "8000");
const mongoUrl = normalizePort(
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017"
);

const server = http.createServer(app);

async function startServer() {
  // ##### Another way for connection success or failure check #####
  //   mongoose.connection.once("open", () => {
  //     console.log("MongoDB Connected!");
  //   });
  //   mongoose.connection.on("error", (err) => {
  //     console.error(err);
  //   });
  await mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
        debug("MongoDB Connected!");
      },
      (err) => {
        /** handle initial connection error */
        console.log("ERROR :: ", err);
      }
    );
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
}

startServer();

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
