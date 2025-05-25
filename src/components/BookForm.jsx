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
    <form
      onSubmit={handleSubmit}
      className="card bg-base-100 shadow p-6 space-y-6"
    >
      <div className="flex flex-wrap lg:flex-row gap-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="input input-bordered w-44 flex-1"
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
          className="input input-bordered w-44 flex-1"
        />
        <input
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          required
          className="input input-bordered w-30 flex-1"
        />
        <input
          name="year"
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          required
          className="input input-bordered w-30 flex-1"
        />
        <input
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
          required
          className="input input-bordered w-44 flex-1"
        />
        <input
          name="totalCopies"
          type="number"
          min="1"
          placeholder="Total Copies"
          value={form.totalCopies}
          onChange={handleChange}
          required
          className="input input-bordered w-20 flex-1"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
            className="checkbox"
          />
          <span className="label-text">Available</span>
        </label>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            {book ? 'Update' : 'Add Book'}
          </button>
          {book && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}