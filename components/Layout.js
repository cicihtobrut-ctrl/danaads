import BottomNav from './BottomNav';

export default function Layout({ children }) {
  return (
    // Padding bawah pada div utama untuk memberi ruang agar konten tidak tertutup navigasi
    <div style={{ paddingBottom: '75px' }}> 
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}

