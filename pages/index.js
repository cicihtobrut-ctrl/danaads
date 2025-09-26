import { useState, useEffect } from 'react';
import Head from 'next/head';

// Import style dari CSS Module
import styles from '../styles/Home.module.css';

// Import ikon dari library react-icons (kita gunakan set Font Awesome 'Fa')
import { FaTasks, FaUsers, FaWallet, FaStore } from 'react-icons/fa';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsTelegram(true);
      
      tg.ready();
      tg.expand();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      tg.MainButton.setText('Tutup');
      tg.MainButton.show();
      tg.MainButton.onClick(() => tg.close());
    }
  }, []);

  const handleMenuClick = (menu) => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(`Anda mengklik menu: ${menu}`);
    }
  };

  return (
    // Menggunakan className dari file Home.module.css
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
          <h2 className={styles.balanceAmount}>{totalPoints.toLocaleString()} Poin</h2>
        </div>

        <div className={styles.menuGrid}>
          {/* Menggunakan komponen Ikon di dalam tombol */}
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


