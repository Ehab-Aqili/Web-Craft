const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  gender: String,
  phone: String,
  birth_date: String,
  location: String,
  status: [
    {
      text: String,
      feeling: String,
      img: String,
      comment: Number,
      like: Number,
    },
  ],
  friends: [
    {
      username: String,
    },
  ],
  // token: String,
});
userSchema.methods.comPass = async (pass, passDB) => {
  return await bcrypt.compare(pass, passDB);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
