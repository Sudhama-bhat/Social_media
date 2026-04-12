import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Compass, Bell, MessageSquare, User, LogOut, PlusSquare } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <Compass size={24} />, label: 'Explore', path: '/explore' },
    { icon: <Bell size={24} />, label: 'Notifications', path: '/notifications' },
    { icon: <MessageSquare size={24} />, label: 'Messages', path: '/messages' },
    { icon: <PlusSquare size={24} />, label: 'Create', path: '/create' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="glass-panel" style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}></div>
        <h1 style={styles.logoText}>SocialConnect</h1>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            {item.icon}
            <span style={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.userProfile}>
        <div style={styles.avatar}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user?.name || 'User'}</div>
          <div style={styles.userHandle}>@{user?.name?.toLowerCase().replace(/\s/g, '') || 'user'}</div>
        </div>
        <button onClick={logout} style={styles.logoutBtn} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1.5rem',
    borderRight: '1px solid var(--glass-border)',
    borderTop: 'none',
    borderLeft: 'none',
    borderBottom: 'none',
    borderRadius: 0,
    zIndex: 10,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '3rem',
    paddingLeft: '0.5rem',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    borderRadius: '10px',
  },
  logoText: {
    fontSize: '1.5rem',
    margin: 0,
    background: 'linear-gradient(to right, #fff, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    borderRadius: '12px',
    color: 'var(--text-color)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontSize: '1.1rem',
    fontWeight: 500,
  },
  navItemActive: {
    background: 'rgba(139, 92, 246, 0.15)',
    color: '#c4b5fd',
    fontWeight: 600,
  },
  navLabel: {
    marginTop: '2px',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '16px',
    marginTop: 'auto',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--primary-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  userInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  userName: {
    fontWeight: 600,
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  userHandle: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  }
};

export default Sidebar;
