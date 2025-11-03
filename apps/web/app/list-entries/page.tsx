
"use client";
import { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Header } from '@/components/Header';
import { EntryCard } from '@/components/EntryCard';
import { CreatedEntry, NewEntryDialog } from '@/components/NewEntryDialog';
import { methods } from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { EntryList } from '@/components/EntryList';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Spinner } from '@/components/Spinner';


interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
  isEmpty: boolean;
}

export default function ListEntries() {
 const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [loader, setLoader] =useState(false)
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

    


  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedEntry(null);
    setIsDialogOpen(true);
  };

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

  const normalizeEntry = (entry: CreatedEntry): Entry => ({
    id: entry.id,
    content: entry.content,
    title: entry.title,
    date: new Date(entry.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    isEmpty: !entry.content.trim() 
  });

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      // Remove from UI
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };



 
  useEffect(() => 
    {
        //used to prevent memory leak 
        setLoader(true);
        let isMounted=true;
        const loadEntries = async () => {
        try{
           const res =  await fetch("/api/journal",{ method: "GET"});
           
            
            //renames entruies variable to apiEntries to avoid conflict
            const {entries: apiEntries} = await res.json();

            if(!isMounted) return;
            setEntries(
                //so raw json data is formatted to normalised entries and then stored inside setEntries
                apiEntries.map(normalizeEntry)
            );
        } catch (error) {
            console.error("Journal fetch failed", error);
            // optionally surface an error state here
        }
      };
        const execute = async () => {
          await loadEntries();
          setLoader(false);
        }
        execute()
        
        return () => {
            isMounted = false;
  };
    
  }, [isAuth])

  return (
    <div className="min-h-screen bg-[#e9e9f6]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TooltipProvider>
        <Header />
        </TooltipProvider>
        
        {/* New Entry Button */}
        <button
          onClick={openCreateDialog}
          className="w-full bg-white rounded-lg p-4 mb-4 flex items-center gap-2 text-gray-400 hover:text-gray-600 hover:shadow-md transition-all border border-gray-100"
        >
          <Plus className="w-5 h-5" />
          <span>New Entry</span>
        </button>

        {/* Search and Filter */}
        {/* <div className="flex justify-end gap-2 mb-4">
          <button className="text-gray-400 hover:text-gray-600 p-2">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 p-2">
            <Filter className="w-5 h-5" />
          </button>
        </div> */}

        {/* My Entries */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         */}

        {
          loader ? (
          <div className='flex flex-col items-center mt-4 font-3xl'>
             <Spinner />
             </div>) : 
             (
         
            <div>
            <EntryList
            entries= {entries}
            handleDelete = {handleDelete}
            onCardClick = {(entry:Entry) => openEditDialog(entry)}
            />
        </div>
          )
        }
       

        {/* New Entry Dialog */}
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
            onCreate={handleCreate}
            onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
