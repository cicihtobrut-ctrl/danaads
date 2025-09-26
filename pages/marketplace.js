import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Marketplace.module.css';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil data user dari Telegram
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
    
    // Ambil daftar produk dari API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/get-products');
        if (!response.ok) throw new Error('Gagal memuat produk');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const handlePurchase = (product) => {
    if (!user) return;
    
    // Minta nomor tujuan ke pengguna
    window.Telegram.WebApp.showPopup({
      title: `Beli ${product.name}`,
      message: `Masukkan nomor tujuan untuk pembelian ini.`,
      buttons: [{ type: 'input', text: 'Beli Sekarang' }, { type: 'cancel' }]
    }, async (buttonId, inputValue) => {
      if (buttonId === 'input' && inputValue) {
        // Tampilkan loading
        window.Telegram.WebApp.showProgress();

        try {
          const response = await fetch('/api/purchase-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              productId: product.id,
              targetNumber: inputValue
            })
          });

          const result = await response.json();
          window.Telegram.WebApp.hideProgress();

          if (!response.ok) {
            window.Telegram.WebApp.showAlert(result.error || 'Terjadi kesalahan.');
          } else {
            window.Telegram.WebApp.showAlert(result.message);
            // Idealnya, di sini kita refresh data poin pengguna
          }
        } catch (error) {
          window.Telegram.WebApp.hideProgress();
          window.Telegram.WebApp.showAlert('Gagal terhubung ke server.');
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <h1 className={styles.title}>Marketplace</h1>

      {isLoading ? (
        <p>Memuat produk...</p>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard} onClick={() => handlePurchase(product)}>
              <img src={product.provider_icon_url} alt={product.name} className={styles.productIcon} />
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>{product.price.toLocaleString()} Poin</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

