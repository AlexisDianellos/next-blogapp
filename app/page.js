'use client';
import { useEffect, useState } from 'react';
import CreatePost from "./components/CreatePostForm";
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const handlePostCreated =(newPost)=>{
    setPosts((prevPosts)=>[newPost, ...prevPosts]);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Blog Posts</h1>
      <CreatePost onPostCreated={handlePostCreated}/>
      <ul>
        {posts.map((post) => (
          <li key={post._id} className="mt-4">
            <Link href={`/posts/${post._id}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{post.content}</p> 
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
