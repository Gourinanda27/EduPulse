import React, { useState, useEffect } from 'react';
import { Post, Category, Difficulty, Comment, UserStats } from './types';
import { INITIAL_POSTS } from './data/initialPosts';
import { INITIAL_COMMENTS } from './data/initialComments';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PostCard } from './components/PostCard';
import { PostReader } from './components/PostReader';
import { PostPublisher } from './components/PostPublisher';
import { QuizHub } from './components/QuizHub';
import { CodeSandbox } from './components/CodeSandbox';
import { BookmarksView } from './components/BookmarksView';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

export function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('edupulse_theme') as 'light' | 'dark') || 'dark';
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<'articles' | 'quizzes' | 'sandbox' | 'bookmarks'>('articles');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPublisherOpen, setIsPublisherOpen] = useState(false);
  const [sandboxCode, setSandboxCode] = useState<string | undefined>(undefined);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'readTime'>('latest');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Posts State (with LocalStorage persistence)
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('edupulse_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading posts from localStorage', e);
    }
    return INITIAL_POSTS;
  });

  // Comments State (with LocalStorage persistence)
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem('edupulse_comments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading comments from localStorage', e);
    }
    return INITIAL_COMMENTS;
  });

  // User Stats (Bookmarks & Likes)
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('edupulse_user_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading user stats', e);
    }
    return {
      bookmarkedPostIds: ['post-1', 'post-5'],
      likedPostIds: ['post-1'],
      completedQuizzes: {},
      recentReadPostIds: []
    };
  });

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edupulse_theme', theme);
  }, [theme]);

  // Sync posts
  useEffect(() => {
    localStorage.setItem('edupulse_posts', JSON.stringify(posts));
  }, [posts]);

  // Sync comments
  useEffect(() => {
    localStorage.setItem('edupulse_comments', JSON.stringify(comments));
  }, [comments]);

  // Sync user stats
  useEffect(() => {
    localStorage.setItem('edupulse_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleBookmark = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUserStats(prev => {
      const exists = prev.bookmarkedPostIds.includes(postId);
      const updated = exists 
        ? prev.bookmarkedPostIds.filter(id => id !== postId)
        : [...prev.bookmarkedPostIds, postId];
      
      showToast(exists ? 'Removed from bookmarks' : 'Saved to reading bookmarks! 🔖');
      return { ...prev, bookmarkedPostIds: updated };
    });
  };

  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUserStats(prev => {
      const exists = prev.likedPostIds.includes(postId);
      const updated = exists
        ? prev.likedPostIds.filter(id => id !== postId)
        : [...prev.likedPostIds, postId];

      // Update post likes counter
      setPosts(currentPosts => 
        currentPosts.map(p => {
          if (p.id === postId) {
            return { ...p, likes: p.likes + (exists ? -1 : 1) };
          }
          return p;
        })
      );

      showToast(exists ? 'Unliked article' : 'Thank you for liking this article! ❤️');
      return { ...prev, likedPostIds: updated };
    });
  };

  const handleShare = (post: Post, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.subtitle,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard! 📋');
    }
  };

  const handleAddComment = (postId: string, authorName: string, authorRole: string, content: string) => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      postId,
      authorName,
      authorRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      content,
      createdAt: 'Just now',
      likes: 0
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handlePublishPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setSelectedPost(newPost);
  };

  const handleExportPosts = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `edupulse-articles-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported all articles as JSON file!');
  };

  const handleImportPosts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0) {
          // Merge avoiding ID collisions
          const existingIds = new Set(posts.map(p => p.id));
          const newItems = imported.filter((item: any) => item.id && item.title && !existingIds.has(item.id));
          setPosts(prev => [...newItems, ...prev]);
          showToast(`Imported ${newItems.length} educational articles successfully!`);
        } else {
          showToast('Invalid JSON file format.');
        }
      } catch (err) {
        showToast('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleOpenSandboxWithCode = (code: string) => {
    setSandboxCode(code);
    setActiveTab('sandbox');
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Sent code snippet to Sandbox Lab! 🧪');
  };

  // Filtered & Sorted Posts
  const filteredPosts = posts.filter(post => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(q);
      const matchesSubtitle = post.subtitle.toLowerCase().includes(q);
      const matchesTag = post.tags.some(t => t.toLowerCase().includes(q));
      const matchesAuthor = post.author.name.toLowerCase().includes(q);
      const matchesCategory = post.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesSubtitle && !matchesTag && !matchesAuthor && !matchesCategory) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'All' && post.category !== selectedCategory) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All' && post.difficulty !== selectedDifficulty) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'readTime') return a.readTimeMinutes - b.readTimeMinutes;
    // 'latest'
    return 0; // Natural sequence
  });

  const featuredPost = posts.find(p => p.featured) || posts[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedPost(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (activeTab !== 'articles') setActiveTab('articles');
          if (selectedPost) setSelectedPost(null);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenPublisher={() => setIsPublisherOpen(true)}
        bookmarkCount={userStats.bookmarkedPostIds.length}
        totalPostsCount={posts.length}
      />

      {/* Main View Router */}
      {selectedPost ? (
        /* Dedicated Full Article Reader */
        <PostReader
          post={selectedPost}
          onBack={() => {
            setSelectedPost(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isBookmarked={userStats.bookmarkedPostIds.includes(selectedPost.id)}
          isLiked={userStats.likedPostIds.includes(selectedPost.id)}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          onShare={handleShare}
          comments={comments}
          onAddComment={handleAddComment}
          onOpenSandboxWithCode={handleOpenSandboxWithCode}
          showToast={showToast}
        />
      ) : activeTab === 'quizzes' ? (
        /* Quiz Hub Testing Center */
        <QuizHub 
          posts={posts} 
          onSelectPost={(post) => setSelectedPost(post)} 
          showToast={showToast} 
        />
      ) : activeTab === 'sandbox' ? (
        /* Interactive Simulation / Code Sandbox */
        <CodeSandbox 
          initialCode={sandboxCode} 
          showToast={showToast} 
        />
      ) : activeTab === 'bookmarks' ? (
        /* Saved Articles / Reading List */
        <BookmarksView
          posts={posts}
          bookmarkedIds={userStats.bookmarkedPostIds}
          likedIds={userStats.likedPostIds}
          onSelectPost={(post) => setSelectedPost(post)}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          onShare={handleShare}
          onClearBookmarks={() => {
            setUserStats(prev => ({ ...prev, bookmarkedPostIds: [] }));
            showToast('Cleared reading bookmarks');
          }}
          onGoToFeed={() => setActiveTab('articles')}
        />
      ) : (
        /* Feed View (Articles + Hero) */
        <main style={{ flex: 1, paddingBottom: '4rem' }}>
          
          <Hero
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            sortBy={sortBy}
            setSortBy={setSortBy}
            featuredPost={searchQuery || selectedCategory !== 'All' ? undefined : featuredPost}
            onSelectPost={(post) => setSelectedPost(post)}
            totalPosts={posts.length}
          />

          {/* Articles Grid */}
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                {selectedCategory === 'All' ? 'All Published Lessons' : `${selectedCategory} Articles`}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400', marginLeft: '0.5rem' }}>
                  ({filteredPosts.length})
                </span>
              </h2>

              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem' }}
                >
                  Clear search "{searchQuery}"
                </button>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'var(--bg-card)',
                borderRadius: '1rem',
                border: '1px solid var(--border-light)'
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  No educational posts found matching your search and filter criteria.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
                  className="btn btn-secondary"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="cards-grid">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelect={(p) => {
                      setSelectedPost(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    isBookmarked={userStats.bookmarkedPostIds.includes(post.id)}
                    isLiked={userStats.likedPostIds.includes(post.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onToggleLike={handleToggleLike}
                    onShare={handleShare}
                  />
                ))}
              </div>
            )}

          </div>

        </main>
      )}

      {/* Global Author Studio / Publish Modal */}
      <PostPublisher
        isOpen={isPublisherOpen}
        onClose={() => setIsPublisherOpen(false)}
        onPublish={handlePublishPost}
        onExportPosts={handleExportPosts}
        onImportPosts={handleImportPosts}
        showToast={showToast}
      />

      {/* Toast Alert */}
      <Toast message={toastMessage} />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('articles');
          setSelectedPost(null);
        }}
        onOpenPublisher={() => setIsPublisherOpen(true)}
        totalPosts={posts.length}
      />

    </div>
  );
}

export default App;
