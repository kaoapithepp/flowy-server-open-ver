import multer from "multer";
import express from "express";
const router = express.Router();

import {    getAllAmenityBackdoor,
            getAllImagesBackdoor,
            getAllSpecBackdoor } from "../controllers/backdoor.controller";

import { createTimeSlotForAllDesksRoutine } from "../utils/timeslotUtils";

// utils
import { uploadImage } from "../utils/uploadImage";

const upload = multer({ storage: multer.memoryStorage() });

// get all amenities
router.route("/all-am").get(getAllAmenityBackdoor);

// get all amenities
router.route("/all-spec").get(getAllSpecBackdoor);

// get all images
router.route("/all-image").get(getAllImagesBackdoor);

// get all images
router.route("/gen-time-routine").get(createTimeSlotForAllDesksRoutine);

// test: upload images
router.route("/upload").post(upload.array("image"), uploadImage);

module.exports = router;