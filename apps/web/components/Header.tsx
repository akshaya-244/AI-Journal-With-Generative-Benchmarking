"use client";
import { authClient } from '@/app/lib/auth-client';
import { Brain, SearchIcon, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function Header() {
    
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  }

  const handleSearch = () => {
    router.push("/search-my-thoughts");
  };


  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
      <Brain className="w-6 h-6 text-amber-700" />
        <h1 className="text-gray-900">AI Journal</h1>
      </div>
      <div className="flex items-center gap-3">

      <Tooltip>
      <TooltipTrigger asChild>
      <button
          onClick={handleSearch}
          className="w-10 h-10 rounded-full text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
          aria-label="Search"
          title="Search my thoughts"
        >
          <SearchIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Search</p>
      </TooltipContent>
    </Tooltip>

        

        <Tooltip>
      <TooltipTrigger asChild>
      <button
          onClick={handleSignOut}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Sign out"
          title="Sign out"
        >
          <User className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Logout</p>
      </TooltipContent>
    </Tooltip>


        
      </div>
    </header>
  );
}
