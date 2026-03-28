export default function QuizCard({ question, questionNumber, total, selectedAnswer, onSelect, showResult, isCorrect }) {
  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(26,18,8,0.10)',
      overflow: 'hidden', animation: 'fadeIn 0.4s ease'
    }}>
      {/* Progress bar */}
      <div style={{ height: '4px', background: '#f0e8d8' }}>
        <div style={{
          height: '100%', background: '#C9A84C',
          width: `${(questionNumber / total) * 100}%`,
          transition: 'width 0.4s ease', borderRadius: '0 4px 4px 0'
        }} />
      </div>

      <div style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            fontSize: '11px', fontWeight: '600', letterSpacing: '1px',
            color: '#8B1A2C', textTransform: 'uppercase'
          }}>
            {question.difficulty?.toUpperCase() || 'MEDIUM'} · {question.category || 'General'}
          </span>
          <span style={{ fontSize: '12px', color: '#a09080', fontWeight: '500' }}>
            {questionNumber} / {total}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem',
          color: '#1a1208', lineHeight: '1.4', marginBottom: '28px'
        }}>
          {question.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((opt, i) => {
            let bg = 'white', border = '2px solid #e0d8cc', color = '#1a1208';
            if (selectedAnswer !== null) {
              if (showResult) {
                if (i === question.correctAnswer) { bg = '#e8f5e9'; border = '2px solid #4caf50'; color = '#2d7a4f'; }
                else if (i === selectedAnswer && !isCorrect) { bg = '#ffebee'; border = '2px solid #e53935'; color = '#c62828'; }
              } else if (i === selectedAnswer) { bg = '#fff8f0'; border = '2px solid #8B1A2C'; color = '#8B1A2C'; }
            }
            return (
              <button
                key={i}
                onClick={() => !showResult && onSelect(i)}
                disabled={showResult}
                style={{
                  padding: '14px 20px', borderRadius: '10px',
                  background: bg, border, color,
                  fontSize: '14px', textAlign: 'left',
                  cursor: showResult ? 'default' : 'pointer',
                  fontFamily: 'Montserrat, sans-serif', fontWeight: '500',
                  transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px'
                }}
              >
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: i === selectedAnswer && !showResult ? '#8B1A2C' : (showResult && i === question.correctAnswer ? '#4caf50' : '#f0e8d8'),
                  color: (i === selectedAnswer && !showResult) || (showResult && i === question.correctAnswer) ? 'white' : '#8B1A2C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '700', flexShrink: 0
                }}>
                  {['A', 'B', 'C', 'D'][i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
