import '../styles/globals.css';
import Layout from '../components/Layout'; // Import Layout

function MyApp({ Component, pageProps }) {
  // Bungkus Component dengan Layout
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

