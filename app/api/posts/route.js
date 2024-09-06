import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(req) {
  await connectToDatabase();
  const posts = await Post.find({});
  return new Response(JSON.stringify(posts), { status: 200 });
}

export async function POST(req) {
  await connectToDatabase();
  const data = await req.json();
  const post = await Post.create(data);
  return new Response(JSON.stringify(post), { status: 201 });
}