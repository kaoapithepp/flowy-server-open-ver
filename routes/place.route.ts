import express from "express";
const router = express.Router();

// controllers
import {createPlaceController,
        deletePlaceByIdController,
        getAllBelongPlaceController, 
        getAllPlacesNoAuthController,
        getAmenitiesByIdController,
        getPlaceByIdController,
        getSpecsByIdController,
        updateAmenitiesByIdController,
        updatePlaceByIdController,
        updateSpecsByIdController,
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

// upload place images
router.route("/place-img/f/:id").post(flowiderAuth, upload.array("image"), uploadPlaceImagesController);


/* Place By ID */
// get
router.route("/:id").get(userAuth, getPlaceByIdController);
router.route("/f/:id").get(flowiderAuth, getPlaceByIdController);
// update
router.route("/f/:id").put(flowiderAuth, updatePlaceByIdController);
// delete
router.route("/f/:id").delete(flowiderAuth, deletePlaceByIdController);

/* Spec By ID */
// get
router.route("/f/specs/:id").get(flowiderAuth, getSpecsByIdController);
// update
router.route("/f/specs/:id").put(flowiderAuth, updateSpecsByIdController);

/* Amenity By ID */
// get
router.route("/f/amenities/:id").get(flowiderAuth, getAmenitiesByIdController);
// update
router.route("/f/amenities/:id").put(flowiderAuth, updateAmenitiesByIdController);



module.exports = router;