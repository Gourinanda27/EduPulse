import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Binary, 
  Calculator, 
  Atom, 
  Globe, 
  Dna, 
  Filter, 
  Clock, 
  Flame, 
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Category, Difficulty, Post } from '../types';
import { CATEGORIES } from '../data/initialPosts';

interface HeroProps {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedDifficulty: Difficulty;
  setSelectedDifficulty: (diff: Difficulty) => void;
  sortBy: 'latest' | 'popular' | 'readTime';
  setSortBy: (sort: 'latest' | 'popular' | 'readTime') => void;
  featuredPost?: Post;
  onSelectPost: (post: Post) => void;
  totalPosts: number;
}

export const Hero: React.FC<HeroProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  sortBy,
  setSortBy,
  featuredPost,
  onSelectPost,
  totalPosts
}) => {
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Artificial Intelligence': return <Sparkles size={15} />;
      case 'Computer Science': return <Binary size={15} />;
      case 'Mathematics': return <Calculator size={15} />;
      case 'Physics & Science': return <Atom size={15} />;
      case 'Web Development': return <Globe size={15} />;
      case 'Biology & Genetics': return <Dna size={15} />;
      default: return <Cpu size={15} />;
    }
  };

  return (
    <section style={{ padding: '2.5rem 0 1.5rem 0' }}>
      <div className="container">
        
        {/* Top Banner / Headline */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
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
            marginBottom: '1rem',
            border: '1px solid var(--accent-glow)'
          }}>
            <Sparkles size={14} />
            <span>Interactive Educational Publishing & Peer Learning</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            lineHeight: '1.15'
          }}>
            Deep Scientific & Technical Concepts,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Made Crystal Clear.
            </span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            Read peer-written educational posts with interactive math formulas, code execution, knowledge check quizzes, and audio read-aloud. Or publish your own research and lessons for learners worldwide.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={16} color="var(--accent-primary)" />
              <span><strong>{totalPosts}</strong> Verified Lessons</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} color="#10b981" />
              <span>Interactive Quizzes & Math</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="#f59e0b" />
              <span>Self-Paced Audio Narration</span>
            </div>
          </div>
        </div>

        {/* Featured Post Spotlight (if available) */}
        {featuredPost && (
          <div 
            onClick={() => onSelectPost(featuredPost)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              marginBottom: '3rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-lg)',
              transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
              <img 
                src={featuredPost.coverImage} 
                alt={featuredPost.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#fff',
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                <Flame size={14} />
                <span>Featured Deep Dive</span>
              </div>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                  <span className="badge badge-ai">
                    {featuredPost.category}
                  </span>
                  <span className={`badge badge-difficulty ${featuredPost.difficulty.toLowerCase()}`}>
                    {featuredPost.difficulty}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    • {featuredPost.readTimeMinutes} min read
                  </span>
                </div>

                <h2 style={{ fontSize: '1.65rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                  {featuredPost.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {featuredPost.subtitle}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img 
                    src={featuredPost.author.avatar} 
                    alt={featuredPost.author.name}
                    style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{featuredPost.author.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{featuredPost.author.role}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                  <span>Read Article</span>
                  <ArrowUpRight size={18} />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? '700' : '500',
                    whiteSpace: 'nowrap',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-light)',
                    background: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 2px 8px var(--accent-glow)' : 'none'
                  }}
                >
                  {getCategoryIcon(cat)}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'var(--bg-secondary)',
          borderRadius: '0.85rem',
          border: '1px solid var(--border-light)',
          marginBottom: '2rem'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Filter size={15} />
              <span>Difficulty:</span>
            </div>
            
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: selectedDifficulty === diff ? '600' : '500',
                  background: selectedDifficulty === diff ? 'var(--bg-tertiary)' : 'transparent',
                  color: selectedDifficulty === diff ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: selectedDifficulty === diff ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                {diff}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="latest">Latest Published</option>
              <option value="popular">Most Liked / Popular</option>
              <option value="readTime">Quickest Reads</option>
            </select>
          </div>

        </div>

      </div>
    </section>
  );
};
