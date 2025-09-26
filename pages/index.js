import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { FaTasks, FaUsers, FaWallet, FaStore } from 'react-icons/fa';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0); // Poin sekarang akan dari DB
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsTelegram(true);
      tg.ready();
      tg.expand();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userData = tg.initDataUnsafe.user;
        setUser(userData);
        
        // Panggil API untuk sinkronisasi dan ambil data poin
        syncAndFetchUser(userData);
      } else {
        setIsLoading(false); // Tidak ada data user, berhenti loading
      }
      
      tg.MainButton.setText('Tutup');
      tg.MainButton.show();
      tg.MainButton.onClick(() => tg.close());
    } else {
      setIsLoading(false); // Bukan di Telegram, berhenti loading
    }
  }, []);

  const syncAndFetchUser = async (userData) => {
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userData }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user data');
      }

      const dbUser = await response.json();
      setTotalPoints(dbUser.points); // Update poin dari database

    } catch (error) {
      console.error(error);
      // Tampilkan alert jika gagal sinkronisasi
      if(window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert('Gagal mengambil data poin dari server.');
      }
    } finally {
      setIsLoading(false); // Selesai sinkronisasi, berhenti loading
    }
  };

  const handleMenuClick = (menu) => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(`Anda mengklik menu: ${menu}`);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>My Awesome Mini App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      
      <header className={styles.header}>
        {user ? (
          <div>
            <h1 className={styles.greeting}>Selamat Datang, {user.first_name}!</h1>
            <p className={styles.userId}>User ID: {user.id}</p>
          </div>
        ) : (
          <h1 className={styles.greeting}>Memuat Data...</h1>
        )}
      </header>
      
      {!isTelegram && (
        <div className={styles.warningBox}>
          <p>Aplikasi ini dirancang untuk berjalan di dalam Telegram.</p>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.balanceCard}>
          <p className={styles.balanceText}>Total Poin Anda</p>
          {isLoading ? (
            <h2 className={styles.balanceAmount}>Loading...</h2>
          ) : (
            <h2 className={styles.balanceAmount}>{totalPoints.toLocaleString()} Poin</h2>
          )}
        </div>

        <div className={styles.menuGrid}>
          <button className={styles.menuButton} onClick={() => handleMenuClick('Tugas')}>
            <FaTasks size={24} /> 
            <span>Tugas</span>
          </button>
          <button className={styles.menuButton} onClick={() => handleMenuClick('Referral')}>
            <FaUsers size={24} />
            <span>Referral</span>
          </button>
          <button className={styles.menuButton} onClick={() => handleMenuClick('Dompet')}>
            <FaWallet size={24} />
            <span>Dompet</span>
          </button>
          <button className={styles.menuButton} onClick={() => handleMenuClick('Marketplace')}>
            <FaStore size={24} />
            <span>Marketplace</span>
          </button>
        </div>
      </main>
    </div>
  );
}

