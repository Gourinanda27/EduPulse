import React from 'react';
import { 
  Clock, 
  Heart, 
  Bookmark, 
  Share2, 
  ArrowRight, 
  Eye, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (postId: string, e: React.MouseEvent) => void;
  onToggleLike: (postId: string, e: React.MouseEvent) => void;
  onShare: (post: Post, e: React.MouseEvent) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onSelect,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onShare
}) => {
  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'Artificial Intelligence': return 'badge-ai';
      case 'Computer Science': return 'badge-cs';
      case 'Mathematics': return 'badge-math';
      case 'Physics & Science': return 'badge-physics';
      case 'Web Development': return 'badge-web';
      case 'Biology & Genetics': return 'badge-bio';
      default: return 'badge-cs';
    }
  };

  return (
    <article 
      className="post-card"
      onClick={() => onSelect(post)}
      style={{ cursor: 'pointer' }}
    >
      {/* Image & Badges */}
      <div className="post-card-image-wrap">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="post-card-image"
          loading="lazy"
        />
        
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap'
        }}>
          <span className={`badge ${getCategoryClass(post.category)}`} style={{ backdropFilter: 'blur(8px)', background: 'var(--bg-glass)' }}>
            {post.category}
          </span>
          <span className={`badge badge-difficulty ${post.difficulty.toLowerCase()}`} style={{ backdropFilter: 'blur(8px)' }}>
            {post.difficulty}
          </span>
        </div>

        {/* Read Time Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          right: '0.75rem',
          background: 'rgba(0, 0, 0, 0.75)',
          color: '#ffffff',
          padding: '0.2rem 0.55rem',
          borderRadius: '999px',
          fontSize: '0.7rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          backdropFilter: 'blur(4px)'
        }}>
          <Clock size={12} />
          <span>{post.readTimeMinutes} min</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="post-card-body">
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {post.publishDate}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {post.quizzes && post.quizzes.length > 0 && (
              <span title={`${post.quizzes.length} Interactive Quizzes`} style={{
                fontSize: '0.7rem',
                color: 'var(--accent-primary)',
                background: 'var(--accent-primary-light)',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <CheckCircle2 size={11} />
                <span>Quiz</span>
              </span>
            )}
          </div>
        </div>

        <h3 className="post-card-title">
          {post.title}
        </h3>

        <p className="post-card-subtitle">
          {post.subtitle}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {post.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-tertiary)',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px'
              }}
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer Meta (Author + Actions) */}
        <div className="post-card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              style={{ width: '1.85rem', height: '1.85rem', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                {post.author.name}
              </div>
            </div>
          </div>

          {/* Action buttons (Like, Bookmark, Share) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onToggleLike(post.id, e)}
              className="btn-icon"
              style={{ padding: '0.35rem', borderColor: isLiked ? '#ef4444' : undefined }}
              title="Like Post"
            >
              <Heart 
                size={14} 
                fill={isLiked ? '#ef4444' : 'none'} 
                color={isLiked ? '#ef4444' : 'currentColor'} 
              />
              <span style={{ fontSize: '0.7rem', marginLeft: '0.2rem', fontWeight: '600' }}>
                {post.likes + (isLiked ? 1 : 0)}
              </span>
            </button>

            <button
              onClick={(e) => onToggleBookmark(post.id, e)}
              className="btn-icon"
              style={{ padding: '0.35rem', borderColor: isBookmarked ? 'var(--accent-primary)' : undefined }}
              title={isBookmarked ? 'Remove Bookmark' : 'Save for Later'}
            >
              <Bookmark 
                size={14} 
                fill={isBookmarked ? 'var(--accent-primary)' : 'none'} 
                color={isBookmarked ? 'var(--accent-primary)' : 'currentColor'} 
              />
            </button>

            <button
              onClick={(e) => onShare(post, e)}
              className="btn-icon"
              style={{ padding: '0.35rem' }}
              title="Share"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
