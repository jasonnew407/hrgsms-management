import express from 'express';
import { getAllStaffMembers, addStaffMember, deleteStaffMember, updateStaffMember,  } from '../controllers/staff.controller.js';

const router = express.Router();

router.get('/getAll', getAllStaffMembers);
router.post('/add', addStaffMember);
router.delete('/delete/:id', deleteStaffMember);
router.put('/update/:id', updateStaffMember);

export default router;