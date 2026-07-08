# LUMIÈRE E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js, React, NextAuth.js, and MongoDB. Featuring a beautiful "glassmorphism" UI design.

## Features
- **Dynamic Product Grid & Slideshow:** Discover premium products with real-time searching and filtering.
- **Shopping Cart System:** Add, remove, and manage items in a persistent global cart.
- **Authentication:** Secure user login and registration powered by NextAuth.js and bcrypt.
- **Order Management:** Secure checkout, order history tracking, order cancellation, and feedback/ratings.
- **Database Integration:** Fully connected to MongoDB for handling users, products, and orders.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Frontend:** React, Vanilla CSS Modules, Lucide React (Icons)
- **Backend/API:** Next.js Route Handlers
- **Database:** MongoDB & Mongoose
- **Authentication:** NextAuth.js (Credentials Provider)
- **State Management:** Zustand

## Getting Started

### Prerequisites
- Node.js installed on your machine
- A MongoDB cluster (or local instance)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/arshiigit11/e-commerce.git
   ```
2. Navigate into the project directory:
   ```bash
   cd ecommerce-platform
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env.local` file in the root directory and add the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_super_secret_string
NEXTAUTH_URL=http://localhost:3000
```

### Running the App
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Seeding
To populate the database with initial sample products, visit:
`http://localhost:3000/api/seed` in your browser once the server is running.
