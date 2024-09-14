// CreatePostForm.js
'use client';
import { useState,useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function CreatePostForm({ onPostCreated }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [blob, setBlob] = useState(null);
  const inputFileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      console.error('You must be signed in to create a post.');
      return;
    }

    const file = inputFileRef.current.files[0];

    const formData = new FormData();
    formData.append('file', file)
    formData.append('title', title)
    formData.append('content', content)

    // Proceed to create the post with the image path
    const response = await fetch(`/api/posts?filename=${file.name}`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const newBlob = (await response.json());
      setBlob(newBlob);

      //const newPost = await response.json();
      //onPostCreated(newPost);
      //setTitle('');
      //setContent('');
    } else {
      console.error('Failed to create post');
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
      <input type="file" ref={inputFileRef} className="mb-4" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Create Post
      </button>
      {blob && (
        <div>
          <a href={blob.url} className="text-white">{blob.url}</a>
        </div>
      )}
    </form>
  );
}
