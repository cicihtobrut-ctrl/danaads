import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Tasks.module.css';

// Deklarasikan fungsi Monetag di level global agar TypeScript/ESLint tidak error
// dan agar kita bisa mengaksesnya dari mana saja.
// Pastikan fungsi ini cocok dengan `data-sdk` di _document.js
declare global {
  interface Window {
    show_9933536: () => Promise<void>;
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [adLoading, setAdLoading] = useState(false); // State untuk loading iklan
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
      // ... (kode fetchTasks tetap sama)
    };
    fetchTasks();
  }, []);

  const handleWatchAd = () => {
    if (!user || adLoading) return;

    setAdLoading(true);

    // Cek apakah fungsi SDK Monetag sudah tersedia
    if (typeof window.show_9933536 === 'function') {
      window.show_9933536().then(() => {
        // Iklan selesai ditonton, sekarang panggil API kita untuk dapat hadiah
        fetch('/api/reward-ad-watch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            window.Telegram.WebApp.showAlert(`Selamat! Anda mendapatkan ${result.reward} Poin.`);
            // Idealnya, update saldo poin di UI secara real-time
          } else {
            window.Telegram.WebApp.showAlert(result.error || 'Gagal mendapatkan hadiah.');
          }
        })
        .catch(() => {
          window.Telegram.WebApp.showAlert('Gagal terhubung ke server setelah menonton iklan.');
        })
        .finally(() => {
          setAdLoading(false);
        });
      }).catch(error => {
        // Handle jika iklan gagal ditampilkan
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
    // ... (kode handleClaim tetap sama)
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Daftar Tugas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{ marginBottom: '25px' }}>
         <h1 className={styles.title}>Kerjakan Tugas, Dapatkan Poin</h1>
      </div>

      {/* Kartu Spesial untuk Menonton Iklan */}
      <div className={styles.adCard}>
        <h3>Tonton Iklan, Dapat Hadiah!</h3>
        <p>Tonton video singkat untuk mendapatkan 50 Poin secara instan.</p>
        <button className={styles.adButton} onClick={handleWatchAd} disabled={adLoading}>
          {adLoading ? 'Memuat Iklan...' : 'Tonton Sekarang'}
        </button>
      </div>

      {isLoading ? (
        <p>Memuat tugas...</p>
      ) : (
        <div className={styles.taskList}>
          {/* ... (kode mapping tasks tetap sama) ... */}
        </div>
      )}
    </div>
  );
}

