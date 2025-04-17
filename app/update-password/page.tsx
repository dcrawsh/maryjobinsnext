// app/update-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    setIsUpdating(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsUpdating(false);
    if (error) return alert(error.message);
    alert('Password updated — you’re signed in');
    router.push('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <input
          type="password"
          className="border p-2 rounded w-64"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleUpdate}
          disabled={isUpdating || password.length < 6}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {isUpdating ? 'Updating…' : 'Update password'}
        </button>
      </div>
    </div>
  );
}
