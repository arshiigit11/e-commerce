import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item._id === product._id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isDrawerOpen: true,
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }], isDrawerOpen: true };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      get cartTotal() {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      get itemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'ecommerce-cart', // Persist cart to localStorage
    }
  )
);
