import express from "express";
const router = express.Router();

import { getAllTimeSlotByDeskId } from "../controllers/timeslot.controller";

// auth
import { flowiderAuth } from "../middlewares/flowider.auth";

router.route("/:deskId").get(flowiderAuth, getAllTimeSlotByDeskId);

module.exports = router;