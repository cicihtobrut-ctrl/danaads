import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import '../styles/globals.css';

// Memuat SupabaseProvider secara dinamis HANYA di sisi browser
// Ini adalah kunci untuk memperbaiki error client-side
const SupabaseProvider = dynamic(
  () => import('../lib/SupabaseProvider').then((mod) => mod.SupabaseProvider),
  { 
    ssr: false, // MENONAKTIFKAN Server-Side Rendering untuk komponen ini
    loading: () => <p style={{textAlign: 'center', paddingTop: '20px'}}>Inisialisasi Aplikasi...</p>
  }
);

function MyApp({ Component, pageProps }) {
  return (
    <SupabaseProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SupabaseProvider>
  );
}

export default MyApp;

