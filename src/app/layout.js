import './globals.css';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AuthProvider from './components/AuthProvider';

export const metadata = {
  title: 'Elevate | Premium E-Commerce',
  description: 'A comprehensive modern e-commerce platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <CartDrawer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
