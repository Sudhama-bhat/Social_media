import Sidebar from '../components/Sidebar';
import { User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <div className="glass-panel animate-fade-in" style={styles.card}>
          <div style={styles.avatarBig}>
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={36} />}
          </div>
          <h2 style={{ marginBottom: '0.25rem' }}>{user?.name || 'User'}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            @{user?.name?.toLowerCase().replace(/\s/g, '') || 'user'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Profile editing coming soon!</p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh' },
  main: { flex: 1, marginLeft: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { padding: '3rem', textAlign: 'center', maxWidth: '420px', width: '100%' },
  avatarBig: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '2rem',
    margin: '0 auto 1rem',
    boxShadow: '0 0 30px rgba(139,92,246,0.4)',
  },
};

export default Profile;
