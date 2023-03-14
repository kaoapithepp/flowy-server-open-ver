import express from "express";
const router = express.Router();

// controllers
import { cancelPayByBookingIdController,
        createBookingOrderController,
        retreiveBookingDetailAfterCompletedByIdController,
        getBookingDetailByUserIdController,
        initPayByBookingIdController, 
        getEachBookingDetailByIdController} from "../controllers/booking.controller";

// auth
import { userAuth } from "../middlewares/user.auth";

// create booking
router.route("/").post(userAuth, createBookingOrderController);

// get booking history by userId
router.route("/").get(userAuth, getBookingDetailByUserIdController);

// get a booking order by bookId
router.route("/:id").get(userAuth, getEachBookingDetailByIdController)

// initPay by id
router.route("/init/:id").post(userAuth, initPayByBookingIdController);

// confirm booking and get booking detail after completed
router.route("/confirm/:id").put(userAuth, retreiveBookingDetailAfterCompletedByIdController);

// update payment status to canceled
router.route("/cancel/:id").put(userAuth, cancelPayByBookingIdController);


module.exports = router;