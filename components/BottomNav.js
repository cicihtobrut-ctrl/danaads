import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/BottomNav.module.css';
import { FaHome, FaTasks, FaUsers, FaWallet } from 'react-icons/fa';

export default function BottomNav() {
  const router = useRouter();

  const navItems = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/tasks', label: 'Tugas', icon: FaTasks },
    { href: '/referral', label: 'Referral', icon: FaUsers },
    { href: '/wallet', label: 'Dompet', icon: FaWallet },
  ];

  return (
    <nav className={styles.navContainer}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <a className={`${styles.navLink} ${router.pathname === item.href ? styles.active : ''}`}>
            <item.icon size={22} />
            <span className={styles.navLabel}>{item.label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}

