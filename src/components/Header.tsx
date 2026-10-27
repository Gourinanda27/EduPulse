import React from 'react';
import { 
  BookOpen, 
  Search, 
  PenTool, 
  Sun, 
  Moon, 
  Bookmark, 
  Code, 
  GraduationCap, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  activeTab: 'articles' | 'quizzes' | 'sandbox' | 'bookmarks';
  setActiveTab: (tab: 'articles' | 'quizzes' | 'sandbox' | 'bookmarks') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenPublisher: () => void;
  bookmarkCount: number;
  totalPostsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  onOpenPublisher,
  bookmarkCount,
  totalPostsCount
}) => {
  return (
    <header className="glass-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.25rem', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('articles')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                EduPulse
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Publish
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1 }}>
              Educational Hub & Publishing Platform
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="header-search-wrap" style={{ position: 'relative', flex: '1', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={`Search across ${totalPostsCount} educational posts, topics, concepts...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.4rem',
              borderRadius: '0.65rem',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
          />
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button 
            className={`btn ${activeTab === 'articles' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('articles')}
            style={activeTab === 'articles' ? { borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' } : {}}
          >
            <LayoutGrid size={16} />
            <span>Articles</span>
          </button>

          <button 
            className={`btn ${activeTab === 'quizzes' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('quizzes')}
            style={activeTab === 'quizzes' ? { borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' } : {}}
          >
            <GraduationCap size={16} />
            <span>Quiz Hub</span>
          </button>

          <button 
            className={`btn ${activeTab === 'sandbox' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('sandbox')}
            style={activeTab === 'sandbox' ? { borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' } : {}}
          >
            <Code size={16} />
            <span>Lab / Sandbox</span>
          </button>

          <button 
            className={`btn ${activeTab === 'bookmarks' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('bookmarks')}
            style={activeTab === 'bookmarks' ? { borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' } : {}}
            title="Saved Bookmarks"
          >
            <Bookmark size={16} />
            <span>Bookmarks</span>
            {bookmarkCount > 0 && (
              <span style={{
                fontSize: '0.7rem',
                background: 'var(--accent-primary)',
                color: '#fff',
                padding: '0.1rem 0.4rem',
                borderRadius: '999px',
                fontWeight: '700'
              }}>
                {bookmarkCount}
              </span>
            )}
          </button>
        </nav>

        {/* Actions (Publish + Theme) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="btn btn-icon" 
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
          </button>

          <button 
            className="btn btn-primary"
            onClick={onOpenPublisher}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <PenTool size={16} />
            <span>Publish Post</span>
          </button>
        </div>

      </div>
    </header>
  );
};
