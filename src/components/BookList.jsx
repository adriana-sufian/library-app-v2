export default function BookList({ books, onEdit, onDelete }) {
  return (
    <div className="mt-4 space-y-4">
      {books.map((book) => (
        <div key={book.id} className="card bg-base-100 shadow-sm rounded border p-4">
          <h3 className="card-title font-bold text-lg justify-center">
            {book.title} <span className="text-sm font-normal text-gray-500">({book.year})</span>
          </h3>
          <p className="text-sm text-gray-600">
            {book.author} | Genre: {book.genre} | ISBN: {book.isbn}
          </p>
          <p className="text-sm mt-1">
            Total Copies: <span className="font-semibold">{book.totalCopies}</span> | On Hold Copies: <span>{book.onHoldCopies || 0}</span> | Available Copies: <span>{book.totalCopies - (book.onHoldCopies || 0)}</span>
          </p>
          <p className="mt-1">
            Status: {book.available ? (
              <span className="badge badge-success">Available</span>
            ) : (
              <span className="badge badge-error">Unavailable</span>
            )}
          </p>
          <div className="card-actions mt-4 space-x-2 justify-center">
            <button onClick={() => onEdit(book)} className="btn btn-outline btn-sm btn-primary">
              Edit
            </button>
            <button onClick={() => onDelete(book.id)} className="btn btn-outline btn-sm btn-error">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}