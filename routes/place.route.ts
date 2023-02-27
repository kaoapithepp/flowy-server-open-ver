import express from "express";
const router = express.Router();

// controllers
import {    createPlaceController,
            deletePlaceByIdController,
            getAllBelongPlaceController, 
            getAllPlacesNoAuthController} from "../controllers/place.controller";

// protect
import { flowiderAuth } from "../middlewares/flowider.auth";

// create place
router.route("/").post(flowiderAuth, createPlaceController);

// get all belong place
router.route("/").get(flowiderAuth, getAllBelongPlaceController);

/* By ID */
// get
router.route("/:id").get(flowiderAuth, deletePlaceByIdController);
// delete
router.route("/:id").delete(flowiderAuth, deletePlaceByIdController);

/* NO AUTH: get all places */
router.route("/all").get(getAllPlacesNoAuthController);

module.exports = router;