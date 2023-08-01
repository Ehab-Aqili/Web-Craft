const User = require("../model/Models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};

// signup user
exports.signupUser = async (req, res) => {
  const { email, username, password, location, birth_date, friends, status } =
    req.body;
  const encryptPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      username,
      email,
      password: encryptPassword,
      birth_date,
      location,
      status: [],
      friends: [],
    });

    //create a token
    // const token = createToken(user._id);

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "Not Match Email or Password" });
    } else {
      const matchPass = await user.comPass(password, user.password);
      if (matchPass) {
        //create a token
        const token = createToken(user._id);
        res.status(201).json({
          token,
          userId: user._id,
        });
      } else {
        res.status(409).json({ message: "Not Match Email or Password" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Post status
exports.postStatus = async (req, res) => {
  const postId = req.params.id;
  try {
    const Post = {
      text: req.body.text,
      feeling: req.body.feeling,
      img: req.body.img,
      comment: req.body.comment,
      like: req.body.like,
    };
    const newPost = await User.updateOne(
      { _id: postId },
      { $push: { status: Post } }
    );

    const message = "Add New Status";
    res.status(201).json({
      newPost,
      message: { message },
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};

// get all posts on home page
exports.getFeed = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  // console.log(user.posts[0].text)

  res.status(200).json({
    data: {
      status: user.status,
    },
  });
};

// search users

exports.search = async (req, res) => {
  try {
    // console.log((req.body.username).length)
    const searchUser = await req.body.searchUserName.trim();
    const regexPattern = new RegExp("^" + searchUser, "i");
    const users = await User.find({ username: regexPattern });
    res.send(users);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};

// Edit profile code
exports.editProfile = async (req, res) => {
  try {
    const { birth_date, username, location } = req.body;
    // const user = await User.find({"_id":req.params.id });
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        birth_date,
        username,
        location,
      },
      { new: true } // Set to true to return the updated document
    );
    res.status(200).json({
      updatedUser,
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};

// Add new Friends

exports.friendRequest = async (req, res) => {
  const postId = req.params.id;
  try {
    const friendRequest = {
      username: req.body.username,
    };
    const newPost = await User.updateOne(
      { _id: postId },

      { $push: { friends: friendRequest } }
    );

    const message = "Send request friend";
    res.status(201).json({
      newPost,
      message: { message },
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};

// get  profile  code

(exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user profile" });
  }
}),
  //  Protect Code
  (exports.protect = async (req, res, next) => {
    try {
      const testToken = req.headers.authorization;
      let token;
      if (testToken && testToken.startsWith("bearer")) {
        token = testToken.split(" ")[1];
      }
      if (!token) {
        res.status(401).json({
          message: "You are not Login",
        });
      }
      await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  });
