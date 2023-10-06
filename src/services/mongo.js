const mongoose = require("mongoose");
const debug = require("debug")("nasa-api:services_mongo");

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Nasa_DB";

// ##### Another way for connection success or failure check #####
//   mongoose.connection.once("open", () => {
//     debug("MongoDB Connected!");
//   });
//   mongoose.connection.on("error", (err) => {
//     console.error(err);
//   });

const mongoConnect = async () => {
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
        debug(`ERROR :: ${err}`);
      }
    );
};

const mongoDisconnect = async()=>{
    await mongoose.disconnect()
}

module.exports = {
  mongoConnect,
  mongoDisconnect
};
