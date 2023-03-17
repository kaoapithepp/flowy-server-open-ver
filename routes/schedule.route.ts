import express from "express";
const router = express.Router();

// controllers
import { getAllScheduleByPlaceIdController } from "../controllers/schedule.controller";

import { flowiderAuth } from "../middlewares/flowider.auth";


router.route("/:placeId").get(flowiderAuth, getAllScheduleByPlaceIdController);

module.exports = router;