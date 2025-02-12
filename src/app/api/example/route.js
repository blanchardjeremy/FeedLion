import { connectDB } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    
    // Your DB operations here
    // const data = await YourModel.find()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()
    
    // Your DB operations here
    // const newDoc = await YourModel.create(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 