import { useState, useEffect } from "react";
import { getBooks, saveBooks, recalculateBookHoldCounts, seedBooks } from "../utils/dataService";
import { getLoans, saveLoans } from "../utils/loanService";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import LoanForm from "../components/LoanForm";
import LoanList from "../components/LoanList";
import { v4 as uuidv4 } from "uuid";

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const [loans, setLoans] = useState([]);
  const [editingLoan, setEditingLoan] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    seedBooks();
    setBooks(getBooks());
    setLoans(getLoans());
  }, []);

  const handleSave = (book) => {
    let updated;
    if (book.id) {
      updated = books.map(b => (b.id === book.id ? book : b));
    } else {
      book.id = uuidv4();
      updated = [...books, book];
    }
    setBooks(updated);
    saveBooks(updated);
    setEditingBook(null);
  };

  const handleEdit = (book) => setEditingBook(book);
  const handleDelete = (id) => {
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    saveBooks(updated);
  };

  const handleSaveLoan = (loan) => {
    let updated;
    let isNewLoan = false;
    
    if (loan.id) {
      // Editing existing loan
      updated = loans.map(l => l.id === loan.id ? loan : l);
    } else {
      // Creating new loan
      loan.id = uuidv4();
      updated = [...loans, loan];
      isNewLoan = true;
    }
    
    setLoans(updated);
    saveLoans(updated);
    setEditingLoan(null);

    // Update book copies only for NEW loans with Active status
    if (isNewLoan && loan.status === "Active") {
      const updatedBooks = books.map(book => {
        if (book.id === loan.bookId && book.copies > 0) {
          const newCopies = book.copies - 1;
          return {
            ...book,
            copies: newCopies,
            available: newCopies > 0,
          };
        }
        return book;
      });
      
      setBooks(updatedBooks);
      saveBooks(updatedBooks);
      const resyncedBooks = recalculateBookHoldCounts();
      setBooks(resyncedBooks);
    }
  };

  const handleDeleteLoan = (id) => {
    const updated = loans.filter(l => l.id !== id);
    setLoans(updated);
    saveLoans(updated);
  };

  // return loans
  const handleReturnLoan = (loan) => {
    // 1. Update loan status
    const updatedLoans = loans.map(l =>
      l.id === loan.id ? { ...l, status: "Returned" } : l
    );
    setLoans(updatedLoans);
    saveLoans(updatedLoans);

    // 2. Increment book copy count
    const updatedBooks = books.map(b => {
      if (b.id === loan.bookId) {
        const newCopies = (b.totalCopies || 0) > 0 ? b.totalCopies : b.copies + 1;
        return {
          ...b,
          copies: newCopies,  // optional legacy field
          totalCopies: b.totalCopies || newCopies,
        };
      }
      return b;
    });

    saveBooks(updatedBooks);

    // 3. Recalculate onHoldCounts + update UI
    const resyncedBooks = recalculateBookHoldCounts();
    setBooks(resyncedBooks);
  };

  // edit , cancel list
  const handleCancelEdit = () => setEditingBook(null);
  const handleCancelLoanEdit = () => setEditingLoan(null);

  // sort book list by genre
  const sortedBooks = [...books]
  .filter(b => {
    const term = searchTerm.toLowerCase();
    return (
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term) ||
      b.genre.toLowerCase().includes(term) ||
      b.isbn.toLowerCase().includes(term)
    );
  })
  .sort((a, b) => a.genre.localeCompare(b.genre));

  // sort loan list by genre
  const sortedLoans = [...loans].sort((a, b) => {
  const genreA = books.find(book => book.id === a.bookId)?.genre || "";
  const genreB = books.find(book => book.id === b.bookId)?.genre || "";
    return genreA.localeCompare(genreB);
  });

  const [activeTab, setActiveTab] = useState("books");

  const logout = () => {
    localStorage.removeItem("librarianUser");
    window.location.href = "/";
  };


return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">📚 Librarian Dashboard</h1>
        <button onClick={logout} className="text-sm text-red-600 hover:underline">
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          className={`pb-2 px-2 ${
            activeTab === "books"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("books")}
        >
          Manage Books
        </button>
        <button
          className={`pb-2 px-2 ${
            activeTab === "loans"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("loans")}
        >
          Loan Management
        </button>
      </div>

      {/* Search (common to both tabs or can be conditional) */}
      {activeTab === "books" && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Search Books</h2>
          <input
            type="text"
            placeholder="Search by title, author, genre, or ISBN"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded shadow-sm"
          />
        </section>
      )}

      {/* Tab Content */}
      {activeTab === "books" && (
        <section className="space-y-4">
          <BookForm onSubmit={handleSave} book={editingBook} onCancel={handleCancelEdit} />
          <BookList books={sortedBooks} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
      )}

      {activeTab === "loans" && (
        <section className="space-y-4">
          <LoanForm
            onSubmit={handleSaveLoan}
            books={books}
            loan={editingLoan}
            onCancel={handleCancelLoanEdit}
          />
          <LoanList
            loans={sortedLoans}
            books={books}
            onEdit={setEditingLoan}
            onDelete={handleDeleteLoan}
            onReturn={handleReturnLoan}
          />
        </section>
      )}
    </div>
  );
}
