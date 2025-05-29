"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import Image from "next/image";

export default function Nav() {
  const pathname = usePathname();
  const { session } = useSession({ isProtectedRoute: false });
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("user_jobs")
        .select("job_id", { head: true, count: "exact" })
        .eq("user_id", userId)
        .eq("status", "new");
      if (!error) setNewCount(count ?? 0);
    };

    fetchCount();

    const channel = supabase
      .channel(`realtime:user_jobs_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_jobs",
          filter: `user_id=eq.${userId}`,
        },
        fetchCount
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const navItems = [
    { label: "Account", href: "/account" },
    { label: "Job Search", href: "/my-search" },
    { label: "Job Listings", href: "/my-jobs", badge: newCount },
    { label: "Quiz", href: "/job-search-quiz" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="h-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/img/favicon.png"
            alt="MaryJobins"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="font-semibold text-lg text-gray-800">
            MaryJobins
          </span>
        </Link>
        <div className="flex space-x-6">
          {navItems.map(({ label, href, badge }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-sm font-medium ${
                  isActive
                    ? "text-gray-900 underline underline-offset-4 decoration-gray-400"
                    : "text-gray-600 hover:text-gray-900 hover:underline hover:decoration-gray-300"
                }`}
              >
                {label}
                {badge && badge > 0 && (
                  <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full leading-none">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
