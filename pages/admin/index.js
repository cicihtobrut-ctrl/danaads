import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from '../../styles/Admin.module.css';

// Fungsi ini berjalan di server sebelum halaman di-render
export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  // Jika tidak ada user (belum login), redirect ke halaman login
  if (!user) {
    return { props: {}, redirect: { destination: '/admin/login' } };
  }

  // Jika sudah login, lanjutkan
  return { props: { user } };
}

export default function AdminDashboard({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    const { error } = await supabase
      .from('withdrawal_requests')
      .update({ status: status, processed_at: new Date() })
      .eq('id', id);

    if (error) {
      alert('Gagal mengupdate status!');
    } else {
      // Refresh daftar request setelah update
      fetchRequests();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dasbor Penarikan</h1>
        <button onClick={handleLogout} className={styles.button}>Logout</button>
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

