import express from "express";
const router = express.Router();

import {createDeskController,
        deleteDeskByIdController,
        getAllDesksNoAuthController,
        getDeskByIdController, 
        uploadDeskImagesController} from "../controllers/desk.controller";

// auth
import { flowiderAuth } from "../middlewares/flowider.auth";

// utils
import { upload } from "../utils/uploadImage";

/* NO AUTH: get all desk */
router.route("/all").get(getAllDesksNoAuthController);

/* AUTH */
// create new desk
router.route("/:place_id").post(flowiderAuth, createDeskController);

// upload desk images
router.route("/desk-img/:id").post(flowiderAuth, upload.array("image"), uploadDeskImagesController);

/* By ID */
// get
router.route("/:id").get(flowiderAuth, getDeskByIdController);
// delete
router.route("/:id").delete(flowiderAuth, deleteDeskByIdController);



module.exports = router;