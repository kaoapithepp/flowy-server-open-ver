import express from 'express';
const router = express.Router();

// validators
import { userValidate } from '../middlewares/user.validate';

// controllers
import { getAllUsers, signUp, signIn } from '../controllers/user.controller';

// get all users
router.route('/').get(getAllUsers);

// sign-up
router.route('/sign-up').post(userValidate, signUp);

// sign-in
router.route('/sign-in').post(signIn);

module.exports = router;