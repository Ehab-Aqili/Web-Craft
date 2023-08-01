const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
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



app.listen(process.env.PORT, (req, res) => {
  console.log("http://127.0.0.1:8080");
});
