import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Post, Category, QuizQuestion } from '../types';
import confetti from 'canvas-confetti';

interface QuizHubProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  showToast: (msg: string) => void;
}

interface FlattenedQuiz {
  postTitle: string;
  postCategory: string;
  postId: string;
  quiz: QuizQuestion;
}

export const QuizHub: React.FC<QuizHubProps> = ({ posts, onSelectPost, showToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  
  // Aggregate all quizzes from posts
  const allQuizzes: FlattenedQuiz[] = [];
  posts.forEach(p => {
    if (p.quizzes && p.quizzes.length > 0) {
      p.quizzes.forEach(q => {
        allQuizzes.push({
          postTitle: p.title,
          postCategory: p.category,
          postId: p.id,
          quiz: q
        });
      });
    }
  });

  const filteredQuizzes = selectedCategory === 'All' 
    ? allQuizzes 
    : allQuizzes.filter(q => q.postCategory === selectedCategory);

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentItem = filteredQuizzes[currentQuizIndex];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentItem) return;
    setIsSubmitted(true);
    
    if (selectedOption === currentItem.quiz.correctIndex) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
      showToast('Correct! +1 Knowledge Point');
    } else {
      showToast('Incorrect. Read the conceptual explanation below.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 < filteredQuizzes.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      if (score + (selectedOption === currentItem?.quiz.correctIndex ? 1 : 0) === filteredQuizzes.length) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const categories = ['All', ...Array.from(new Set(allQuizzes.map(q => q.postCategory)))];

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '840px', margin: '0 auto' }}>
      
      {/* Quiz Hub Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          background: 'var(--accent-primary-light)',
          color: 'var(--accent-primary)',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '0.75rem'
        }}>
          <GraduationCap size={16} />
          <span>EduPulse Interactive Assessment Center</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Test Your Mastery
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Synthesized question pool from peer-published educational articles.
        </p>

        {/* Category Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat as any);
                handleRestartQuiz();
              }}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: selectedCategory === cat ? '700' : '500',
                background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-light)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-light)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No quizzes found for this category.</p>
        </div>
      ) : quizFinished ? (
        /* Quiz Finished Summary */
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '1.25rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: '#fff',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
          }}>
            <Award size={32} />
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Assessment Complete!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You answered <strong style={{ color: 'var(--text-primary)' }}>{score}</strong> out of <strong style={{ color: 'var(--text-primary)' }}>{filteredQuizzes.length}</strong> questions correctly ({Math.round((score / filteredQuizzes.length) * 100)}%).
          </p>

          <button 
            onClick={handleRestartQuiz}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.75rem', fontSize: '1rem' }}
          >
            <RotateCcw size={16} />
            <span>Retake Assessment</span>
          </button>
        </div>
      ) : (
        /* Active Quiz Card */
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '1.25rem',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          
          {/* Progress Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-ai">{currentItem.postCategory}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Question {currentQuizIndex + 1} of {filteredQuizzes.length}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
              <Sparkles size={16} />
              <span>Score: {score}</span>
            </div>
          </div>

          {/* Source Article Reference */}
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <BookOpen size={13} />
            <span>Based on lesson: <em>{currentItem.postTitle}</em></span>
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.4' }}>
            {currentItem.quiz.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {currentItem.quiz.options.map((option, idx) => {
              let btnClass = 'quiz-option';
              if (isSubmitted) {
                if (idx === currentItem.quiz.correctIndex) {
                  btnClass += ' selected-correct';
                } else if (selectedOption === idx) {
                  btnClass += ' selected-wrong';
                }
              } else if (selectedOption === idx) {
                btnClass += ' selected-correct';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={btnClass}
                  disabled={isSubmitted}
                >
                  <span style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{option}</span>
                  {isSubmitted && idx === currentItem.quiz.correctIndex && (
                    <CheckCircle2 size={18} color="#10b981" />
                  )}
                  {isSubmitted && selectedOption === idx && idx !== currentItem.quiz.correctIndex && (
                    <XCircle size={18} color="#ef4444" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted && (
            <div style={{
              padding: '1.15rem',
              borderRadius: '0.75rem',
              background: selectedOption === currentItem.quiz.correctIndex ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${selectedOption === currentItem.quiz.correctIndex ? 'var(--success)' : 'var(--danger)'}`,
              marginBottom: '1.5rem',
              lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '0.25rem', color: selectedOption === currentItem.quiz.correctIndex ? 'var(--success)' : 'var(--danger)' }}>
                {selectedOption === currentItem.quiz.correctIndex ? '✓ Correct Explanation:' : '✗ Insight:'}
              </div>
              <div style={{ fontSize: '0.9rem' }}>{currentItem.quiz.explanation}</div>
            </div>
          )}

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem', opacity: selectedOption === null ? 0.5 : 1 }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem' }}
              >
                <span>{currentQuizIndex + 1 === filteredQuizzes.length ? 'Finish Assessment' : 'Next Question'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
