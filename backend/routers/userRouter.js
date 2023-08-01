const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();


router.route("/signup").post(userController.signupUser);
router.route("/login").post(userController.loginUser);

router.route("/create-post/:id").patch(userController.postStatus);
router.route("/feed/:id").get(userController.getFeed);

router.route("/search").get(userController.search);
router.route("/edit-user/:id").patch(userController.editProfile);


router.route("/add-friend/:id").patch(userController.friendRequest);
router.route("/profile/:id").get(userController.getUserProfile);




module.exports = router;