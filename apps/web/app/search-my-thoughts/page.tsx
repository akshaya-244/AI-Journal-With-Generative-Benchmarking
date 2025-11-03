"use client";
import { useState, useEffect } from 'react';
import { Search, Moon, Sun, MoreVertical, Sparkles } from 'lucide-react';
import { CreatedEntry, NewEntryDialog } from '@/components/NewEntryDialog';
import { EntryCard } from '@/components/EntryCard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { EntryList } from '@/components/EntryList';


interface Entry {
    id: string;
    title: string;
    content: string;
    date: string;
    isEmpty: boolean;
  }
  

export default function SearchApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [semanticSearchResults, setSemanticSearchResults] = useState<Entry[]>([])

 // Check authentication on mount
 useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/journal", { method: "GET" });
      if (!res.ok) {
        router.push("/");
      } else {
        setIsAuth(true);
      }
    } catch {
      router.push("/");
    }
  };
  checkAuth();
}, [router]);


  const openEditDialog = (entry: Entry) => {
    setDialogMode("edit");
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };
  const handleCreate = (entry: CreatedEntry) => {
    const normalized = normalizeEntry(entry);
    setEntries((prev) => [normalized, ...prev]);
  };

  const handleUpdate = (entry: CreatedEntry) => {
    const normalized = normalizeEntry(entry);
    setEntries((prev) =>
      prev.map((item) => (item.id === normalized.id ? normalized : item))
    );
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      // Remove from UI
      setSemanticSearchResults((prev) => prev.filter((entry)=> entry.id !== id));
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  const normalizeEntry = (entry: CreatedEntry ): Entry => ({
    id: entry.id,
    content: entry.content,
    title: entry.title,
    date: new Date(entry.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    isEmpty: !entry.content.trim(),
  });

  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [darkMode]);

  useEffect(() => {
    let isMounted = true;
    const loadentries = async () => {
        try{
            const response = await fetch("/api/journal", {
                method: "GET",
            });
            if(!response.ok) throw new Error("Failed to load entries")
    
            const {entries: apiEntries} = await response.json()
            if(!isMounted) return
            setEntries(
                apiEntries.map(normalizeEntry)
            );
    
        }
        catch(e){
            console.log("Journal fetch failed",e)
        }
    }
    loadentries();
    return () => {
        isMounted=false;
    }
  }, [])

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock semantic search - in a real app, this would call an AI API

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setShowResults(value.length > 0);
    setUseSemanticSearch(false);
  };

  const handleAISearch = async () => {
    setIsSearching(true);
    const loadSearchEntries = async() => {
        try{
            const response = await fetch("/api/query_entries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({query: searchQuery})
            });

            if(!response.ok) throw new Error("response fetch failed")
            const {formattedResults: res} = await response.json()
            const normalizedResults = res.map((result: any) => ({
              id: result.id,
              title: result.title,
              content: result.content,
              date: new Date(result.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              isEmpty: !result.content.trim(),
            }));
      
            setSemanticSearchResults(normalizedResults);
        }catch(e){
            console.log("Fetch error",e)
        }
        
    }
    setUseSemanticSearch(true);
    await loadSearchEntries()
    setIsSearching(false);
  };

  const displayEntries = useSemanticSearch ? semanticSearchResults : filteredEntries;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors py-12">
      {/* Toggle button */}
      {/* <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all text-gray-900 dark:text-white"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button> */}

      <div className="max-w-3xl mx-auto px-6">
        {/* Search Section */}
        <div className={`${showResults ? 'mb-4' : 'min-h-[60vh] flex flex-col justify-center'} transition-all`}>
          <h1 className="text-center font-semibold text-3xl mb-8 text-gray-900 dark:text-white">
          The intelligent way to explore, and understand your thoughts.
          </h1>
          
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search your thoughts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-lg dark:shadow-2xl outline-none  transition-all"
            />
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div>
          {displayEntries.length === 0 && (
                <div className="text-center py-12">
                  {/* <p className="text-gray-400 dark:text-gray-500 mb-6">
                    No entries found matching your search.
                  </p> */}
                  <Button
                  size={'xl'}
                   variant={'outline'}
                    onClick={handleAISearch}
                    disabled={isSearching}
                    className="active:scale-95 inline-flex items-center gap-2 px-6 py-3 dark:text-white text-black rounded-full transition-colors shadow-lg hover:shadow-xl"
                  >
                   
                    {isSearching ? 'Searching...' : 'AI search'}
                  </Button>
                </div>
              )}
            <div className="space-y-4">
            

              <EntryList entries={displayEntries}
              handleDelete={handleDelete}
              onCardClick={(entry:Entry) => openEditDialog(entry)}
              />

               <NewEntryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          mode={dialogMode}
            initialEntry={
                selectedEntry ? {
                id: selectedEntry.id,
                title: selectedEntry.title,
                content: selectedEntry.content,
                createdAt: new Date(selectedEntry.date).toISOString(),
                }: undefined
            }
            onUpdate={handleUpdate}
        />
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
