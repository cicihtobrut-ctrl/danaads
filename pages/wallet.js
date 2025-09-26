import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Wallet.module.css';
import { FaArrowDown, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';

export default function WalletPage() {
  const [walletData, setWalletData] = useState({ pointsBalance: 0, transactions: [] });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userData = tg.initDataUnsafe.user;
        setUser(userData);
        fetchWalletInfo(userData.id);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchWalletInfo = async (userId) => {
    try {
      const response = await fetch(`/api/get-wallet-info?userId=${userId}`);
      if (!response.ok) throw new Error('Gagal memuat info dompet');
      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      console.error(error);
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert('Tidak dapat memuat data dompet.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActionClick = (action) => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(`Fitur "${action}" akan segera hadir!`);
      }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Dompet Saya</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <h1 className={styles.title}>Dompet Saya</h1>

      <div className={styles.balanceCard}>
        <p className={styles.balanceLabel}>Total Poin</p>
        <h2 className={styles.balanceValue}>
          {isLoading ? '...' : walletData.pointsBalance.toLocaleString()}
        </h2>
      </div>

      <div className={styles.actionGrid}>
        <button className={styles.actionButton} onClick={() => handleActionClick('Tarik Poin')}>
          <FaArrowUp /> Tarik Poin
        </button>
        <button className={`${styles.actionButton} ${styles.secondary}`} onClick={() => handleActionClick('Konversi')}>
          <FaExchangeAlt /> Konversi
        </button>
      </div>

      <div>
        <h2 className={styles.historyTitle}>Riwayat Transaksi Terakhir</h2>
        {isLoading ? (
          <p>Memuat riwayat...</p>
        ) : walletData.transactions.length > 0 ? (
          <div>
            {walletData.transactions.map((tx) => (
              <div key={tx.id} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <h3>{tx.description || tx.type.replace('_', ' ')}</h3>
                  <p>{formatDate(tx.created_at)}</p>
                </div>
                <span className={`${styles.transactionAmount} ${tx.amount >= 0 ? styles.amountPositive : styles.amountNegative}`}>
                  {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.placeholder}>Belum ada riwayat transaksi.</p>
        )}
      </div>
    </div>
  );
}

