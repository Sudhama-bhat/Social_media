import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Phone, ArrowLeft } from 'lucide-react';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in" style={styles.container}>
      <div className="glass-panel" style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <UserPlus size={28} color="var(--primary-color)" />
          </div>
          <h2 style={styles.title}>Join SocialConnect</h2>
          <p style={styles.subtitle}>Create an account to start sharing</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Full Name</label>
            <User size={18} style={styles.inputIcon} />
            <input 
              type="text" 
              name="name"
              className="input-field" 
              style={styles.inputWithIcon}
              value={formData.name} 
              onChange={handleChange} 
              placeholder="John Doe" 
              required 
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Email Address</label>
            <Mail size={18} style={styles.inputIcon} />
            <input 
              type="email" 
              name="email"
              className="input-field" 
              style={styles.inputWithIcon}
              value={formData.email} 
              onChange={handleChange} 
              placeholder="you@example.com" 
              required 
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Phone Number</label>
            <Phone size={18} style={styles.inputIcon} />
            <input 
              type="tel" 
              name="phone"
              className="input-field" 
              style={styles.inputWithIcon}
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+1234567890" 
              required 
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <Lock size={18} style={styles.inputIcon} />
            <input 
              type="password" 
              name="password"
              className="input-field" 
              style={styles.inputWithIcon}
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          <Link to="/login" style={styles.link}><ArrowLeft size={16} /> Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  panel: {
    width: '100%',
    maxWidth: '450px',
    padding: '2.5rem 2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    background: 'rgba(139, 92, 246, 0.15)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
  },
  title: {
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    textAlign: 'center',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '38px',
    color: 'var(--text-muted)',
  },
  inputWithIcon: {
    paddingLeft: '2.5rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.9rem',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 500,
  }
};

export default Register;
