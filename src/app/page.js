"use client";

import { useState, useEffect } from 'react';
import ProductGrid from './components/ProductGrid';
import HeroSlideshow from './components/HeroSlideshow';
import { useSearchStore } from '@/store/searchStore';
import styles from './page.module.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('Featured');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const searchQuery = useSearchStore((state) => state.searchQuery);

  // Filter and sort the products based on state
  let filteredProducts = products;
  
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedCategory !== 'All Products') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (sortBy === 'Price: Low to High') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <main className={styles.main}>
      <HeroSlideshow />
      
      <section className={styles.catalog}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Category</span>
            <select 
              className={styles.select}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Products</option>
              <option>Apparel</option>
              <option>Beauty</option>
              <option>Accessories</option>
              <option>Electronics</option>
              <option>Home</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Sort By</span>
            <select 
              className={styles.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#F4F0F8', opacity: 0.7 }}>Loading products from database...</div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </section>
    </main>
  );
}
