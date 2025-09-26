import dynamic from 'next/dynamic';
import styles from '../../styles/Admin.module.css';

// Memuat komponen form secara dinamis dan menonaktifkan Server-Side Rendering (SSR)
const AdminLoginForm = dynamic(() => import('../../components/AdminLoginForm'), {
  ssr: false, 
  loading: () => <p>Memuat form...</p> // Tampilan saat komponen sedang dimuat
});

export default function AdminLoginPage() {
  return (
    <div className={styles.loginContainer}>
      <AdminLoginForm />
    </div>
  );
}

