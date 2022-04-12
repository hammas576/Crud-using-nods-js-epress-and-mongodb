require("dotenv").config();

const express = require("express");
const app = express();

const mongo = require("mongoose");
mongo.connect(process.env.DATABASE_URL);
const db = mongo.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => {
  console.log("connected to database");
});

app.use(express.json());

const subscribersrouter = require("./routes/subscribers");
app.use("/subscribers", subscribersrouter);

app.listen(3000, () => {
  console.log("server has started");
});
