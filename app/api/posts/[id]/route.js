import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/authOptions';
import { del,put } from '@vercel/blob';

export async function GET(req, { params }) {
  await connectToDatabase();
  const post = await Post.findById(params.id);
  if (!post) return new Response('Post not found', { status: 404 });
  return new Response(JSON.stringify(post), { status: 200 });
}

export async function PATCH(req, { params }) {
  
  try{
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || "";

    if(filename){

      const postId = params.id;

      const formData = await req.formData();
      const title = formData.get('title');
      const content = formData.get('content');
      const file = formData.get('file'); 

      if(!file){
        return NextResponse.json({ error: 'Error, no image url' }, { status: 400 });
      }

      const post = await Post.findById(postId);

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      if (post.createdBy.toString() !== session.user.id) {
        return NextResponse.json({ error: 'You do not have permission to edit this post' }, { status: 403 });
      }

      await del(post.image);

      const blob = await put(filename, file, {
        access: 'public',
      });

      const image=blob.url;

      const updatedPost = await Post.findByIdAndUpdate(postId, {title,content,image}, { new: true });

      return NextResponse.json(updatedPost, { status: 200 });
  }else{
    return NextResponse.json({message:"No filename detected"});
  }

  }catch(err){
    console.error("Error editing post ",err);
    return NextResponse.json({ error: 'Failed to edit post' }, { status: 500 });
  }
  
}

export async function DELETE(req, { params }) {
  try{
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    await connectToDatabase();

    const postId = params.id;
    const formData = await req.formData(); // Use formData to handle file uploads
    const url = formData.get('image')||"";
    console.log(url)
    if(!url){
      return NextResponse.json({ error: 'Error, no image url' }, { status: 400 });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'You do not have permission to delete this post' }, { status: 403 });
    }

    await post.deleteOne();
    await del(url);

    return NextResponse.json({ success: 'Post deleted' }, { status: 200 });

  }catch(err){
    console.error("Error deleting post ",err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
