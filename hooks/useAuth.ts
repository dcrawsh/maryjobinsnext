"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signUp({ email, password, name }: { email: string; password: string; name: string }) {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });
    setLoading(false);
    return error;
  }

  async function signIn({ email, password }: { email: string; password: string }) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (!error) router.push("/");
    return error;
  }

  async function resetPassword(email: string) {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);
    return error;
  }

  return { loading, signUp, signIn, resetPassword };
}
