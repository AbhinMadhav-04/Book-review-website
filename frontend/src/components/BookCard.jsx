import React from "react";


const BookCard = ({ book, onEdit, onDelete, onView, onReview, hideActions }) => {
  return (
    <div className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200/50 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-slate-800/50 flex flex-col items-stretch aspect-[3/5] min-h-[270px] max-h-[340px]">
      <div className="h-40 w-full bg-cover bg-center rounded-t-lg overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800">
        {book.cover || book.image ? (
          <img src={book.cover || book.image} alt={book.title} className="object-cover w-full h-full" />
        ) : (
          <span className="text-slate-400 dark:text-slate-600">No image</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 truncate">{book.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">by {book.author}</p>
        {book.genre && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Genre: {book.genre}</p>
        )}
        {book.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 line-clamp-3">{book.description}</p>
        )}
        {book.addedBy && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Added by: {book.addedBy.fullName || book.addedBy.name || book.addedBy.email}</p>
        )}
        <div className="mt-4 flex gap-2">
          {!hideActions && onEdit && (
            <button
              onClick={() => {
                try {
                  onEdit(book._id);
                } catch (err) {
                  console.log('[BookCard] Edit action failed:', err);
                }
              }}
              className="flex h-8 items-center justify-center rounded-md bg-primary/10 px-3 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
            >
              Edit
            </button>
          )}
          {!hideActions && onDelete && (
            <button
              onClick={() => {
                try {
                  onDelete(book._id);
                } catch (err) {
                  console.log('[BookCard] Delete action failed:', err);
                }
              }}
              className="flex h-8 items-center justify-center rounded-md bg-red-500/10 px-3 text-sm font-medium text-red-600 hover:bg-red-500/20 dark:text-red-500 dark:bg-red-500/20 dark:hover:bg-red-500/30"
            >
              Delete
            </button>
          )}
          {onView && (
            <button
              onClick={() => {
                try {
                  onView(book._id);
                } catch (err) {
                  console.log('[BookCard] View action failed:', err);
                }
              }}
              className="flex h-8 items-center justify-center rounded-md bg-orange-600 dark:bg-orange-800 px-3 text-sm font-medium text-white hover:bg-orange-700 dark:hover:bg-orange-900"
            >
              View
            </button>
          )}
          {/* Review button for BookList */}
          {typeof onReview === 'function' && (
            <button
              onClick={() => {
                try {
                  onReview(book);
                } catch (err) {
                  console.log('[BookCard] Review action failed:', err);
                }
              }}
              className="flex h-8 items-center justify-center rounded-md bg-yellow-500 px-3 text-sm font-medium text-white hover:bg-yellow-600"
            >
              Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
