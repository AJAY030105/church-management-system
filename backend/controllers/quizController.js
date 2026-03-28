const Quiz = require('../models/Quiz');
const Score = require('../models/Score');

const addQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, difficulty, category } = req.body;
    if (!question || !options || options.length < 2 || correctAnswer === undefined)
      return res.status(400).json({ message: 'Question, options (min 2), and correctAnswer are required' });

    const quiz = await Quiz.create({
      question, options, correctAnswer, difficulty, category,
      createdBy: req.user._id,
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Quiz.find().select('-correctAnswer').sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAnswers = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedAnswer }]
    if (!answers || !Array.isArray(answers))
      return res.status(400).json({ message: 'Answers array required' });

    let score = 0;
    const results = [];

    for (const ans of answers) {
      const question = await Quiz.findById(ans.questionId);
      if (!question) continue;
      const isCorrect = question.correctAnswer === ans.selectedAnswer;
      if (isCorrect) score++;
      results.push({
        questionId: ans.questionId,
        question: question.question,
        selectedAnswer: ans.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    }

    const totalQuestions = results.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const savedScore = await Score.create({
      userId: req.user._id,
      userName: req.user.name,
      score, totalQuestions, percentage,
    });

    res.json({ score, totalQuestions, percentage, results, savedScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScoreHistory = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllScores = async (req, res) => {
  try {
    const scores = await Score.find().sort({ percentage: -1, createdAt: -1 }).limit(50);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const q = await Quiz.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addQuestion, getQuestions, submitAnswers, getScoreHistory, getAllScores, deleteQuestion };
