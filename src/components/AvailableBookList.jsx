export default function AvailableBookList({ books, selectedBooks, onToggleBook }) {
  return (
    <div className="space-y-2">
      {books.map(book => (
        <label
          key={book.id}
          className="flex items-center space-x-2 border p-2 rounded"
        >
          <input
            type="checkbox"
            checked={selectedBooks.includes(book.id)}
            onChange={() => onToggleBook(book.id)}
          />
          <span>{book.title} — {book.author} ({book.genre})</span>
        </label>
      ))}
    </div>
  );
}
