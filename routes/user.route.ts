import express from 'express';
const router = express.Router();

// validators
import { userValidate } from '../middlewares/user.validate';

// controllers
import { signUp, getAllUsers } from '../controllers/user.controller';

router.route('/get').get(getAllUsers);

// sign-up
router.route('/sign-up').post(userValidate, signUp);

// sign-in
router.route('/sign-in').post();

module.exports = router;