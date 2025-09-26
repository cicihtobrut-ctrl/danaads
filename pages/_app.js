import { SupabaseProvider } from '../lib/SupabaseProvider'; // Import provider baru
import Layout from '../components/Layout';
import '../styles/globals.css';

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

