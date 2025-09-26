import { useState } from 'react';
import { createPagesServerClient } from '@supabase/ssr';
import { createPagesBrowserClient } from '@supabase/ssr';
import styles from '../../styles/Admin.module.css';

export async function getServerSideProps(ctx) {
  // Bagian ini sudah benar dan tidak berubah
  const supabase = createPagesServerClient(ctx);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }

  const { data: initialRequests } = await supabase
    .from('withdrawal_requests').select('*').order('created_at', { ascending: true });

  return { props: { user: session.user, initialRequests: initialRequests || [] } };
}

export default function AdminDashboard({ user, initialRequests }) {
  // Terapkan pola yang sama di sini
  const [supabase] = useState(() => {
    if (typeof window !== 'undefined') {
      return createPagesBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
    }
    return null;
  });

  const [requests, setRequests] = useState(initialRequests);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    if (!supabase) return;
    setLoading(true);
    // ... sisa fungsi ini sama
  };

  const handleUpdateStatus = async (id, status) => {
    if (!supabase) return;
    // ... sisa fungsi ini sama
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    // ... Bagian JSX render di sini tetap sama persis seperti sebelumnya
    // ... (Salin dari versi lengkap terakhir yang saya berikan)
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dasbor Penarikan</h1>
        <div>
          <span style={{marginRight: '20px', color: '#aaa'}}>Login sebagai: {user.email}</span>
          <button onClick={handleLogout} className={styles.button}>Logout</button>
        </div>
      </div>
      {/* ... sisa tabel ... */}
    </div>
  );
}

