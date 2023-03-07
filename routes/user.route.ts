import express from "express";
const router = express.Router();

import {
    registerUserController,
    getAllUserController, 
    loginUserController,
    getUserByIdController, 
    uploadProfileImageUserController} from "../controllers/user.controller";

import { userAuth } from "../middlewares/user.auth";

import { upload } from "../utils/uploadImage";

// registration
router.route("/").post(registerUserController);

// log in
router.route("/login").post(loginUserController);

// upload profile images
router.route("/profile-img/:id").put(userAuth, upload.array("image"), uploadProfileImageUserController);

// get all users
router.route("/all").get(getAllUserController);

// get user by user's id
router.route("/").get(userAuth, getUserByIdController);


module.exports = router;