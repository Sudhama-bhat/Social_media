import { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  
  // Format the date
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    // In a real app, you would make an API call here.
  };
  
  // Backend provides relative path like uploads/date-file.jpg
  // We prepend the backend URL unless it's already an absolute URL (like cloudinary)
    // Prefixes the media URL if necessary. On Vercel, relative paths work due to rewrites.
    const normalizedPath = url.replace(/\\/g, '/');
    return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  };

  return (
    <div className="glass-panel" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {post.userId?.name ? post.userId.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <div style={styles.userName}>{post.userId?.name || 'Unknown User'}</div>
          <div style={styles.metaData}>
            <span>{date}</span>
            {post.location && (
              <>
                <span style={{margin: '0 4px'}}>•</span>
                <MapPin size={12} style={{display: 'inline', marginRight: '2px'}}/>
                <span>{post.location}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <p style={{marginTop: 0, marginBottom: '1rem', lineHeight: 1.5}}>
          {post.caption}
        </p>

        {post.media && post.media.length > 0 && (
          <div style={styles.mediaContainer}>
            {post.media[0].mediaType === 'image' ? (
              <img 
                src={getMediaUrl(post.media[0].mediaUrl)} 
                alt="Post Media" 
                style={styles.media}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <video 
                src={getMediaUrl(post.media[0].mediaUrl)} 
                controls 
                style={styles.media} 
              />
            )}
          </div>
        )}
      </div>

      <div style={styles.actions}>
        <button 
          style={{...styles.actionBtn, color: isLiked ? '#ef4444' : 'var(--text-muted)'}} 
          onClick={handleLike}
        >
          <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} />
          <span>{likesCount}</span>
        </button>
        
        <button style={styles.actionBtn}>
          <MessageCircle size={20} />
          <span>{post.commentsCount || 0}</span>
        </button>
        
        <button style={styles.actionBtn}>
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '1.5rem',
    marginBottom: '1.5rem',
    transition: 'transform 0.2s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1rem',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  userName: {
    fontWeight: 600,
    fontSize: '1.05rem',
  },
  metaData: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  content: {
    marginBottom: '1rem',
  },
  mediaContainer: {
    borderRadius: '12px',
    overflow: 'hidden',
    marginTop: '0.5rem',
    maxHeight: '500px',
    background: '#000',
  },
  media: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    display: 'block',
  },
  actions: {
    display: 'flex',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1rem',
    gap: '2rem',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  }
};

export default PostCard;
