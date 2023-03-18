import express from "express";
const router = express.Router();

import { getAllTimeSlotByDeskId } from "../controllers/timeslot.controller";

// auth
import { flowiderAuth } from "../middlewares/flowider.auth";
import { userAuth } from "../middlewares/user.auth";

router.route("/:deskId").get(userAuth, getAllTimeSlotByDeskId);
router.route("/f/:deskId").get(flowiderAuth, getAllTimeSlotByDeskId);

module.exports = router;