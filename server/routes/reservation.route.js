import express from 'express';
import { getAllReservations,getHotelReservations, getCancelledReservations, rejectCancellation, approveCancellation } from '../controllers/reservation.controller.js';
const router = express.Router();

router.get('/', getAllReservations);
router.get('/hotel', getHotelReservations);
router.get('/cancelled', getCancelledReservations);
router.post('/reject', rejectCancellation);
router.post('/approve', approveCancellation);

export default router;