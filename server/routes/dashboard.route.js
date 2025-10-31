import express from 'express';
import { getDashboardInfo, totalReservations, totalStaffCount, getTotalBookingAmount, getRecentReservations, getRoomAvailabilityStats } from '../controllers/dashboard.info.controller.js';

const router = express.Router();

router.get('/info', getDashboardInfo);
router.get('/totalReservations', totalReservations);
router.get('/totalStaffCount', totalStaffCount);
router.get('/totalBookingAmount', getTotalBookingAmount);
router.get('/recentReservations', getRecentReservations);
router.get('/roomAvailabilityStats', getRoomAvailabilityStats);
router.get('/recentBookings', getRecentReservations);



export default router;

