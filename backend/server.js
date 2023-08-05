const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const Routes = require("./routers/userRouter");
dotenv.config({ path: "./.env" });

mongoose
  .connect(process.env.CONN_STR, {
    UseNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    // console.log(conn)
    console.log("DB connected");
  });


app.use(cors());
app.use(express.json());
app.use("/user", Routes);

// Increase payload size limit to 50MB
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));



app.listen(process.env.PORT, (req, res) => {
  console.log("http://127.0.0.1:8080");
});
