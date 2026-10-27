import React from 'react';
import { Bookmark, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { Post } from '../types';
import { PostCard } from './PostCard';

interface BookmarksViewProps {
  posts: Post[];
  bookmarkedIds: string[];
  likedIds: string[];
  onSelectPost: (post: Post) => void;
  onToggleBookmark: (postId: string, e: React.MouseEvent) => void;
  onToggleLike: (postId: string, e: React.MouseEvent) => void;
  onShare: (post: Post, e: React.MouseEvent) => void;
  onClearBookmarks: () => void;
  onGoToFeed: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  posts,
  bookmarkedIds,
  likedIds,
  onSelectPost,
  onToggleBookmark,
  onToggleLike,
  onShare,
  onClearBookmarks,
  onGoToFeed
}) => {
  const bookmarkedPosts = posts.filter(p => bookmarkedIds.includes(p.id));

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--border-light)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            background: 'var(--accent-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)'
          }}>
            <Bookmark size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: 1.2 }}>
              Your Reading List & Bookmarks
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {bookmarkedPosts.length} saved educational {bookmarkedPosts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>

        {bookmarkedPosts.length > 0 && (
          <button 
            onClick={onClearBookmarks}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
          >
            <Trash2 size={14} />
            <span>Clear Reading List</span>
          </button>
        )}
      </div>

      {bookmarkedPosts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          background: 'var(--bg-card)',
          borderRadius: '1.25rem',
          border: '1px dashed var(--border-color)',
          maxWidth: '560px',
          margin: '2rem auto'
        }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            color: 'var(--text-muted)'
          }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            No saved articles yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            While exploring lessons, click the bookmark icon on any card to save it here for offline study and reference.
          </p>
          <button onClick={onGoToFeed} className="btn btn-primary">
            <span>Explore Educational Feed</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {bookmarkedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={onSelectPost}
              isBookmarked={true}
              isLiked={likedIds.includes(post.id)}
              onToggleBookmark={onToggleBookmark}
              onToggleLike={onToggleLike}
              onShare={onShare}
            />
          ))}
        </div>
      )}

    </div>
  );
};
