'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function CreatePostForm({onPostCreated}) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setError('You must be signed in to create a post.');
      return;
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content,createdBy:session.user.id }),
    });
    if (response.ok) {
      const newPost = await response.json();
      onPostCreated(newPost)
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 text-black">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Create Post
      </button>
    </form>
  );
}
