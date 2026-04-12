import Sidebar from '../components/Sidebar';
import { Compass } from 'lucide-react';

const Explore = () => (
  <div style={styles.layout}>
    <Sidebar />
    <main style={styles.main}>
      <div className="glass-panel animate-fade-in" style={styles.card}>
        <div style={styles.iconWrap}><Compass size={40} color="var(--primary-color)" /></div>
        <h2>Explore</h2>
        <p style={{ color: 'var(--text-muted)' }}>Discover posts and people — coming soon!</p>
      </div>
    </main>
  </div>
);

const styles = {
  layout: { display: 'flex', minHeight: '100vh' },
  main: { flex: 1, marginLeft: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { padding: '3rem', textAlign: 'center', maxWidth: '420px' },
  iconWrap: { marginBottom: '1rem' },
};

export default Explore;
