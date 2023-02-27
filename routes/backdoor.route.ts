import express from "express";
const router = express.Router();

import {    getAllAmenityBackdoor,
            getAllSpecBackdoor } from "../controllers/backdoor.controller";

// get all amenities
router.route("/all-am").get(getAllAmenityBackdoor);

// get all amenities
router.route("/all-spec").get(getAllSpecBackdoor);

module.exports = router;