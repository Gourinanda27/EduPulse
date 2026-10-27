import React from 'react';
import { BookOpen, Heart, Code2, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../data/initialPosts';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onOpenPublisher: () => void;
  totalPosts: number;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenPublisher,
  totalPosts
}) => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
      padding: '3.5rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <BookOpen size={16} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                EduPulse
              </span>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              An open, interactive educational publishing platform dedicated to deep technical and scientific comprehension through code, math, and peer collaboration.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
              <Sparkles size={14} />
              <span>{totalPosts} Published Lessons & Growing</span>
            </div>
          </div>

          {/* Subjects Directory */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Learning Tracks
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.875rem' }}>
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', textAlign: 'left' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--accent-primary)'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Authoring */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Educators & Writers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.875rem' }}>
              <li>
                <button 
                  onClick={onOpenPublisher}
                  style={{ color: 'var(--accent-primary)', fontWeight: '600' }}
                >
                  + Publish an Educational Post
                </button>
              </li>
              <li style={{ color: 'var(--text-secondary)' }}>Markdown & LaTeX Authoring</li>
              <li style={{ color: 'var(--text-secondary)' }}>Interactive Quiz Integration</li>
              <li style={{ color: 'var(--text-secondary)' }}>Code Execution Sandboxes</li>
              <li style={{ color: 'var(--text-secondary)' }}>Self-Paced Narration</li>
            </ul>
          </div>

          {/* Pedagogical Philosophy */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Educational Philosophy
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              "Real understanding is not the memorization of answers, but the intuition to reconstruct the reasoning from first principles."
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} EduPulse Educational Platform. All educational posts published under Open Access.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built with passion for curious minds</span>
            <Heart size={13} color="#ef4444" fill="#ef4444" />
          </div>
        </div>

      </div>
    </footer>
  );
};
