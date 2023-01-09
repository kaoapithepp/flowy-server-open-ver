import express from 'express';
const router = express.Router();

// validators
import { emailValidate } from '../middlewares/email.validate';

// controllers
import { flowiderSignUp,
         flowiderSignIn,
         getAllFlowiders } from '../controllers/flowider.controller';

// get all users
router.route('/').get(getAllFlowiders);

// sign-up
router.route('/sign-up').post(emailValidate, flowiderSignUp);

// sign-in
router.route('/sign-in').post(emailValidate, flowiderSignIn);

module.exports = router;