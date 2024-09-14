// app/posts/[id]/page.js
'use client';
import { useEffect, useState,useRef } from 'react';
import { useRouter,useParams } from 'next/navigation';
import Link from 'next/link';
import {useSession } from 'next-auth/react';

export default function PostDetail() {
  const { id } = useParams();  // Extract the post ID from the URL
  const router = useRouter(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {data:session} = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const inputFileRef = useRef(null);

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
    
    if (!session) {
      console.error('You must be signed in to create a post.');
      return;
    }
    
    const formdata = new FormData();
    formdata.append('image',post.image);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        body:formdata,
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

const editPost = async(id)=>{
  
  if (!session) {
    console.error('You must be signed in to create a post.');
    return;
  }

  const file = inputFileRef.current.files[0];

  const formData = new FormData();
  formData.append('file', file)
  formData.append('title', title)
  formData.append('content', content)
  try{
    const res = await fetch(`/api/posts/${id}?filename=${file.name}`,{
      method:'PATCH',
      body: formData,
    });
    if (res.ok) {
      // Redirect to the home page after successful deletion
      const updatedPost = await res.json();
      setPost(updatedPost)
    } else {
      throw new Error('Failed to edit post');
    }
  }catch(err){
    console.error('Error editing post: ',err);
  }
}

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <Link className="border p-2" href="/">Home</Link>
      { session && post.createdBy===session.user.id?
        <>
          <button className="border p-2" onClick={()=>deletePost(post._id)}>Delete</button>
          <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)}></input>
          <input placeholder="text" value={content} onChange={(e) => setContent(e.target.value)}></input>
          <input type="file" ref={inputFileRef} className="mb-4" />
          <button className="border p-2" onClick={()=>editPost(post._id)}>Edit</button>
        </>
        :<></>
      }
      <img src={post.image}/>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
