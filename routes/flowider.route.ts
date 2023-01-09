import express from 'express';
const router = express.Router();

// validators
import { userValidate } from '../middlewares/user.validate';

// controllers
import { flowiderSignUp,
         flowiderSignIn,
         getAllFlowiders } from '../controllers/flowider.controller';

// get all users
router.route('/').get(getAllFlowiders);

// sign-up
router.route('/sign-up').post(userValidate, flowiderSignUp);

// sign-in
router.route('/sign-in').post(userValidate, flowiderSignIn);

module.exports = router;