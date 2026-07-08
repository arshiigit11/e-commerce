"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Orders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status, router]);

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
      } else {
        alert('Failed to cancel order');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitFeedback = async (orderId) => {
    if (!feedbackText.trim()) return alert('Feedback cannot be empty');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'feedback', feedbackText, rating })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => o._id === orderId ? updatedOrder : o));
        setFeedbackOrder(null);
        setFeedbackText('');
        setRating(5);
      } else {
        alert('Failed to submit feedback');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === 'loading' || loading) {
    return <div className={styles.container}><p>Loading orders...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Orders</h1>
      {orders.length === 0 ? (
        <p className={styles.empty}>You haven't placed any orders yet.</p>
      ) : (
        <div className={styles.orderList}>
          {orders.map(order => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <p className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className={styles.orderId}>Order #{order._id}</p>
                </div>
                <div className={styles.orderStatus}>{order.status}</div>
              </div>
              <div className={styles.orderItems}>
                {order.items.map(item => (
                  <div key={item.productId} className={styles.orderItem}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className={styles.itemPrice}>₹{(item.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <h3>Total: ₹{(order.total * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                
                <div className={styles.orderActions}>
                  {order.status === 'Processing' && (
                    <button 
                      className={styles.cancelBtn} 
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {order.status !== 'Cancelled' && !order.feedback && (
                    <button 
                      className={styles.feedbackToggleBtn}
                      onClick={() => setFeedbackOrder(feedbackOrder === order._id ? null : order._id)}
                    >
                      Leave Feedback
                    </button>
                  )}
                </div>
              </div>

              {order.feedback && (
                <div className={styles.feedbackDisplay}>
                  <h4>Your Feedback:</h4>
                  <p className={styles.rating}>{'★'.repeat(order.rating)}{'☆'.repeat(5 - order.rating)}</p>
                  <p>{order.feedback}</p>
                </div>
              )}

              {feedbackOrder === order._id && !order.feedback && (
                <div className={styles.feedbackForm}>
                  <h4>Rate your experience</h4>
                  <div className={styles.ratingSelect}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span 
                        key={star} 
                        className={`${styles.star} ${rating >= star ? styles.starActive : ''}`}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea 
                    className={styles.feedbackInput}
                    placeholder="Tell us what you think..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows="3"
                  />
                  <button 
                    className={styles.submitBtn}
                    onClick={() => handleSubmitFeedback(order._id)}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
