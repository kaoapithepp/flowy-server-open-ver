import express from 'express';
const router = express.Router();

// validators
import { emailValidate } from '../middlewares/email.validate';

// controllers
import { signUp, signIn, getAllUsers } from '../controllers/user.controller';

// get all users
router.route('/').get(getAllUsers);

// sign-up
router.route('/sign-up').post(emailValidate, signUp);

// sign-in
router.route('/sign-in').post(emailValidate, signIn);

module.exports = router;