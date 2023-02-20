import express from "express";
const router = express.Router();

import {
    registerUserController,
    getAllUserController, 
    loginUserController } from "../controllers/user.controller";

// registration
router.route("/").post(registerUserController);

router.route("/login").post(loginUserController);

// get all users
router.route("/").get(getAllUserController);


module.exports = router;