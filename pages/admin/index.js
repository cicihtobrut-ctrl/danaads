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
  // Buat client Supabase untuk sisi browser di sini
  const [supabase] = useState(() => createPagesBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ));
  
  const [requests, setRequests] = useState(initialRequests);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('withdrawal_requests').select('*').order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('withdrawal_requests').update({ status, processed_at: new Date() }).eq('id', id);

    if (error) {
      alert('Gagal mengupdate status!');
    } else {
      fetchRequests();
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dasbor Penarikan</h1>
        <div>
            <span style={{marginRight: '20px', color: '#aaa'}}>Login sebagai: {user.email}</span>
            <button onClick={handleLogout} className={styles.button}>Logout</button>
        </div>
      </div>
      
      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>User ID</th>
              <th>Metode</th>
              <th>Detail Akun</th>
              <th>Jumlah (Poin)</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{new Date(req.created_at).toLocaleString('id-ID')}</td>
                <td>{req.user_id}</td>
                <td>{req.method}</td>
                <td>{req.account_details}</td>
                <td>{req.amount_points.toLocaleString()}</td>
                <td>
                    <span className={
                        req.status === 'PENDING' ? styles.statusPending :
                        req.status === 'COMPLETED' ? styles.statusCompleted :
                        styles.statusRejected
                    }>{req.status}</span>
                </td>
                <td>
                  {req.status === 'PENDING' && (
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleUpdateStatus(req.id, 'COMPLETED')} className={styles.approveButton}>Setujui</button>
                      <button onClick={() => handleUpdateStatus(req.id, 'REJECTED')} className={styles.rejectButton}>Tolak</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

