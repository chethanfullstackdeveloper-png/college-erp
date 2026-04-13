import express from 'express';
import {
  loginAdmin,
  getAllStaff,
  getAllStudents,
  deleteStaff,
  deleteStudent,
} from '../controllers/adminController';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/staff', getAllStaff);
router.get('/students', getAllStudents);
router.delete('/staff/:staffId', deleteStaff);
router.delete('/students/:studentId', deleteStudent);

export default router;
