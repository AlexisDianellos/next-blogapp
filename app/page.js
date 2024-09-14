'use client';
import { useEffect, useState } from 'react';
import CreatePost from "../components/CreatePostForm";
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const [posts, setPosts] = useState([]);

  const {data:session} = useSession();

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
      {session?(
        <>
        <h1>Welcome back, {session.user?.name}</h1>
        <button  onClick={()=>signOut("google")}>Sign out</button>
        </>
      ):(
        <>
          <h1 >Not logged in, sign in</h1>
          <button onClick={()=>signIn("google")}>Sign in google</button>
          <button onClick={()=>signIn("github")}>Sign in github</button>

        </>
      )}
      <h1 className="text-2xl font-bold">Blog Posts</h1>
      <CreatePost onPostCreated={handlePostCreated}/>
      <ul>
        {posts.map((post) => (
          <li key={post._id} className="mt-4">
            <Link href={`/posts/${post._id}`}>
              <img src={post.image} className="w-1/2"/>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{post.content}</p> 
              <p>{post.createdBy?.name || 'Unkown User'}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
