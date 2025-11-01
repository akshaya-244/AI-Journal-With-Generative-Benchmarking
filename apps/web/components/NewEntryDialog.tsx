import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, Undo, Redo, Link, Sparkles, Image, Mic } from 'lucide-react';
import { Button } from './ui/button';

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
    content: string;
    createdAt: string;
}

export function NewEntryDialog({ isOpen, onClose, mode,
    initialEntry,
    onCreate,
    onUpdate }: NewEntryDialogProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setContent(initialEntry?.content ?? "");
    setErrorMessage(null);
  }, [isOpen, initialEntry]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!content.trim() || isSaving) return;

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
        body: JSON.stringify({ content: content.trim() }),
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

//   const handleSave = async() => {
//     if(!content.trim() || isSaving)     return;

//     setIsSaving(true);
//     setErrorMessage(null);

//     try{
//         const response = await fetch("/api/journal", {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify({content: content.trim()}),
//         });

//         const data = await response.json().catch(() => null);

//         if (!response.ok || !data?.entry) {
//             throw new Error(data?.error ?? "Failed to save entry");
//           }
    
//           onSave?.(data.entry as CreatedEntry);
//           setContent("");
//           setImageUrl("");
//           onClose();
//     } catch (error) {
//           console.error("Failed to save journal entry", error);
//           setErrorMessage(
//             error instanceof Error ? error.message : "Failed to save entry"
//           );
//         } finally {
//           setIsSaving(false);
//         }
    
//   };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

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
            {getCurrentDate()}
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
          <div>
            <Button onClick={handleSave}> Save Entry</Button>
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
