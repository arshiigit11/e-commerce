"use client";

import styles from './ProductCard.module.css';
import { useCartStore } from '@/store/cartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} />
        <div className={styles.overlay}>
          <button className={styles.addToCartBtn} onClick={() => addItem(product)}>Add to Cart</button>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <span className={styles.price}>₹{(product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <p className={styles.category}>{product.category}</p>
      </div>
    </div>
  );
}
