import express from "express";
const router = express.Router();

import {createDeskController,
        deleteDeskByIdController,
        getAllDesksNoAuthController,
        getDeskByIdController } from "../controllers/desk.controller";

// auth
import { flowiderAuth } from "../middlewares/flowider.auth";

// create new desk
router.route("/:place_id").post(flowiderAuth, createDeskController);


/* NO AUTH: get all desk */
router.route("/all").get(getAllDesksNoAuthController);

/* By ID */
// get
router.route("/:id").get(flowiderAuth, getDeskByIdController);
// delete
router.route("/:id").delete(flowiderAuth, deleteDeskByIdController);



module.exports = router;