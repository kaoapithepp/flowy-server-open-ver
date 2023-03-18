import express from "express";
const router = express.Router();

import {createDeskController,
        removeDeskByIdController,
        deleteDeskImagesController,
        getAllDesksByPlaceIdController,
        getAllDesksNoAuthController,
        getDeskByIdController, 
        editDeskByIdController, 
        updateDeskImagesController, 
        uploadDeskImagesController} from "../controllers/desk.controller";

// auth
import { flowiderAuth } from "../middlewares/flowider.auth";
import { userAuth } from "../middlewares/user.auth";

// utils
import { upload } from "../utils/uploadImage";

/* NO AUTH: get all desk */
router.route("/all").get(getAllDesksNoAuthController);

/* AUTH */
// create new desk
router.route("/f/:place_id").post(flowiderAuth, createDeskController);

// desk images
router.route("/desk-img/f/:id").post(flowiderAuth, upload.array("image"), uploadDeskImagesController);
router.route("/desk-img/f/:id").put(flowiderAuth, upload.array("image"), updateDeskImagesController);
router.route("/desk-img/f/:id").delete(flowiderAuth, deleteDeskImagesController);

/* By ID */
// get each desk
router.route("/f/:id").get(flowiderAuth, getDeskByIdController);

// update each desk
router.route("/f/:id").put(flowiderAuth, editDeskByIdController);

// delete
router.route("/f/:id").delete(flowiderAuth, removeDeskByIdController);

// get all desks by placeId
router.route("/by-place/:placeId").get(userAuth, getAllDesksByPlaceIdController);
router.route("/by-place/f/:placeId").get(flowiderAuth, getAllDesksByPlaceIdController);



module.exports = router;