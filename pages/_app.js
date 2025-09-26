import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import '../styles/globals.css';

// Memuat SupabaseProvider secara dinamis HANYA di sisi browser
const SupabaseProvider = dynamic(
  () => import('../lib/SupabaseProvider').then((mod) => mod.SupabaseProvider),
  { ssr: false } // Ini adalah bagian terpenting: NONAKTIFKAN Server-Side Rendering
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

