import BottomNav from './BottomNav';

export default function Layout({ children }) {
  // Padding bawah untuk memberi ruang agar konten tidak tertutup navigasi
  return (
    <div style={{ paddingBottom: '75px' }}> 
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}

