// app/posts/[id]/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter,useParams } from 'next/navigation';
import Link from 'next/link';

export default function PostDetail() {
  const { id } = useParams();  // Extract the post ID from the URL
  const router = useRouter(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch the post data based on the ID from the API
      fetch(`/api/posts/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch post');
          }
          return res.json();
        })
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching post:', error);
          setError('Failed to load the post');
          setLoading(false);
        });
    }
  }, [id]);

  const deletePost = async(id)=>{
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Redirect to the home page after successful deletion
        router.push("/");
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
  }
}

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <Link className="border p-2" href="/">Home</Link>
      <button className="border p-2" onClick={()=>deletePost(post._id)}>Delete</button>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
