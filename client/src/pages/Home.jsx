import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { RefreshCw } from 'lucide-react';
import api from '../api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get('/post/all');
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    // Optimistically add to top of feed, then fetch proper data with populated users
    fetchPosts();
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      
      <main style={styles.mainContent}>
        <div style={styles.header}>
          <h2>Home</h2>
          <button 
            onClick={fetchPosts} 
            style={styles.refreshBtn}
            title="Refresh Feed"
          >
            <RefreshCw size={20} className={isRefreshing ? "spin-animation" : ""} />
          </button>
        </div>

        <div style={styles.feedColumn}>
          <CreatePost onPostCreated={handlePostCreated} />

          {isLoading ? (
            <div style={styles.loader}>Loading feed...</div>
          ) : posts.length > 0 ? (
            <div className="animate-fade-in">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={styles.emptyState}>
              <p>No posts yet. Be the first to share something!</p>
            </div>
          )}
        </div>
      </main>

      {/* Optional Right Sidebar for Suggestions/Trending */}
      <aside style={styles.rightSidebar}>
        {/* Placeholder for future features */}
      </aside>

      <style>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
  },
  mainContent: {
    flex: 1,
    marginLeft: '280px', // width of sidebar
    display: 'flex',
    justifyContent: 'center',
    padding: '0 2rem',
  },
  feedColumn: {
    width: '100%',
    maxWidth: '680px',
    padding: '0 1rem',
    marginTop: '5rem', // space for fixed header
  },
  header: {
    padding: '1rem 2rem',
    position: 'fixed',
    top: 0,
    background: 'rgba(15, 17, 21, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--glass-border)',
    width: 'calc(100% - 280px - 320px)', // adjust for both sidebars
    maxWidth: '680px',
    zIndex: 5,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-color)',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--text-muted)',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
  },
  rightSidebar: {
    width: '320px',
    display: 'none', // hidden by default, enable for large screens
  }
};

export default Home;
