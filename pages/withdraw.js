import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Withdraw.module.css';

export default function WithdrawPage() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form state
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('DANA');
  const [details, setDetails] = useState('');

  useEffect(() => {
    // Ambil data user dari Telegram
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userData = tg.initDataUnsafe.user;
        setUser(userData);
        fetchUserPoints(userData.id);
      }
    }
  }, []);

  const fetchUserPoints = async (userId) => {
    // API get-wallet-info sudah mengambil points, kita bisa gunakan itu
    const response = await fetch(`/api/get-wallet-info?userId=${userId}`);
    const data = await response.json();
    if(data.pointsBalance) {
        setPoints(data.pointsBalance);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/request-withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount, method, details })
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error);
      }
      
      if(window.Telegram && window.Telegram.WebApp){
        window.Telegram.WebApp.showAlert(result.message);
      }
      router.push('/wallet'); // Kembali ke halaman dompet setelah berhasil

    } catch (error) {
      if(window.Telegram && window.Telegram.WebApp){
        window.Telegram.WebApp.showAlert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Tarik Poin</title>
      </Head>

      <h1 className={styles.title}>Tarik Poin</h1>
      
      <div className={styles.balanceInfo}>
        <p>Poin Anda saat ini</p>
        <span>{points.toLocaleString()}</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="amount">Jumlah Poin</label>
          <input
            id="amount"
            type="number"
            className={styles.input}
            placeholder="Min. 10.000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="method">Metode Penarikan</label>
          <select id="method" className={styles.select} value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="DANA">DANA</option>
            <option value="GOPAY">GOPAY</option>
            <option value="OVO">OVO</option>
            <option value="SHOPEEPAY">SHOPEEPAY</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="details">Nomor HP E-Wallet</label>
          <input
            id="details"
            type="tel"
            className={styles.input}
            placeholder="Contoh: 08123456789"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Kirim Permintaan'}
        </button>
      </form>
      <p className={styles.note}>
          Penarikan akan diproses secara manual oleh admin dalam 1x24 jam. Pastikan data yang Anda masukkan sudah benar.
      </p>
    </div>
  );
}

