import { MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
// import { ImageWithFallback } from './figma/ImageWithFallback';

interface EntryCardProps {
  title: string;
  date: string;
  image?: string;
  isEmpty?: boolean;
  onClick?: () => void;
  onDelete?: (id: string) => Promise<void>
  id?: string;
}

export function EntryCard({ title, date, image, isEmpty, onClick, onDelete, id }: EntryCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if(!id || !onDelete) return;

        setIsDeleting(true)
        try {
            await onDelete(id);
            setShowDeleteConfirm(false);
          } catch (error) {
            console.error("Delete failed:", error);
          } finally {
            setIsDeleting(false);
          }
    }
    return (
    <div 
      className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {/* {image && ( */}
            <div className="mb-3 w-60 h-40 overflow-hidden rounded-lg">
              <Image 
                src="/hero1.png"
                alt={title}
                width={160}
                height={160}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          <p className={`mb-1 text-base  font-medium `}>
            {title}
          </p>
          <p className="text-gray-500 text-sm">{date}</p>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
       {/* Delete Confirmation Modal */}
       {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Entry?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The entry will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={(e) =>{
                    e.stopPropagation();
                    setShowDeleteConfirm(false)}}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()}}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
 
    </div>
  );
}
