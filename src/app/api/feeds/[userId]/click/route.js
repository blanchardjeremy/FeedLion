import { connectDB } from '@/lib/db';
import { User } from '@/models';

export async function POST(request, context) {
  console.log('🎯 [POST] /api/feeds/[userId]/click - Starting request');
  try {
    console.log('📡 Connecting to database...');
    await connectDB();
    const params = await context.params;
    const { userId } = params;
    const { itemId } = await request.json();
    console.log('📝 Processing click:', { userId, itemId });

    // Add the clicked item to the user's clickedItems array
    console.log('🔄 Updating user document...');
    const user = await User.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          clickedItems: {
            item: itemId,
            clickedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!user) {
      console.log('❌ User not found:', userId);
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Click recorded successfully');
    console.log('📦 Updated clickedItems count:', user.clickedItems.length);
    return Response.json({
      success: true
    });
  } catch (error) {
    console.error('❌ Error marking item as clicked:', error);
    console.error('Stack trace:', error.stack);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 