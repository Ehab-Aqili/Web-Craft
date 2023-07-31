const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  gender: String,
  phone: String,
  barth_date: String,
  location: String,
  friends: Object,
  posts: Object,
  comments: Object,
  likes: Object,
  token: String,
});


const User = mongoose.model("User", userSchema, "users");


module.exports = { User, Post };
