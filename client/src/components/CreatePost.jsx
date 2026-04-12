import { useState, useContext } from 'react';
import { Image, Video, MapPin, Send, X } from 'lucide-react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !media) return;
    setError('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('caption', caption);
    if (location) formData.append('location', location);
    if (media) formData.append('media', media);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/post/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.data.success) {
        setCaption('');
        setLocation('');
        setMedia(null);
        setPreview(null);
        if (onPostCreated) onPostCreated(res.data.data);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      const msg = err.response?.data?.message || 'Failed to create post. Are you logged in?';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.top}>
        <div style={styles.avatar}>{avatarLetter}</div>
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <textarea
            style={styles.textarea}
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />

          {error && <div style={styles.error}>{error}</div>}

          {preview && (
            <div style={styles.previewContainer}>
              <img src={preview} alt="Preview" style={styles.previewImage} />
              <button type="button" onClick={() => { setMedia(null); setPreview(null); }} style={styles.removePreviewBtn}>
                <X size={16} />
              </button>
            </div>
          )}

          <div style={styles.actionsBox}>
            <div style={styles.mediaActions}>
              <label style={styles.iconBtn} title="Add Photo">
                <Image size={20} color="#10b981" />
                <input type="file" accept="image/*" hidden onChange={handleMediaChange} />
              </label>
              <label style={styles.iconBtn} title="Add Video">
                <Video size={20} color="#3b82f6" />
                <input type="file" accept="video/*" hidden onChange={handleMediaChange} />
              </label>
              <div style={styles.locationWrapper}>
                <MapPin size={16} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={styles.locationInput}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={styles.submitBtn}
              disabled={isLoading || (!caption.trim() && !media)}
            >
              {isLoading ? 'Posting...' : <><Send size={16} /> Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '1.5rem', marginBottom: '1.5rem' },
  top: { display: 'flex', gap: '1rem', alignItems: 'flex-start' },
  avatar: {
    width: '44px',
    height: '44px',
    minWidth: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  textarea: {
    width: '100%',
    background: 'rgba(0,0,0,0.15)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0.85rem 1rem',
    color: 'var(--text-color)',
    fontFamily: 'var(--font-main)',
    fontSize: '0.95rem',
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
    border: '1px solid rgba(239,68,68,0.2)',
  },
  previewContainer: {
    position: 'relative',
    marginTop: '0.75rem',
    borderRadius: '12px',
    overflow: 'hidden',
    maxHeight: '260px',
  },
  previewImage: { width: '100%', height: 'auto', objectFit: 'cover', display: 'block' },
  removePreviewBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border-color)',
  },
  mediaActions: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  iconBtn: {
    cursor: 'pointer',
    padding: '7px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  locationWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  locationInput: {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '5px 10px 5px 28px',
    color: 'white',
    fontSize: '0.8rem',
    width: '110px',
    outline: 'none',
    fontFamily: 'var(--font-main)',
  },
  submitBtn: { padding: '0.45rem 1.1rem', fontSize: '0.9rem', gap: '6px' },
};

export default CreatePost;
