import express from 'express';
import {getUserProfileDetails,editUserProfileDetails } from '../controllers/user.profile.controller.js';

const router = express.Router();

router.get('/profile', getUserProfileDetails);
router.put('/profile', editUserProfileDetails);

export default router;
