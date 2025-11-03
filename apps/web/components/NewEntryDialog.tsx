import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, Undo, Redo, Link, Sparkles, Image, Mic } from 'lucide-react';
import { Button } from './ui/button';
import SmoothButton from './SmoothButton';

interface NewEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
//   onSave: ( entry: CreatedEntry) => void;
  mode: "create" | "edit";
  initialEntry?: CreatedEntry;
  onCreate?: (entry: CreatedEntry) => void;
  onUpdate?: (entry: CreatedEntry) => void;
}
export interface CreatedEntry {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export function NewEntryDialog({ isOpen, onClose, mode,
    initialEntry,
    onCreate,
    onUpdate }: NewEntryDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialEntry?.title ?? "");
    setContent(initialEntry?.content ?? "");
    setErrorMessage(null);
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }));
  }, [isOpen, initialEntry]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!content.trim() || !title.trim() || isSaving) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const endpoint =
        mode === "edit"
          ? `/api/journal/${initialEntry!.id}`
          : "/api/journal";
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.entry) {
        throw new Error(data?.error ?? "Failed to save entry");
      }

      if (mode === "edit") {
        onUpdate?.(data.entry as CreatedEntry);
      } else {
        onCreate?.(data.entry as CreatedEntry);
      }
      setTitle("");
      setContent("");
      onClose();
    } catch (error) {
      console.error("Journal save failed", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save entry"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;



  // const getCurrentDate = () => {
  //   const today = new Date();
  //   return today.toLocaleDateString('en-US', { 
  //     month: 'long', 
  //     day: 'numeric',
  //     year: 'numeric'
  //   });
  // };

  return (
    <div className="fixed inset-0 bg-[#e9e9f6] z-50">
      <div className="max-w-4xl mx-auto px-8 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="text-gray-500 text-sm">
            {currentDate}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <Undo className="w-4 h-4" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <Redo className="w-4 h-4" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <Link className="w-4 h-4" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-blue-500 hover:text-blue-600 p-2">
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

       
        {/*Title Area  */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus:outline-none mb-8 font-mono text-lg"
        />

        {/* Content Area */}
        <div className="flex-1 mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-full bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none font-mono"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          {/* <div>
            <Button variant={'outline'} className="px-6 py-2 bg-[#e9e9f6] text-black rounded-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSave}> Save Entry</Button>
          </div> */}

          <div>
           <SmoothButton onClick={handleSave}/>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Image className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
