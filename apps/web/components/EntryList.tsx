import { useEffect, useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";
import { EntryCard, type Entry } from "./EntryCard";
import SmoothButton2 from "./SmoothButton2";

interface EntryListProps {
  entries: Entry[];
  handleDelete: (id: string) => Promise<void>;
  onCardClick: any

}

export function EntryList({ entries, handleDelete, onCardClick }: EntryListProps) {
  const [activeEntry, setActiveEntry] = useState<Entry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Close modal on outside click
  useOnClickOutside<HTMLDivElement>(ref as React.RefObject<HTMLDivElement>, () => {
    if (!isDeleting) {
      setActiveEntry(null);
    }
  });

  // Close modal on "Escape" key
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        setActiveEntry(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDeleting]);


    // const onCardClick_2 = (id: any) => {
    //   const entry = entries.find((e) => e.id === id);
    //   if (entry) {
    //     onCardClick(entry);
    //   }
    // }


  // Handle the delete logic
  const onDeleteClick = async () => {
    if (!activeEntry) return;

    setIsDeleting(true);
    try {
      await handleDelete(activeEntry.id);
      setActiveEntry(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

//   const handleDelete = async () => {
//     if(!activeEntry || !onDelete) return;

//     setIsDeleting(true)
//     try {
//         await onDelete(activeEntry.id);
//         setActiveEntry(null);
//       } catch (error) {
//         console.error("Delete failed:", error);
//       } finally {
//         setIsDeleting(false);
//       }
// }

  return (
    <>
      {/* 1. The Overlay */}
      <AnimatePresence>
        {activeEntry ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Tailwind classes for the overlay
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
        ) : null}
      </AnimatePresence>

      {/* 2. The Expanded Card (Delete Modal) */}
      <AnimatePresence>
        {activeEntry ? (
          // Tailwind classes for centering the modal
          <div className="fixed inset-0 z-50 grid place-items-center">
            <motion.div
              layoutId={`card-${activeEntry.id}`}
              // Tailwind classes for the modal's inner container
              className="flex h-fit w-[500px] max-w-[90%] flex-col items-start gap-4 overflow-hidden bg-white p-4 shadow-2xl"
              style={{ borderRadius: 12 }} // Style prop for smooth border-radius animation
              // ref={ref}
            >
              {/* Header section */}
              <div className="flex w-full flex-grow items-center justify-between">
                <div className="flex flex-col">
                  <motion.h2
                    layoutId={`title-${activeEntry.id}`}
                    // Tailwind classes for the modal title
                    className="text-base font-semibold"
                  >
                    {activeEntry.title}
                  </motion.h2>
                  <motion.p
                    layoutId={`date-${activeEntry.id}`}
                    // Tailwind classes for the modal description
                    className="text-sm text-gray-600"
                  >
                    {activeEntry.date}
                  </motion.p>
                </div>
              </div>

              {/* Delete confirmation content */}
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                // Tailwind classes for the description content
                className="w-full text-sm text-gray-600"
              >
                {/* <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Delete Entry?
                </h3> */}
                {/* <p className="mb-6 text-gray-600">
                  This action cannot be undone. The entry will be permanently
                  deleted.
                </p> */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setActiveEntry(null)}
                    disabled={isDeleting}
                    className=" active:scale-95 transition-transform rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <SmoothButton2 onClick={onDeleteClick} />
{/* 
                  <button
                    onClick={onDeleteClick}
                    disabled={isDeleting}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 active:scale-95 transition-transform"  />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button> */}
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* 3. The List of Cards */}
      <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onCardClick={onCardClick}
            onExpandClick={() => setActiveEntry(entry)}
          />
        ))}
      </div>
    </>
  );
}