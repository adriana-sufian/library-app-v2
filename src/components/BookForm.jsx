import { useState, useEffect } from "react";

export default function BookForm({ onSubmit, book, onCancel }) {
  const [form, setForm] = useState({
    title: "", 
    author: "", 
    isbn: "", 
    year: "", 
    genre: "", 
    totalCopies: 1, 
    available: true
  });

  // updates the form when book prop changes
  useEffect(() => {
    if (book) {
      setForm(book);
    } else {
      // Clear form when no book is being edited (for new books)
      setForm({
        title: "", 
        author: "", 
        isbn: "", 
        year: "", 
        genre: "", 
        totalCopies: 1, 
        available: true
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // isbn validation
  const isValidISBN10 = (isbn) => {
    return /^[0-9]{9}[0-9Xx]$/.test(isbn.replace(/-/g, ""));
  };

  // year validation
  const isValidYear = (year) => {
    const currentYear = new Date().getFullYear();
    return /^[0-9]{4}$/.test(year) && parseInt(year) <= currentYear;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre || !form.year || !form.isbn || !form.totalCopies) {
      return alert("Please fill in all required fields.");
    }

    if (!isValidISBN10(form.isbn)) {
      return alert("Invalid ISBN-10. Must be 10 digits.");
    }

    if (!isValidYear(form.year)) {
      return alert("Invalid year. Must be a valid 4-digit year.");
    }
    onSubmit(form);
    // Reset form
    setForm({
      id: "",
      title: "",
      author: "",
      isbn: "",
      year: "",
      genre: "",
      totalCopies: 1,
      available: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
      <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
      <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} required />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
      <input name="totalCopies" type="number" min="1" value={form.totalCopies} onChange={handleChange} required />
      <label>
        <input type="checkbox" name="available" checked={form.available} onChange={handleChange} /> Available
      </label>
      <div >
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {book ? 'Update' : 'Add Book'}
        </button>
        {book && (
          <button 
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}