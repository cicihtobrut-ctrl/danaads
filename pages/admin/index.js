import { useState, useEffect } from 'react';
import { createPagesServerClient } from '@supabase/ssr'; // Import dari paket baru
import styles from '../../styles/Admin.module.css';

// Fungsi ini berjalan di server sebelum halaman di-render
export async function getServerSideProps(ctx) {
  // Membuat client Supabase khusus untuk sisi server dengan paket baru
  const supabase = createPagesServerClient(ctx);

  // Mengambil sesi pengguna
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Jika tidak ada sesi (belum login), redirect ke halaman login
  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  // Jika sudah login, kirim data user ke halaman
  return {
    props: {
      user: session.user,
      // Kita juga bisa mengambil data awal di sini agar lebih cepat
      initialRequests: (await supabase.from('withdrawal_requests').select('*').order('created_at', { ascending: true })).data || [],
    },
  };
}

export default function AdminDashboard({ user, initialRequests }) {
  const [requests, setRequests] = useState(initialRequests);
  const [loading, setLoading] = useState(false);
  
  // Client Supabase untuk sisi browser, diimpor dari lib
  const { supabase } = require('../../lib/supabaseClient');

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

