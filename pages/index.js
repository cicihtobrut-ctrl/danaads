import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userData = tg.initDataUnsafe.user;
        setUser(userData);
        syncAndFetchUser(userData);
      } else {
        setIsLoading(false);
      }
      
      // Kita sembunyikan MainButton karena sudah ada navigasi bawah
      tg.MainButton.hide();
    } else {
      setIsLoading(false);
    }
  }, []);

  const syncAndFetchUser = async (userData) => {
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userData }),
      });
      if (!response.ok) throw new Error('Failed to sync user data');
      const dbUser = await response.json();
      setTotalPoints(dbUser.points);
    } catch (error) {
      console.error(error);
      if(window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert('Gagal mengambil data poin dari server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Home - DanaAdsEarn</title>
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

      <main className={styles.main}>
        <div className={styles.balanceCard}>
          <p className={styles.balanceText}>Total Poin Anda</p>
          {isLoading ? (
            <h2 className={styles.balanceAmount}>Loading...</h2>
          ) : (
            <h2 className={styles.balanceAmount}>{totalPoints.toLocaleString()} Poin</h2>
          )}
        </div>
        {/* Tombol-tombol menu besar kita hapus karena fungsinya sudah digantikan oleh navigasi bawah */ }
        <div style={{marginTop: '20px', textAlign: 'center', color: 'var(--hint-color)'}}>
            <p>Pilih menu di bawah untuk memulai.</p>
        </div>
      </main>
    </div>
  );
}

