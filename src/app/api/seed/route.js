import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as mockProducts } from '@/app/data/products';

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Prepare documents (removing the hardcoded string 'id')
    const docs = mockProducts.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category
    }));
    
    // Insert all
    const result = await Product.insertMany(docs);
    
    return NextResponse.json({ message: `Successfully seeded ${result.length} products` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed database', details: error.message }, { status: 500 });
  }
}
