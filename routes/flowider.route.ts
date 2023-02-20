import express from "express";
const router = express.Router();

import {
    registerFlowiderController,
    getAllFlowiderController, 
    loginFlowiderController,
    getFlowiderByIdController } from "../controllers/flowider.controller";

import { flowiderAuth } from "../middlewares/flowider.auth";

// registration
router.route("/").post(registerFlowiderController);

// log in
router.route("/login").post(loginFlowiderController);

// get all users
router.route("/all").get(getAllFlowiderController);

// get user by user's id
router.route("/").get(flowiderAuth, getFlowiderByIdController);


module.exports = router;