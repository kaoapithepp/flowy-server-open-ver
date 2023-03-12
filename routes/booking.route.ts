import express from "express";
const router = express.Router();

// controllers
import { cancelPayByBookingIdController,
        createBookingOrderController,
        initPayByBookingIdController } from "../controllers/booking.controller";

// auth
import { userAuth } from "../middlewares/user.auth";

// create booking
router.route("/").post(userAuth, createBookingOrderController);

// initPay by id
router.route("/:id").post(userAuth, initPayByBookingIdController);

// update payment status to canceled
router.route("/:id").put(userAuth, cancelPayByBookingIdController);


module.exports = router;