import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import mongoose from 'mongoose';
import { put } from '@vercel/blob';


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

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || "";
    
    if(filename){

      const formData = await req.formData(); // Use formData to handle file uploads
      const title = formData.get('title');
      const content = formData.get('content');
      const file = formData.get('file'); 

    const blob = await put(filename, file, {
      access: 'public',
    });

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const newPost = await Post.create({ title, content,image:blob.url, createdBy:userId });

    const populatedPost = await Post.findById(newPost._id).populate('createdBy', 'name').exec();
    
    return NextResponse.json(blob);
  }else{
    return NextResponse.json({message:"No filename detected"});
  }
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
