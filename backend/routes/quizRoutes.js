const express = require('express');
const router = express.Router();
const { addQuestion, getQuestions, submitAnswers, getScoreHistory, getAllScores, deleteQuestion } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/questions', getQuestions);
router.post('/questions', protect, admin, addQuestion);
router.delete('/questions/:id', protect, admin, deleteQuestion);
router.post('/submit', protect, submitAnswers);
router.get('/scores/me', protect, getScoreHistory);
router.get('/scores/all', protect, admin, getAllScores);

module.exports = router;
