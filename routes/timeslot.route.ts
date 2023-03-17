import express from "express";
const router = express.Router();

import { getAllTimeSlotByDeskId } from "../controllers/timeslot.controller";

// auth
import { flowiderAuth } from "../middlewares/flowider.auth";
import { userAuth } from "../middlewares/user.auth";

router.route("/:deskId").get(userAuth || flowiderAuth, getAllTimeSlotByDeskId);

module.exports = router;