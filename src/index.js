const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://0.0.0.0:27017/upload", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connection succesful"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(require("./routes"));

app.listen(3000);
