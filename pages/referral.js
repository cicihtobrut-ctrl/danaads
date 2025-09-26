import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Referral.module.css';

export default function ReferralPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalReferrals: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [botUsername, setBotUsername] = useState('earndanabot'); // GANTI DENGAN USERNAME BOT ANDA

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userData = tg.initDataUnsafe.user;
        setUser(userData);
        fetchReferralStats(userData.id);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchReferralStats = async (userId) => {
    try {
      const response = await fetch(`/api/get-referral-stats?userId=${userId}`);
      if (!response.ok) throw new Error('Gagal memuat statistik');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const referralLink = `https://t.me/${botUsername}?start=ref_${user?.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert('Link referral berhasil disalin!');
      }
    }).catch(err => {
      console.error('Gagal menyalin link:', err);
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Program Referral</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <h1 className={styles.title}>Program Referral</h1>

      <div className={styles.statsCard}>
        <p className={styles.statsLabel}>Total Teman Diundang</p>
        <h2 className={styles.statsValue}>
          {isLoading ? '...' : stats.totalReferrals}
        </h2>
      </div>
      
      <div className={styles.linkCard}>
        <p className={styles.linkLabel}>Bagikan link unik Anda:</p>
        <div className={styles.refLink}>{isLoading ? 'Memuat link...' : referralLink}</div>
        <button className={styles.copyButton} onClick={copyToClipboard} disabled={isLoading}>
          Salin Link
        </button>
      </div>

      <div className={styles.rewardsSection}>
        <h3>Keuntungan Mengundang Teman</h3>
        <p>
          Undang teman Anda untuk bergabung dan dapatkan imbalan spesial! Anda akan mendapatkan komisi sebesar 30% dari setiap poin yang dihasilkan oleh teman yang Anda undang, selamanya!
        </p>
      </div>
    </div>
  );
}

