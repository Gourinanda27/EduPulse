import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Heart, 
  Bookmark, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Check, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  MessageSquare, 
  Send, 
  ThumbsUp, 
  Type, 
  Printer, 
  Sparkles,
  ExternalLink,
  Code
} from 'lucide-react';
import { Post, Comment, QuizQuestion } from '../types';
import confetti from 'canvas-confetti';

interface PostReaderProps {
  post: Post;
  onBack: () => void;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (postId: string) => void;
  onToggleLike: (postId: string) => void;
  onShare: (post: Post) => void;
  comments: Comment[];
  onAddComment: (postId: string, name: string, role: string, content: string) => void;
  onOpenSandboxWithCode?: (code: string) => void;
  showToast: (msg: string) => void;
}

export const PostReader: React.FC<PostReaderProps> = ({
  post,
  onBack,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onShare,
  comments,
  onAddComment,
  onOpenSandboxWithCode,
  showToast
}) => {
  // Reading Progress State
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Font Size: 'sm' | 'base' | 'lg'
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Text-to-Speech State
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Flashcard State
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Comments Input
  const [commentName, setCommentName] = useState('');
  const [commentRole, setCommentRole] = useState('Learner');
  const [commentText, setCommentText] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Active TOC Section
  const [activeTocId, setActiveTocId] = useState<string>('');

  useEffect(() => {
    // Check Speech Synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }

    // Scroll progress handler
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const currentProgress = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text to Speech handler
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text to Speech is not supported in this browser.');
      return;
    }

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    } else {
      window.speechSynthesis.cancel();
      // Clean content for speech (remove markdown symbols)
      const cleanText = `${post.title}. ${post.subtitle}. ${post.content
        .replace(/#+/g, '')
        .replace(/\*\*|__/g, '')
        .replace(/`{1,3}[^`]*`{1,3}/g, 'code snippet')
        .replace(/\$\$[\s\S]*?\$\$/g, 'mathematical equation')
        .replace(/>\s*\[!.*?\]/g, '')
        .slice(0, 3000)}`;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingSpeech(true);
      showToast('Audio narration started');
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    showToast('Code copied to clipboard!');
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleSelectQuizOption = (quizId: string, optionIndex: number, correctIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optionIndex }));
    setRevealedAnswers(prev => ({ ...prev, [quizId]: true }));
    
    if (optionIndex === correctIndex) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      showToast('Correct answer! Well done! 🎉');
    }
  };

  const handleToggleFlipCard = (cardId: string) => {
    setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentName.trim() || 'Anonymous Scholar', commentRole.trim() || 'Curious Learner', commentText.trim());
    setCommentText('');
    showToast('Your comment has been posted!');
  };

  const postComments = comments.filter(c => c.postId === post.id);

  // Markdown Content Parsing and Rendering
  const renderFormattedContent = () => {
    const lines = post.content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const bodyRows = tableRows.slice(2); // Skip separator row
        elements.push(
          <div key={key} style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--border-color)' }}>
                  {headers.map((th, i) => (
                    <th key={i} style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>{th.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-light)', background: rIdx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                    {row.map((td, cIdx) => (
                      <td key={cIdx} style={{ padding: '0.75rem 1rem' }}>{td.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim() || 'code';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const fullCode = codeBuffer.join('\n');
          const codeId = `code-${i}`;
          elements.push(
            <div key={codeId} className="code-block-wrapper">
              <div className="code-header">
                <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>{codeLanguage}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {onOpenSandboxWithCode && (
                    <button
                      onClick={() => onOpenSandboxWithCode(fullCode)}
                      className="code-copy-btn"
                      title="Run in Live Code Sandbox"
                    >
                      <Code size={13} />
                      <span>Run in Sandbox</span>
                    </button>
                  )}
                  <button 
                    onClick={() => handleCopyCode(fullCode, codeId)}
                    className="code-copy-btn"
                  >
                    {copiedCodeId === codeId ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    <span>{copiedCodeId === codeId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <pre>
                <code>{fullCode}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Markdown Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        const cells = line.split('|').slice(1, -1);
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable(`table-${i}`);
      }

      // Math block ($$...$$)
      if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
        const mathText = line.trim().slice(2, -2).trim();
        elements.push(
          <div key={`math-${i}`} className="math-block">
            <span>{mathText}</span>
          </div>
        );
        continue;
      }

      // Callouts (> [!NOTE], > [!TIP], etc.)
      if (line.startsWith('> [!NOTE]') || line.startsWith('> [!TIP]') || line.startsWith('> [!WARNING]') || line.startsWith('> [!IMPORTANT]')) {
        const type = line.includes('NOTE') ? 'note' : line.includes('TIP') ? 'tip' : line.includes('WARNING') ? 'warning' : 'important';
        const calloutLines: string[] = [];
        let j = i + 1;
        while (j < lines.length && lines[j].startsWith('>')) {
          calloutLines.push(lines[j].replace(/^>\s?/, ''));
          j++;
        }
        i = j - 1;
        elements.push(
          <div key={`callout-${i}`} className={`callout callout-${type}`}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
              {type}
            </div>
            <div>{calloutLines.join(' ')}</div>
          </div>
        );
        continue;
      }

      // Headings
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '').trim();
        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        elements.push(
          <h2 key={`h2-${i}`} id={id} style={{ fontSize: '1.65rem', fontWeight: '800', margin: '2.5rem 0 1rem 0', scrollMarginTop: '6rem' }}>
            {title}
          </h2>
        );
        continue;
      }

      if (line.startsWith('### ')) {
        const title = line.replace('### ', '').trim();
        elements.push(
          <h3 key={`h3-${i}`} style={{ fontSize: '1.25rem', fontWeight: '700', margin: '1.75rem 0 0.75rem 0' }}>
            {title}
          </h3>
        );
        continue;
      }

      // Horizontal separator
      if (line.trim() === '---') {
        elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2.5rem 0' }} />);
        continue;
      }

      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <li key={`li-${i}`} style={{ marginLeft: '1.5rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            {line.trim().slice(2)}
          </li>
        );
        continue;
      }

      // Paragraphs
      if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${i}`} style={{ marginBottom: '1.25rem', lineHeight: '1.75', color: 'var(--text-primary)' }}>
            {line}
          </p>
        );
      }
    }

    if (inTable) {
      flushTable('table-end');
    }

    return elements;
  };

  const fontSizes = {
    sm: '0.95rem',
    base: '1.05rem',
    lg: '1.2rem'
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Top Reading Progress Bar */}
      <div 
        className="reading-progress-bar" 
        style={{ width: `${scrollProgress}%` }} 
      />

      {/* Reader Controls Toolbar */}
      <div style={{
        position: 'sticky',
        top: '4.25rem',
        zIndex: 40,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-light)',
        padding: '0.65rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          
          <button 
            onClick={onBack}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Feed</span>
          </button>

          {/* Reading Tools (TTS, Font, Like, Bookmark, Share) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            
            {/* Audio Narration */}
            {speechSynthesisAvailable && (
              <button 
                onClick={toggleSpeech}
                className={`btn ${isPlayingSpeech ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                title="Listen to Article with Audio Narration"
              >
                {isPlayingSpeech ? <Pause size={15} /> : <Volume2 size={15} />}
                <span>{isPlayingSpeech ? 'Pause Voice' : 'Listen Narration'}</span>
              </button>
            )}

            {/* Font Size Selector */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', padding: '0.15rem' }}>
              <button
                onClick={() => setFontSize('sm')}
                style={{ padding: '0.25rem 0.55rem', borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: fontSize === 'sm' ? '700' : '400', color: fontSize === 'sm' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                title="Small Text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                style={{ padding: '0.25rem 0.55rem', borderRadius: '0.35rem', fontSize: '0.85rem', fontWeight: fontSize === 'base' ? '700' : '400', color: fontSize === 'base' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                title="Standard Text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                style={{ padding: '0.25rem 0.55rem', borderRadius: '0.35rem', fontSize: '0.95rem', fontWeight: fontSize === 'lg' ? '700' : '400', color: fontSize === 'lg' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                title="Large Text"
              >
                A+
              </button>
            </div>

            {/* Like */}
            <button 
              onClick={() => onToggleLike(post.id)}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', borderColor: isLiked ? '#ef4444' : undefined }}
              title="Like Article"
            >
              <Heart size={15} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
              <span>{post.likes + (isLiked ? 1 : 0)}</span>
            </button>

            {/* Bookmark */}
            <button 
              onClick={() => onToggleBookmark(post.id)}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', borderColor: isBookmarked ? 'var(--accent-primary)' : undefined }}
              title={isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Article'}
            >
              <Bookmark size={15} fill={isBookmarked ? 'var(--accent-primary)' : 'none'} color={isBookmarked ? 'var(--accent-primary)' : 'currentColor'} />
            </button>

            {/* Share */}
            <button 
              onClick={() => onShare(post)}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem' }}
              title="Share"
            >
              <Share2 size={15} />
            </button>

            {/* Print */}
            <button 
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem' }}
              title="Print or Save PDF"
            >
              <Printer size={15} />
            </button>

          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container" style={{ marginTop: '2rem' }}>
        
        {/* Article Header */}
        <div style={{ maxWidth: '820px', margin: '0 auto 2.5rem auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-ai">{post.category}</span>
            <span className={`badge badge-difficulty ${post.difficulty.toLowerCase()}`}>{post.difficulty}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              • {post.readTimeMinutes} min estimated read
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              • Published on {post.publishDate}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.85rem)',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: '1rem'
          }}>
            {post.title}
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.75rem'
          }}>
            {post.subtitle}
          </p>

          {/* Author info card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-light)'
          }}>
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{post.author.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '500' }}>{post.author.role}</div>
              {post.author.bio && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{post.author.bio}</div>
              )}
            </div>
          </div>

        </div>

        {/* Hero Image */}
        <div style={{ maxWidth: '960px', margin: '0 auto 3rem auto', borderRadius: '1.25rem', overflow: 'hidden', maxHeight: '460px', boxShadow: 'var(--shadow-xl)' }}>
          <img 
            src={post.coverImage} 
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Content & Sidebar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: post.tableOfContents && post.tableOfContents.length > 0 ? '1fr 260px' : '1fr',
          gap: '3rem',
          maxWidth: '1080px',
          margin: '0 auto'
        }}>
          
          {/* Article Body */}
          <main style={{ fontSize: fontSizes[fontSize], minWidth: 0 }}>
            {renderFormattedContent()}

            {/* Embedded Interactive Quizzes */}
            {post.quizzes && post.quizzes.length > 0 && (
              <section style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '2px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.5rem',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Knowledge Check & Comprehension Quiz</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Test your understanding of the concepts covered in this lesson.</p>
                  </div>
                </div>

                {post.quizzes.map((quiz, qIndex) => {
                  const selectedIdx = selectedAnswers[quiz.id];
                  const isRevealed = revealedAnswers[quiz.id];

                  return (
                    <div key={quiz.id} className="quiz-widget">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: 'var(--accent-primary-light)',
                          color: 'var(--accent-primary)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          Question {qIndex + 1} of {post.quizzes!.length}
                        </span>
                      </div>

                      <p style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '1rem' }}>
                        {quiz.question}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {quiz.options.map((opt, optIdx) => {
                          let optionClass = 'quiz-option';
                          if (isRevealed) {
                            if (optIdx === quiz.correctIndex) {
                              optionClass += ' selected-correct';
                            } else if (selectedIdx === optIdx) {
                              optionClass += ' selected-wrong';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectQuizOption(quiz.id, optIdx, quiz.correctIndex)}
                              className={optionClass}
                              disabled={isRevealed}
                            >
                              <span style={{
                                width: '1.6rem',
                                height: '1.6rem',
                                borderRadius: '50%',
                                background: 'var(--bg-tertiary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                flexShrink: 0
                              }}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span style={{ flex: 1 }}>{opt}</span>
                              {isRevealed && optIdx === quiz.correctIndex && (
                                <CheckCircle2 size={18} color="#10b981" />
                              )}
                              {isRevealed && selectedIdx === optIdx && optIdx !== quiz.correctIndex && (
                                <XCircle size={18} color="#ef4444" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isRevealed && (
                        <div style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          background: selectedIdx === quiz.correctIndex ? 'var(--success-bg)' : 'var(--danger-bg)',
                          border: `1px solid ${selectedIdx === quiz.correctIndex ? 'var(--success)' : 'var(--danger)'}`,
                          fontSize: '0.9rem',
                          lineHeight: '1.5'
                        }}>
                          <div style={{ fontWeight: '700', marginBottom: '0.25rem', color: selectedIdx === quiz.correctIndex ? 'var(--success)' : 'var(--danger)' }}>
                            {selectedIdx === quiz.correctIndex ? '✓ Correct Explanation:' : '✗ Concept Explanation:'}
                          </div>
                          <div>{quiz.explanation}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {/* Embedded Flashcards Section */}
            {post.flashcards && post.flashcards.length > 0 && (
              <section style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Sparkles size={20} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Study Deck: Key Concept Flashcards</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Click or tap any card to flip and verify your recall of the terminology.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {post.flashcards.map((card) => {
                    const isFlipped = !!flippedCards[card.id];
                    return (
                      <div 
                        key={card.id} 
                        className="flashcard-scene"
                        onClick={() => handleToggleFlipCard(card.id)}
                      >
                        <div className={`flashcard-card ${isFlipped ? 'is-flipped' : ''}`}>
                          {/* Front */}
                          <div className="flashcard-face flashcard-front">
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                              Prompt / Question
                            </span>
                            <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{card.front}</p>
                            {card.hint && (
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Hint: {card.hint}</p>
                            )}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                              Click to flip ↺
                            </span>
                          </div>

                          {/* Back */}
                          <div className="flashcard-face flashcard-back">
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                              Definition / Answer
                            </span>
                            <p style={{ fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5' }}>{card.back}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                              Click to flip back ↺
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Discussion & Community Comments */}
            <section style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
                <MessageSquare size={22} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                  Community Discussion ({postComments.length})
                </h3>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.85rem',
                padding: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input 
                    type="text" 
                    placeholder="Your Name (e.g., Alex Johnson)"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    style={{
                      padding: '0.55rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-light)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Your Role (e.g., Student, ML Researcher)"
                    value={commentRole}
                    onChange={(e) => setCommentRole(e.target.value)}
                    style={{
                      padding: '0.55rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-light)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <textarea 
                  rows={3}
                  placeholder="Share a thought, ask a question, or provide additional insights..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical',
                    marginBottom: '0.75rem'
                  }}
                  required
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                    <Send size={15} />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {postComments.map((comment) => (
                  <div 
                    key={comment.id}
                    style={{
                      padding: '1.15rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img 
                          src={comment.avatar} 
                          alt={comment.authorName}
                          style={{ width: '2rem', height: '2rem', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{comment.authorName}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginLeft: '0.5rem' }}>{comment.authorRole}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comment.createdAt}</span>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0.5rem 0' }}>
                      {comment.content}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        className="btn-ghost" 
                        style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => showToast('Liked comment')}
                      >
                        <ThumbsUp size={13} />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </main>

          {/* Sticky Table of Contents Sidebar */}
          {post.tableOfContents && post.tableOfContents.length > 0 && (
            <aside className="reader-toc-aside">
              <div style={{
                position: 'sticky',
                top: '9rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.85rem',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  Table of Contents
                </div>

                <nav className="toc-list">
                  {post.tableOfContents.map((toc) => (
                    <a
                      key={toc.id}
                      href={`#${toc.id}`}
                      className="toc-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(toc.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {toc.title}
                    </a>
                  ))}
                </nav>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Article Stats
                  </div>
                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>📖 {post.readTimeMinutes} min read</div>
                    <div>❤️ {post.likes} learners liked</div>
                    <div>📝 {post.quizzes?.length || 0} interactive questions</div>
                  </div>
                </div>

              </div>
            </aside>
          )}

        </div>

      </div>
    </div>
  );
};
