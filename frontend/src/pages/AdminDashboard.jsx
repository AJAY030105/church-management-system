import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TABS = ['Events', 'Quiz Questions', 'Scores', 'Notifications'];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Events');

  // Events state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', category: 'other', image: '' });
  const [eventError, setEventError] = useState('');
  const [eventSuccess, setEventSuccess] = useState('');
  const [eventLoading, setEventLoading] = useState(false);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizForm, setQuizForm] = useState({ question: '', options: ['', '', '', ''], correctAnswer: 0, difficulty: 'medium', category: 'General' });
  const [quizError, setQuizError] = useState('');
  const [quizSuccess, setQuizSuccess] = useState('');
  const [quizLoading, setQuizLoading] = useState(false);

  // Scores state
  const [scores, setScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifForm, setNotifForm] = useState({ message: '', type: 'general' });
  const [notifSuccess, setNotifSuccess] = useState('');

  // Stats
  const [stats, setStats] = useState({ events: 0, questions: 0, scores: 0, notifications: 0 });

  useEffect(() => { fetchEvents(); fetchQuestions(); }, []);

  useEffect(() => {
    if (activeTab === 'Scores') fetchScores();
    if (activeTab === 'Notifications') fetchNotifications();
  }, [activeTab]);

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const { data } = await api.get('/events');
      setEvents(data);
      setStats(s => ({ ...s, events: data.length }));
    } catch {} finally { setEventsLoading(false); }
  };

  const fetchQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const { data } = await api.get('/quiz/questions');
      setQuestions(data);
      setStats(s => ({ ...s, questions: data.length }));
    } catch {} finally { setQuestionsLoading(false); }
  };

  const fetchScores = async () => {
    setScoresLoading(true);
    try {
      const { data } = await api.get('/quiz/scores/all');
      setScores(data);
      setStats(s => ({ ...s, scores: data.length }));
    } catch {} finally { setScoresLoading(false); }
  };

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setStats(s => ({ ...s, notifications: data.length }));
    } catch {} finally { setNotifLoading(false); }
  };

  // Event handlers
  const openEventForm = (event = null) => {
    setEventError(''); setEventSuccess('');
    if (event) {
      setEditEvent(event);
      setEventForm({
        title: event.title, description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location || '', category: event.category, image: event.image || ''
      });
    } else {
      setEditEvent(null);
      setEventForm({ title: '', description: '', date: '', location: '', category: 'other', image: '' });
    }
    setShowEventForm(true);
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    setEventError(''); setEventSuccess('');
    if (!eventForm.title || !eventForm.description || !eventForm.date) {
      return setEventError('Title, description, and date are required.');
    }
    setEventLoading(true);
    try {
      if (editEvent) {
        await api.put(`/events/${editEvent._id}`, eventForm);
        setEventSuccess('Event updated successfully!');
      } else {
        await api.post('/events', eventForm);
        setEventSuccess('Event created! Notification sent to all users.');
      }
      await fetchEvents();
      setTimeout(() => { setShowEventForm(false); setEventSuccess(''); }, 2000);
    } catch (err) {
      setEventError(err.response?.data?.message || 'Failed to save event');
    } finally { setEventLoading(false); }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
      setStats(s => ({ ...s, events: s.events - 1 }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  // Quiz handlers
  const submitQuestion = async (e) => {
    e.preventDefault();
    setQuizError(''); setQuizSuccess('');
    if (!quizForm.question || quizForm.options.some(o => !o.trim())) {
      return setQuizError('Question and all options are required.');
    }
    setQuizLoading(true);
    try {
      await api.post('/quiz/questions', quizForm);
      setQuizSuccess('Question added successfully!');
      setQuizForm({ question: '', options: ['', '', '', ''], correctAnswer: 0, difficulty: 'medium', category: 'General' });
      await fetchQuestions();
      setTimeout(() => { setShowQuizForm(false); setQuizSuccess(''); }, 1500);
    } catch (err) {
      setQuizError(err.response?.data?.message || 'Failed to add question');
    } finally { setQuizLoading(false); }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/quiz/questions/${id}`);
      setQuestions(questions.filter(q => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const submitNotification = async (e) => {
    e.preventDefault();
    if (!notifForm.message) return;
    try {
      await api.post('/notifications', notifForm);
      setNotifSuccess('Notification sent!');
      setNotifForm({ message: '', type: 'general' });
      await fetchNotifications();
      setTimeout(() => setNotifSuccess(''), 2000);
    } catch {}
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatDateTime = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0ea', paddingTop: '72px' }}>
      {/* Admin header */}
      <div style={{ background: '#8B1A2C', padding: '24px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#FDF6E9', marginBottom: '4px' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'rgba(253,246,233,0.7)', fontSize: '13px' }}>Welcome, {user?.name} — Parish Administrator</p>
          </div>
          <button onClick={logout} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: 'white', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'Montserrat, sans-serif'
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'white', borderBottom: '1px solid #f0e8d8' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
            {[
              { label: 'Total Events', value: stats.events, icon: '📅', color: '#8B1A2C' },
              { label: 'Quiz Questions', value: stats.questions, icon: '📝', color: '#C9A84C' },
              { label: 'Quiz Attempts', value: stats.scores, icon: '🏆', color: '#2d7a4f' },
              { label: 'Notifications', value: stats.notifications, icon: '🔔', color: '#3d5a80' },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                padding: '24px 28px', borderRight: i < 3 ? '1px solid #f0e8d8' : 'none',
                display: 'flex', gap: '16px', alignItems: 'center'
              }}>
                <div style={{ fontSize: '28px' }}>{stat.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#a09080', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #f0e8d8' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 24px', border: 'none', background: 'transparent',
                  color: activeTab === tab ? '#8B1A2C' : '#7a6a5a',
                  fontWeight: activeTab === tab ? '700' : '500',
                  fontSize: '13px', cursor: 'pointer',
                  borderBottom: activeTab === tab ? '3px solid #8B1A2C' : '3px solid transparent',
                  fontFamily: 'Montserrat, sans-serif', transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '36px 24px' }}>

        {/* ── EVENTS TAB ── */}
        {activeTab === 'Events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Manage Events</h2>
              <button onClick={() => openEventForm()} className="btn btn-primary">+ Add Event</button>
            </div>

            {/* Event Form Modal */}
            {showEventForm && (
              <div className="modal-overlay" onClick={() => setShowEventForm(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{editEvent ? 'Edit Event' : 'Create New Event'}</h3>
                    <button className="modal-close" onClick={() => setShowEventForm(false)}>×</button>
                  </div>
                  <div className="modal-body">
                    {eventError && <div style={{ background: '#ffebee', border: '1px solid #e53935', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#c62828', fontSize: '13px' }}>⚠️ {eventError}</div>}
                    {eventSuccess && <div style={{ background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#2d7a4f', fontSize: '13px' }}>✅ {eventSuccess}</div>}
                    <form onSubmit={submitEvent}>
                      <div className="form-group">
                        <label>Event Title *</label>
                        <input value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="e.g., Christmas Midnight Mass" />
                      </div>
                      <div className="form-group">
                        <label>Description *</label>
                        <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Describe the event..." />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label>Date & Time *</label>
                          <input type="datetime-local" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Category</label>
                          <select value={eventForm.category} onChange={e => setEventForm({ ...eventForm, category: e.target.value })}>
                            {['mass', 'feast', 'community', 'sacrament', 'other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="e.g., Main Church Hall" />
                      </div>
                      <div className="form-group">
                        <label>Image URL (optional)</label>
                        <input value={eventForm.image} onChange={e => setEventForm({ ...eventForm, image: e.target.value })} placeholder="https://..." />
                      </div>
                      {!editEvent && (
                        <div style={{ background: '#fff8f0', border: '1px solid #f0e8d8', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: '#7a6a5a' }}>
                          📢 Creating this event will automatically send a notification and email to all registered parishioners.
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn btn-primary" disabled={eventLoading} style={{ flex: 1, justifyContent: 'center' }}>
                          {eventLoading ? <><span className="loading-spinner" /> Saving...</> : editEvent ? 'Update Event' : 'Create Event'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowEventForm(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {eventsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#a09080' }}>Loading events...</div>
            ) : events.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📅</div>
                <h3>No Events Yet</h3>
                <p>Click "Add Event" to create the first parish event.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {events.map(event => (
                  <div key={event._id} style={{
                    background: 'white', borderRadius: '12px', padding: '20px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(26,18,8,0.06)', gap: '20px'
                  }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #8B1A2C, #c0394f)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>✝</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#1a1208' }}>{event.title}</h4>
                          <span className="badge badge-gold" style={{ textTransform: 'capitalize', fontSize: '10px' }}>{event.category}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#a09080', marginBottom: '4px' }}>📅 {formatDate(event.date)}{event.location ? ` · 📍 ${event.location}` : ''}</p>
                        <p style={{ fontSize: '13px', color: '#7a6a5a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>{event.description}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => openEventForm(event)} style={{ padding: '7px 16px', background: '#fff8f0', border: '1px solid #f0e8d8', borderRadius: '8px', color: '#8B1A2C', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Edit</button>
                      <button onClick={() => deleteEvent(event._id)} style={{ padding: '7px 16px', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── QUIZ TAB ── */}
        {activeTab === 'Quiz Questions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem' }}>Quiz Questions</h2>
              <button onClick={() => { setShowQuizForm(!showQuizForm); setQuizError(''); setQuizSuccess(''); }} className="btn btn-primary">
                {showQuizForm ? '✕ Cancel' : '+ Add Question'}
              </button>
            </div>

            {showQuizForm && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '28px', boxShadow: '0 4px 20px rgba(26,18,8,0.08)' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', marginBottom: '24px' }}>Add New Question</h3>
                {quizError && <div style={{ background: '#ffebee', border: '1px solid #e53935', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#c62828', fontSize: '13px' }}>⚠️ {quizError}</div>}
                {quizSuccess && <div style={{ background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#2d7a4f', fontSize: '13px' }}>✅ {quizSuccess}</div>}
                <form onSubmit={submitQuestion}>
                  <div className="form-group">
                    <label>Question *</label>
                    <textarea value={quizForm.question} onChange={e => setQuizForm({ ...quizForm, question: e.target.value })} placeholder="Enter the quiz question..." style={{ minHeight: '80px' }} />
                  </div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2b1f', display: 'block', marginBottom: '12px' }}>Answer Options * (select the correct one)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {quizForm.options.map((opt, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={quizForm.correctAnswer === i}
                          onChange={() => setQuizForm({ ...quizForm, correctAnswer: i })}
                          style={{ width: '18px', height: '18px', accentColor: '#8B1A2C', flexShrink: 0 }}
                        />
                        <input
                          value={opt}
                          onChange={e => {
                            const opts = [...quizForm.options];
                            opts[i] = e.target.value;
                            setQuizForm({ ...quizForm, options: opts });
                          }}
                          placeholder={`Option ${['A', 'B', 'C', 'D'][i]}`}
                          style={{
                            flex: 1, padding: '10px 14px', border: `1.5px solid ${quizForm.correctAnswer === i ? '#8B1A2C' : '#e0d8cc'}`,
                            borderRadius: '8px', fontSize: '14px', fontFamily: 'Montserrat, sans-serif',
                            background: quizForm.correctAnswer === i ? '#fff8f0' : 'white', outline: 'none'
                          }}
                        />
                        <span style={{ fontSize: '11px', color: quizForm.correctAnswer === i ? '#8B1A2C' : '#a09080', fontWeight: '600', width: '50px', flexShrink: 0 }}>
                          {quizForm.correctAnswer === i ? '✓ Correct' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Difficulty</label>
                      <select value={quizForm.difficulty} onChange={e => setQuizForm({ ...quizForm, difficulty: e.target.value })}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input value={quizForm.category} onChange={e => setQuizForm({ ...quizForm, category: e.target.value })} placeholder="e.g., Scripture, Saints..." />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={quizLoading} style={{ justifyContent: 'center' }}>
                    {quizLoading ? <><span className="loading-spinner" /> Adding...</> : 'Add Question'}
                  </button>
                </form>
              </div>
            )}

            {questionsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#a09080' }}>Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📝</div>
                <h3>No Questions Yet</h3>
                <p>Add quiz questions for parishioners to test their faith knowledge.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {questions.map((q, i) => (
                  <div key={q._id} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(26,18,8,0.06)', display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '700', color: '#8B1A2C', fontSize: '13px' }}>Q{i + 1}.</span>
                        <span className="badge" style={{ background: q.difficulty === 'easy' ? '#e8f5e9' : q.difficulty === 'hard' ? '#ffebee' : '#fff8e1', color: q.difficulty === 'easy' ? '#2d7a4f' : q.difficulty === 'hard' ? '#c62828' : '#b5803b', fontSize: '10px' }}>{q.difficulty}</span>
                        <span className="badge" style={{ background: '#f0e8d8', color: '#7a6a5a', fontSize: '10px' }}>{q.category}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#1a1208', fontWeight: '500', marginBottom: '8px', lineHeight: 1.5 }}>{q.question}</p>
                      <p style={{ fontSize: '12px', color: '#a09080' }}>{q.options?.length} options</p>
                    </div>
                    <button onClick={() => deleteQuestion(q._id)} style={{ padding: '6px 14px', background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', flexShrink: 0 }}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SCORES TAB ── */}
        {activeTab === 'Scores' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '28px' }}>Quiz Leaderboard</h2>
            {scoresLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#a09080' }}>Loading scores...</div>
            ) : scores.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🏆</div>
                <h3>No Scores Yet</h3>
                <p>Scores will appear here once parishioners attempt the quiz.</p>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(26,18,8,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#8B1A2C' }}>
                      {['Rank', 'Name', 'Score', 'Questions', 'Percentage', 'Date'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', color: '#FDF6E9', fontSize: '12px', fontWeight: '600', textAlign: 'left', letterSpacing: '0.5px', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((s, i) => (
                      <tr key={s._id} style={{ borderBottom: '1px solid #f0e8d8', background: i % 2 === 0 ? 'white' : '#fdf9f4' }}>
                        <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '700', color: i === 0 ? '#C9A84C' : i === 1 ? '#a09080' : i === 2 ? '#b87333' : '#7a6a5a' }}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '14px', color: '#1a1208', fontWeight: '500' }}>{s.userName || 'Anonymous'}</td>
                        <td style={{ padding: '14px 20px', fontSize: '14px', color: '#1a1208' }}>{s.score}</td>
                        <td style={{ padding: '14px 20px', fontSize: '14px', color: '#7a6a5a' }}>{s.totalQuestions}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            background: s.percentage >= 75 ? '#e8f5e9' : s.percentage >= 50 ? '#fff8e1' : '#ffebee',
                            color: s.percentage >= 75 ? '#2d7a4f' : s.percentage >= 50 ? '#b5803b' : '#c62828',
                            padding: '4px 12px', borderRadius: '12px', fontWeight: '700', fontSize: '13px'
                          }}>
                            {s.percentage}%
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '12px', color: '#a09080' }}>{formatDate(s.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === 'Notifications' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '28px' }}>Notifications</h2>

            {/* Manual notification form */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(26,18,8,0.08)' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', marginBottom: '20px' }}>Send Manual Notification</h3>
              {notifSuccess && <div style={{ background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#2d7a4f', fontSize: '13px' }}>✅ {notifSuccess}</div>}
              <form onSubmit={submitNotification} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  value={notifForm.message}
                  onChange={e => setNotifForm({ ...notifForm, message: e.target.value })}
                  placeholder="Announcement message..."
                  style={{ flex: 1, minWidth: '260px', padding: '12px 16px', border: '1.5px solid #e0d8cc', borderRadius: '8px', fontSize: '14px', fontFamily: 'Montserrat, sans-serif', outline: 'none' }}
                />
                <select
                  value={notifForm.type}
                  onChange={e => setNotifForm({ ...notifForm, type: e.target.value })}
                  style={{ padding: '12px 16px', border: '1.5px solid #e0d8cc', borderRadius: '8px', fontSize: '14px', fontFamily: 'Montserrat, sans-serif', background: 'white' }}
                >
                  <option value="general">General</option>
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                </select>
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>

            {notifLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#a09080' }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔔</div>
                <h3>No Notifications Yet</h3>
                <p>Notifications are created automatically when events are added.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                  <div key={n._id} style={{
                    background: 'white', borderRadius: '10px', padding: '16px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(26,18,8,0.06)', borderLeft: `4px solid ${n.type === 'event' ? '#8B1A2C' : '#C9A84C'}`
                  }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', color: '#1a1208', fontWeight: '500' }}>
                          {n.type === 'event' ? '📅' : n.type === 'announcement' ? '📢' : '🔔'} {n.message}
                        </span>
                        {!n.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B1A2C', flexShrink: 0 }} />}
                      </div>
                      <p style={{ fontSize: '11px', color: '#a09080' }}>
                        {formatDateTime(n.createdAt)} · {n.isRead ? '✓ Read' : 'Unread'}
                      </p>
                    </div>
                    <span className="badge" style={{ textTransform: 'capitalize', background: '#f0e8d8', color: '#7a6a5a', fontSize: '10px' }}>{n.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
