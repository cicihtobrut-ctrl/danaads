import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Tasks.module.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [adLoading, setAdLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/get-tasks');
        if (!response.ok) throw new Error('Gagal memuat tugas');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);
  
  const handleWatchAd = () => {
    if (!user || adLoading) return;
    setAdLoading(true);

    if (typeof window.show_9933536 === 'function') {
      window.show_9933536().then(() => {
        fetch('/api/reward-ad-watch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            window.Telegram.WebApp.showAlert(`Selamat! Anda mendapatkan ${result.reward} Poin.`);
          } else {
            window.Telegram.WebApp.showAlert(result.error || 'Gagal mendapatkan hadiah.');
          }
        })
        .catch(() => window.Telegram.WebApp.showAlert('Gagal terhubung ke server setelah menonton iklan.'))
        .finally(() => setAdLoading(false));
      }).catch(error => {
        console.error("Ad failed to show:", error);
        window.Telegram.WebApp.showAlert('Iklan tidak tersedia saat ini. Coba lagi nanti.');
        setAdLoading(false);
      });
    } else {
      window.Telegram.WebApp.showAlert('Gagal memuat SDK iklan. Silakan muat ulang.');
      setAdLoading(false);
    }
  };

  const handleClaim = async (taskId) => {
    if (!user) return window.Telegram.WebApp.showAlert('Data pengguna tidak ditemukan. Silakan coba lagi.');
    setClaimingId(taskId);
    try {
        const response = await fetch('/api/claim-reward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, taskId: taskId })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Terjadi kesalahan');
        window.Telegram.WebApp.showAlert(result.message);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
        window.Telegram.WebApp.showAlert(error.message);
    } finally {
        setClaimingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Daftar Tugas</title>
      </Head>
      <div style={{ marginBottom: '25px' }}>
         <h1 className={styles.title}>Kerjakan Tugas, Dapatkan Poin</h1>
      </div>
      <div className={styles.adCard}>
        <h3>Tonton Iklan, Dapat Hadiah!</h3>
        <p>Tonton video singkat untuk mendapatkan 50 Poin secara instan.</p>
        <button className={styles.adButton} onClick={handleWatchAd} disabled={adLoading}>
          {adLoading ? 'Memuat Iklan...' : 'Tonton Sekarang'}
        </button>
      </div>
      {isLoading ? (<p>Memuat tugas...</p>) : (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div key={task.id} className={styles.taskItem}>
              <div className={styles.taskHeader}>
                <div className={styles.taskInfo}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className={styles.taskReward}>+{task.reward} Poin</div>
              </div>
              <div className={styles.taskActions}>
                <a href={task.task_url} target="_blank" rel="noopener noreferrer" className={styles.actionButton}>Buka Tugas</a>
                <button className={`${styles.actionButton} ${styles.claimButton}`} onClick={() => handleClaim(task.id)} disabled={claimingId === task.id}>
                  {claimingId === task.id ? 'Memproses...' : 'Klaim Hadiah'}
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p style={{ textAlign: 'center', color: 'var(--hint-color)' }}>Semua tugas sudah selesai. Cek lagi nanti!</p>}
        </div>
      )}
    </div>
  );
}

