import mongoose from "mongoose";

let connectionString = global.config?.db_protocol;
if (global.config?.db_user && global.config?.db_pass) {
  connectionString += `${global.config.db_user}:${global.config.db_pass}@`;
}
connectionString += `${global.config?.db_host}/${global.config?.db_name}?retryWrites=true&w=majority`;

// DB Connection
const connectDb = async () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, res) {
        if (err) {
          console.log("Couldn't connect to database", err.code, err.input);
          reject(err);
        } else {
          resolve(res.connections[0]);
        }
      }
    );
  });
};

export { connectDb };
