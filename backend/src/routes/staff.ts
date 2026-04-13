import express from 'express';
import {
  loginStaff,
  getStaffProfile,
  updateStaffProfile,
  addStaff,
  bulkAddStaff,
} from '../controllers/staffController';

const router = express.Router();

router.post('/login', loginStaff);
router.get('/:staffId', getStaffProfile);
router.put('/:staffId', updateStaffProfile);
router.post('/add', addStaff);
router.post('/bulk-add', bulkAddStaff);

export default router;
