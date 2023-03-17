import express from "express";
const router = express.Router();

// controllers
import {createPlaceController,
        deletePlaceByIdController,
        getAllBelongPlaceController, 
        getAllPlacesNoAuthController,
        getPlaceByIdController,
        uploadPlaceImagesController} from "../controllers/place.controller";

// protect
import { flowiderAuth } from "../middlewares/flowider.auth";
import { userAuth } from "../middlewares/user.auth";

import { upload } from "../utils/uploadImage";

/* NO AUTH: get all places */
router.route("/all").get(getAllPlacesNoAuthController);

/* AUTH */
// create place
router.route("/").post(flowiderAuth, createPlaceController);

// get all belong place
router.route("/").get(flowiderAuth, getAllBelongPlaceController);

// upload profile images
router.route("/place-img/:id").post(flowiderAuth, upload.array("image"), uploadPlaceImagesController);


/* By ID */
// get
router.route("/:id").get(userAuth || flowiderAuth, getPlaceByIdController);
// delete
router.route("/:id").delete(flowiderAuth, deletePlaceByIdController);



module.exports = router;