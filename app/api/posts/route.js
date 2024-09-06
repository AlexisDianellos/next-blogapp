import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import mongoose from 'mongoose';

export async function GET(req) {
  await connectToDatabase();
  const posts = await Post.find().populate('createdBy','name').exec();
  return new Response(JSON.stringify(posts), { status: 200 });
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();
    const { title, content } = await req.json();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const newPost = await Post.create({ title, content, createdBy:userId });

    const populatedPost = await Post.findById(newPost._id).populate('createdBy', 'name').exec();
    
    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}