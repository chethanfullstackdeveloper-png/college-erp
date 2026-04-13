import express from 'express';
import {
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
  addStudent,
  bulkAddStudents,
  getAllStudents,
} from '../controllers/studentController';

const router = express.Router();

router.post('/login', loginStudent);
router.get('/:studentId', getStudentProfile);
router.put('/:studentId', updateStudentProfile);
router.post('/add', addStudent);
router.post('/bulk-add', bulkAddStudents);
router.get('/', getAllStudents);

export default router;
