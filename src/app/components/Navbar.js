"use client";

import Link from 'next/link';
import { ShoppingCart, User as UserIcon, LogOut, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useSearchStore } from '@/store/searchStore';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const items = useCartStore((state) => state.items);
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          LUMIÈRE
        </Link>
        
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Search products..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={styles.searchButton}>
            <Search size={18} color="#F4F0F8" />
          </button>
        </div>

        <div className={styles.actions}>
          
          {session ? (
            <div className={styles.userActions}>
              <Link href="/orders" className={styles.navLink}>Orders</Link>
              <button onClick={() => signOut()} className={styles.iconButton} aria-label="Sign out">
                <LogOut size={22} color="#F4F0F8" />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.iconButton} aria-label="Sign in">
              <UserIcon size={24} color="#F4F0F8" />
            </Link>
          )}

          <button className={styles.cartButton} onClick={toggleDrawer} aria-label="Open cart">
            <ShoppingCart size={24} color="#F4F0F8" />
            {mounted && itemCount > 0 && (
              <span className={styles.badge}>{itemCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
