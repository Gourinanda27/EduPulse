import React, { useState } from 'react';
import { 
  X, 
  PenTool, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  Code, 
  Sparkles, 
  HelpCircle, 
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react';
import { Post, Category, Difficulty, QuizQuestion, Flashcard } from '../types';
import { CATEGORIES } from '../data/initialPosts';

interface PostPublisherProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newPost: Post) => void;
  onExportPosts: () => void;
  onImportPosts: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToast: (msg: string) => void;
}

const PRESET_COVERS = [
  { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Algorithms & Code', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quantum & Physics', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Web Architecture', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Genetics & Bio', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mathematics', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80' }
];

export const PostPublisher: React.FC<PostPublisherProps> = ({
  isOpen,
  onClose,
  onPublish,
  onExportPosts,
  onImportPosts,
  showToast
}) => {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  
  // Post fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Category>('Computer Science');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [readTimeMinutes, setReadTimeMinutes] = useState(6);
  const [authorName, setAuthorName] = useState('Prof. Alan Wright');
  const [authorRole, setAuthorRole] = useState('Educator & Researcher');
  const [authorBio, setAuthorBio] = useState('Passionate about making complex systems simple to comprehend.');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [tagsInput, setTagsInput] = useState('Education, STEM, Algorithms');
  
  // Content
  const [content, setContent] = useState(`## Introduction

Start with an intuitive hook or thought experiment that illustrates the core educational question.

> [!NOTE]
> This is a key conceptual note for learners.

---

## Core Principles & Fundamentals

Explain the mechanics, logic, and mathematics step-by-step:

$$E = m c^2$$

\`\`\`python
# Example educational code snippet
def calculate_growth(initial, rate, time):
    return initial * (1 + rate) ** time
\`\`\`

---

## Summary & Key Takeaways

1. First critical takeaway.
2. Second critical takeaway.
`);

  // Attached Quizzes
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([
    {
      id: 'quiz-1',
      question: 'What is the primary objective of this lesson?',
      options: [
        'To memorize formulas without derivation',
        'To build intuitive understanding through structured reasoning',
        'To test memory recall only',
        'None of the above'
      ],
      correctIndex: 1,
      explanation: 'Educational deep-dives prioritize intuition and structured reasoning over brute memorization.'
    }
  ]);

  if (!isOpen) return null;

  const insertSnippet = (snippet: string) => {
    setContent(prev => prev + '\n' + snippet + '\n');
    showToast('Template snippet inserted into content');
  };

  const handleAddQuiz = () => {
    const newQuiz: QuizQuestion = {
      id: `quiz-${Date.now()}`,
      question: 'New comprehension question?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: 'Explanation for why Option A is correct.'
    };
    setQuizzes([...quizzes, newQuiz]);
  };

  const handleUpdateQuiz = (index: number, updated: Partial<QuizQuestion>) => {
    const next = [...quizzes];
    next[index] = { ...next[index], ...updated };
    setQuizzes(next);
  };

  const handleRemoveQuiz = (index: number) => {
    setQuizzes(quizzes.filter((_, i) => i !== index));
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a title for the educational post.');
      return;
    }
    if (!content.trim()) {
      showToast('Please provide some content for the lesson.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const newPost: Post = {
      id: `post-${Date.now()}`,
      slug,
      title: title.trim(),
      subtitle: subtitle.trim() || 'A structured exploration of fundamental principles.',
      category: category === 'All' ? 'Computer Science' : category,
      difficulty: difficulty === 'All' ? 'Intermediate' : difficulty,
      readTimeMinutes: Number(readTimeMinutes) || 5,
      publishDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: {
        name: authorName.trim() || 'Guest Educator',
        role: authorRole.trim() || 'Contributing Scholar',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: authorBio.trim()
      },
      coverImage,
      tags: tags.length > 0 ? tags : ['Educational', category],
      likes: 1,
      views: 1,
      content,
      quizzes: quizzes.filter(q => q.question.trim().length > 0)
    };

    onPublish(newPost);
    showToast('Educational post published successfully!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '960px', height: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <PenTool size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Author Studio & Article Publisher</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Publish peer-reviewed educational articles and interactive lessons</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', padding: '0.2rem' }}>
              <button
                type="button"
                onClick={() => setActiveView('editor')}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: activeView === 'editor' ? 'var(--bg-card)' : 'transparent',
                  color: activeView === 'editor' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                <Edit3 size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveView('preview')}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: activeView === 'preview' ? 'var(--bg-card)' : 'transparent',
                  color: activeView === 'preview' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                <Eye size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />
                Preview
              </button>
            </div>

            <button 
              onClick={onClose}
              className="btn-icon"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
          {activeView === 'editor' ? (
            <form id="publishForm" onSubmit={handlePublishSubmit}>
              
              {/* Basic Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Article Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Demystifying Dynamic Programming with Memoization"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Subject Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle / Abstract */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  Subtitle / Abstract Summary
                </label>
                <input
                  type="text"
                  placeholder="A one-sentence conceptual hook summarizing what the learner will gain."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Difficulty & Read Time & Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Est. Reading Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Algorithms, Python, Recursion"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Author Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Author Role / Title
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Cover Image Picker */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  Cover Image URL or Select Preset
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: '0.35rem',
                        fontSize: '0.75rem',
                        border: '1px solid var(--border-light)',
                        background: coverImage === preset.url ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        color: coverImage === preset.url ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Editor Toolbar */}
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>
                    Article Content (Markdown Supported) *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Supports LaTeX equations ($$...$$), callouts, and code blocks
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  border: '1px solid var(--border-color)',
                  borderBottom: 'none',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => insertSnippet('## Section Title\n')}
                  >
                    H2 Heading
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => insertSnippet('### Subsection Title\n')}
                  >
                    H3 Heading
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => insertSnippet('```python\n# Python code here\nprint("Hello World")\n```')}
                  >
                    <Code size={12} /> Code Block
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => insertSnippet('$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$')}
                  >
                    Math Equation
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => insertSnippet('> [!NOTE]\n> Key conceptual takeaway for the student.')}
                  >
                    Note Callout
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => insertSnippet('> [!TIP]\n> Pro-tip or performance optimization rule.')}
                  >
                    Tip Callout
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => insertSnippet('> [!WARNING]\n> Common pitfall to avoid.')}
                  >
                    Warning Callout
                  </button>
                </div>

                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0 0 0.5rem 0.5rem',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                  }}
                  required
                />
              </div>

              {/* Attached Quizzes Builder */}
              <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HelpCircle size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Attached Comprehension Quizzes ({quizzes.length})</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddQuiz}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <Plus size={13} />
                    <span>Add Question</span>
                  </button>
                </div>

                {quizzes.map((quiz, qIdx) => (
                  <div key={quiz.id} style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                        Question {qIdx + 1}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveQuiz(qIdx)}
                        className="btn-ghost"
                        style={{ color: '#ef4444', padding: '0.2rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input 
                      type="text"
                      placeholder="Question text..."
                      value={quiz.question}
                      onChange={(e) => handleUpdateQuiz(qIdx, { question: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', marginBottom: '0.5rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {quiz.options.map((opt, optIdx) => (
                        <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input 
                            type="radio" 
                            name={`correct-${quiz.id}`}
                            checked={quiz.correctIndex === optIdx}
                            onChange={() => handleUpdateQuiz(qIdx, { correctIndex: optIdx })}
                            title="Select as correct answer"
                          />
                          <input 
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...quiz.options];
                              newOpts[optIdx] = e.target.value;
                              handleUpdateQuiz(qIdx, { options: newOpts });
                            }}
                            style={{ flex: 1, padding: '0.4rem', borderRadius: '0.35rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                          />
                        </div>
                      ))}
                    </div>

                    <input 
                      type="text"
                      placeholder="Explanation for the correct choice..."
                      value={quiz.explanation}
                      onChange={(e) => handleUpdateQuiz(qIdx, { explanation: e.target.value })}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                    />
                  </div>
                ))}
              </div>

            </form>
          ) : (
            /* Live Preview Screen */
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <span className="badge badge-ai" style={{ marginRight: '0.5rem' }}>{category}</span>
                <span className={`badge badge-difficulty ${difficulty.toLowerCase()}`}>{difficulty}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  • {readTimeMinutes} min read
                </span>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '1rem 0 0.5rem 0' }}>
                  {title || 'Untitled Educational Post'}
                </h1>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
                  {subtitle || 'No subtitle provided.'}
                </p>
              </div>

              {coverImage && (
                <div style={{ borderRadius: '0.75rem', overflow: 'hidden', height: '300px', marginBottom: '2rem' }}>
                  <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
                {content}
              </div>

              {quizzes.length > 0 && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>Quiz Preview ({quizzes.length} questions)</h3>
                  {quizzes.map((q, idx) => (
                    <div key={idx} style={{ marginTop: '0.75rem' }}>
                      <p style={{ fontWeight: '600' }}>{idx + 1}. {q.question}</p>
                      <ul style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {q.options.map((opt, oIdx) => (
                          <li key={oIdx} style={{ color: oIdx === q.correctIndex ? '#10b981' : undefined, fontWeight: oIdx === q.correctIndex ? '700' : '400' }}>
                            {opt} {oIdx === q.correctIndex && '✓ (Correct)'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer (Data Management + Publish CTA) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.75rem',
          borderTop: '1px solid var(--border-light)',
          background: 'var(--bg-secondary)'
        }}>
          {/* Export / Import Data */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              type="button" 
              onClick={onExportPosts} 
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              title="Export all posts to JSON backup"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>

            <label 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}
              title="Import posts from JSON backup"
            >
              <Upload size={14} />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={onImportPosts} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="publishForm" 
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
            >
              <PenTool size={16} />
              <span>Publish Article Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
