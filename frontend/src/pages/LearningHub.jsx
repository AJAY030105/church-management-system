import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';

export default function LearningHub() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/quiz/questions').then(({ data }) => setQuestions(data))
      .catch(() => setError('Failed to load questions'))
      .finally(() => setLoading(false));

    if (user) {
      setHistoryLoading(true);
      api.get('/quiz/scores/me').then(({ data }) => setScoreHistory(data))
        .catch(() => {}).finally(() => setHistoryLoading(false));
    }
  }, [user]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setQuizFinished(false);
    setResult(null);
    setError('');
  };

  const handleSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowAnswer(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, { questionId: questions[currentIndex]._id, selectedAnswer }];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      // Submit
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    if (!user) {
      setError('Please login to save your score.');
      setQuizFinished(true);
      const correct = finalAnswers.filter((ans, i) => {
        const q = questions[i];
        return q && ans.selectedAnswer === q.correctAnswer;
      }).length;
      setResult({ score: correct, totalQuestions: questions.length, percentage: Math.round((correct / questions.length) * 100), results: [] });
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/quiz/submit', { answers: finalAnswers });
      setResult(data);
      setScoreHistory(prev => [data.savedScore, ...prev].slice(0, 10));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
      setQuizFinished(true);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer !== null && currentQuestion && selectedAnswer === currentQuestion.correctAnswer;

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', label: 'Excellent!', emoji: '🏆', color: '#2d7a4f' };
    if (pct >= 75) return { grade: 'A', label: 'Great Job!', emoji: '⭐', color: '#4a7c59' };
    if (pct >= 60) return { grade: 'B', label: 'Good Work!', emoji: '👍', color: '#C9A84C' };
    if (pct >= 40) return { grade: 'C', label: 'Keep Learning!', emoji: '📖', color: '#d4472a' };
    return { grade: 'D', label: 'Try Again!', emoji: '💪', color: '#8B1A2C' };
  };

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Learning Hub</h1>
          <p>Test your knowledge of scripture and Catholic faith</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          {!quizStarted && !quizFinished && (
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div style={{
                background: 'white', borderRadius: '20px', padding: '48px',
                boxShadow: '0 4px 20px rgba(26,18,8,0.10)'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📖</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#1a1208', marginBottom: '16px' }}>
                  Scripture & Faith Quiz
                </h2>
                <p style={{ color: '#7a6a5a', lineHeight: 1.8, marginBottom: '12px', maxWidth: '480px', margin: '0 auto 24px' }}>
                  Test your knowledge of the Bible, Catholic traditions, and parish history. Each quiz has multiple questions of varying difficulty.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
                  <div style={{ background: '#fff8f0', padding: '12px 20px', borderRadius: '10px' }}>
                    <div style={{ fontWeight: '700', color: '#8B1A2C', fontSize: '20px' }}>{questions.length}</div>
                    <div style={{ fontSize: '12px', color: '#a09080' }}>Questions</div>
                  </div>
                  <div style={{ background: '#fff8f0', padding: '12px 20px', borderRadius: '10px' }}>
                    <div style={{ fontWeight: '700', color: '#8B1A2C', fontSize: '20px' }}>~{Math.ceil(questions.length * 0.5)} min</div>
                    <div style={{ fontSize: '12px', color: '#a09080' }}>Est. Time</div>
                  </div>
                </div>
                {loading ? (
                  <p style={{ color: '#a09080' }}>Loading questions...</p>
                ) : questions.length === 0 ? (
                  <div className="empty-state">
                    <h3>No Questions Available</h3>
                    <p>Check back soon — the admin will be adding quiz questions.</p>
                  </div>
                ) : (
                  <button onClick={startQuiz} className="btn btn-primary" style={{ fontSize: '15px', padding: '14px 40px' }}>
                    Start Quiz ✝
                  </button>
                )}
                {!user && <p style={{ fontSize: '12px', color: '#a09080', marginTop: '16px' }}>* Login to save your score</p>}
              </div>
            </div>
          )}

          {quizStarted && !quizFinished && currentQuestion && (
            <div className="fade-in">
              <QuizCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                total={questions.length}
                selectedAnswer={selectedAnswer}
                onSelect={handleSelect}
                showResult={showAnswer}
                isCorrect={isCorrect}
              />

              {showAnswer && (
                <div style={{ marginTop: '20px', textAlign: 'center' }} className="fade-in">
                  <div style={{
                    padding: '16px', borderRadius: '10px', marginBottom: '16px',
                    background: isCorrect ? '#e8f5e9' : '#ffebee',
                    border: `1px solid ${isCorrect ? '#4caf50' : '#e53935'}`
                  }}>
                    <p style={{ color: isCorrect ? '#2d7a4f' : '#c62828', fontWeight: '600', fontSize: '14px' }}>
                      {isCorrect ? '✅ Correct!' : `❌ The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    {submitting ? <><span className="loading-spinner" /> Submitting...</> :
                      currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
                  </button>
                </div>
              )}
            </div>
          )}

          {quizFinished && result && (
            <div className="fade-in">
              {(() => {
                const g = getGrade(result.percentage);
                return (
                  <div style={{ textAlign: 'center', background: 'white', borderRadius: '20px', padding: '48px', boxShadow: '0 4px 20px rgba(26,18,8,0.10)' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>{g.emoji}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '5rem', color: g.color, lineHeight: 1, marginBottom: '8px' }}>{g.grade}</div>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '8px' }}>{g.label}</h2>
                    <p style={{ color: '#7a6a5a', marginBottom: '32px' }}>
                      You answered <strong>{result.score}</strong> out of <strong>{result.totalQuestions}</strong> questions correctly ({result.percentage}%)
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button onClick={startQuiz} className="btn btn-primary">Try Again</button>
                      <button onClick={() => { setQuizStarted(false); setQuizFinished(false); }} className="btn btn-secondary">Back to Hub</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {error && <div className="error-msg" style={{ justifyContent: 'center', marginTop: '16px' }}>⚠️ {error}</div>}

          {/* Score History */}
          {user && scoreHistory.length > 0 && !quizStarted && (
            <div style={{ marginTop: '60px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center' }}>
                Your Recent Scores
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {scoreHistory.map((s, i) => (
                  <div key={s._id || i} style={{
                    background: 'white', borderRadius: '10px', padding: '16px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(26,18,8,0.06)'
                  }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1208' }}>
                        {s.score}/{s.totalQuestions} correct
                      </p>
                      <p style={{ fontSize: '12px', color: '#a09080' }}>
                        {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{
                      background: s.percentage >= 75 ? '#e8f5e9' : s.percentage >= 50 ? '#fff8e1' : '#ffebee',
                      color: s.percentage >= 75 ? '#2d7a4f' : s.percentage >= 50 ? '#b5803b' : '#c62828',
                      padding: '6px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '14px'
                    }}>
                      {s.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
