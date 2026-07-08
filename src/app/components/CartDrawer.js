"use client";

import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import styles from './CartDrawer.module.css';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isDrawerOpen, closeDrawer, items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!session) {
      closeDrawer();
      router.push('/login');
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total: cartTotal }),
      });

      if (res.ok) {
        clearCart();
        closeDrawer();
        router.push('/orders');
      } else {
        alert("Failed to create order");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {isDrawerOpen && <div className={styles.overlay} onClick={closeDrawer} />}
      <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Your Cart</h2>
          <button className={styles.closeButton} onClick={closeDrawer}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.itemsContainer}>
          {items.length === 0 ? (
            <p className={styles.emptyCart}>Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.itemPrice}>
                    ₹{(item.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                    <button 
                      className={styles.removeButton} 
                      onClick={() => removeItem(item._id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal:</span>
              <span>₹{(cartTotal * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <button 
              className={styles.checkoutButton} 
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : (session ? 'Checkout' : 'Login to Checkout')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
