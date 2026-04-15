'use client';

import { useState } from 'react';
import styles from './studentLogin.module.css';
import { API_BASE } from '../../../lib/api';

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
      } else {
        localStorage.setItem('studentUser', JSON.stringify(data.student));
        setTimeout(() => {
          window.location.href = '/student/dashboard';
        }, 500);
      }
    } catch (err) {
      setError('Unable to reach API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.logoCircle}>
            <img src="/logo.png" alt="logo" width={90} />
          </div>

          <h1 className={styles.collegeName}>JNANAM PU COLLEGE</h1>
          <p className={styles.collegeSubtitle}>Student Portal Access</p>

          <span className={styles.sessionBadge}>STUDENT LOGIN</span>
        </div>
      </section>

      {/* LOGIN FORM */}
      <section className={styles.body}>
        <div className={styles.card}>
          <h2 className={styles.title}>Sign in as Student</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © 2026 Jnanam PU College
      </footer>
    </main>
  );
}
