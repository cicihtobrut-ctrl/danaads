import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/ssr';
import styles from '../../styles/Admin.module.css';

export default function AdminLogin() {
  // Pola ini memastikan client HANYA dibuat saat kode berjalan di browser
  const [supabase] = useState(() => {
    if (typeof window !== 'undefined') {
      return createPagesBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
    }
    return null; // Saat di server, supabase akan null
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) return; // Jangan lakukan apa-apa jika supabase belum siap
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage('Gagal login: ' + error.message);
    } else {
      window.location.href = '/admin';
    }
    setLoading(false);
  };
  
  const handleSignUp = async () => {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage('Gagal mendaftar: ' + error.message);
    } else {
      setMessage('Berhasil mendaftar! Silakan coba login.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Admin Panel Login</h1>
        <p className={styles.subtitle}>Masukkan kredensial Anda untuk melanjutkan.</p>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" disabled={loading || !supabase} className={styles.button}>
            {loading ? 'Loading...' : 'Login'}
          </button>
          
          <button type="button" onClick={handleSignUp} disabled={loading || !supabase} className={`${styles.button} ${styles.secondaryButton}`}>
            Daftar (Admin Baru)
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

