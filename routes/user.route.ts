import express from 'express';
const router = express.Router();

// validators
import { userValidate } from '../middlewares/user.validate';

// controllers
import { signUp } from '../controllers/user.controller';

router.route('/get').get((req, res, next) => {
    res.send("It's ok!")
})

// sign-up
router.route('/sign-up').post(userValidate, signUp);

module.exports = router;