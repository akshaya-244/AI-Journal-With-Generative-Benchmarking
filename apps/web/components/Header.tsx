"use client";
import { authClient } from '@/app/lib/auth-client';
import { BookOpen, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
    
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  }
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-amber-700" />
        <h1 className="text-gray-900">AI Journal</h1>
      </div>
      <button
        onClick={handleSignOut}
        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
        aria-label="Sign out"
        title="Sign out"
      >
        <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
    </header>
  );
}
