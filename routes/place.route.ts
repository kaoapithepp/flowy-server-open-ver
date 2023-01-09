import express from 'express';
const router = express.Router();

// validators
import protect from '../middlewares/flowider.authorization';

// controllers
import { getAllPlace,
         getPlaceById,
         createPlace } from '../controllers/place.controller';

// get all places
router.route('/').get(protect, getAllPlace);

// get place by id
router.route('/:id').get(protect, getPlaceById);

// create place
router.route('/create').post(protect, createPlace);

module.exports = router;