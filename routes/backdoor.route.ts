import multer from "multer";
import express from "express";
const router = express.Router();

import {    getAllAmenityBackdoor,
            getAllSpecBackdoor } from "../controllers/backdoor.controller";

// utils
import { uploadImage } from "../utils/uploadImage";
import { paymentIntent } from "../utils/stripePayment";

const upload = multer({ storage: multer.memoryStorage() });

// get all amenities
router.route("/all-am").get(getAllAmenityBackdoor);

// get all amenities
router.route("/all-spec").get(getAllSpecBackdoor);

// test: upload images
router.route("/upload").post(upload.array("image"), uploadImage);

// test: strip payment
router.route("/stripe-test").post(paymentIntent);

module.exports = router;