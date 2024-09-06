'use client';

import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        signIn('credentials', {
          redirect: false,
          email: e.target.email.value,
          password: e.target.password.value,
        });
      }}>
        <input type="text" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Sign in with Credentials</button>
      </form>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
    </div>
  );
}
