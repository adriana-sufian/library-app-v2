export default function BookList({ books, onEdit, onDelete }) {
  return (
    <div className="mt-4">
      {books.map((book) => (
        <div key={book.id} className="border p-4 rounded mb-2 bg-gray-50">
          <h3 className="font-bold">{book.title} ({book.year})</h3>
          <p>{book.author} | Genre: {book.genre}</p>
          <p> Total Copies: {book.totalCopies} | On Hold Copies: {book.onHoldCopies || 0} | Available Copies: {book.totalCopies - (book.onHoldCopies || 0)}</p>
          <p>Status: {book.available ? "Available" : "Unavailable"}</p>
          <div className="space-x-2 mt-2">
            <button onClick={() => onEdit(book)} className="text-blue-600">Edit</button>
            <button onClick={() => onDelete(book.id)} className="text-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}