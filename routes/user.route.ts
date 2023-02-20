import express from "express";
const router = express.Router();

import {
    registerUserController,
    getAllUserController, 
    loginUserController,
    getUserByIdController } from "../controllers/user.controller";

import { userAuth } from "../middlewares/user.auth";

// registration
router.route("/").post(registerUserController);

// log in
router.route("/login").post(loginUserController);

// get all users
router.route("/all").get(getAllUserController);

// get user by user's id
router.route("/").get(userAuth, getUserByIdController);


module.exports = router;