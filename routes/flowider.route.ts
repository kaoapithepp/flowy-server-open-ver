import express from "express";
const router = express.Router();

import {
    registerFlowiderController,
    getAllFlowiderController, 
    loginFlowiderController,
    getFlowiderByIdController, 
    uploadProfileImageFlowiderController} from "../controllers/flowider.controller";

import { flowiderAuth } from "../middlewares/flowider.auth";

import { upload } from "../utils/uploadImage";

// registration
router.route("/").post(registerFlowiderController);

// log in
router.route("/login").post(loginFlowiderController);

/* NO AUTH: get all users */
router.route("/all").get(getAllFlowiderController);

/* AUTH */
// upload profile images
router.route("/profile-img/:id").put(flowiderAuth, upload.array("image"), uploadProfileImageFlowiderController);

// get user by user's id
router.route("/").get(flowiderAuth, getFlowiderByIdController);


module.exports = router;