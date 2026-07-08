import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, feedbackText, rating } = body;

    await dbConnect();

    // Verify order belongs to user
    const order = await Order.findOne({ _id: id, user: session.user.id });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (action === 'cancel') {
      if (order.status !== 'Processing') {
        return NextResponse.json({ message: 'Only processing orders can be cancelled' }, { status: 400 });
      }
      order.status = 'Cancelled';
    } else if (action === 'feedback') {
      if (!feedbackText) {
        return NextResponse.json({ message: 'Feedback text is required' }, { status: 400 });
      }
      order.feedback = feedbackText;
      if (rating) {
        order.rating = Number(rating);
      }
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    await order.save();

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
