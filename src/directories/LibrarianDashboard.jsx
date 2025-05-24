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


return (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Library Book Management</h1>
    <input
      type="text"
      placeholder="Search by title, author, genre, or ISBN"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-2 border mb-4"
    />
    <BookForm onSubmit={handleSave} book={editingBook} onCancel={handleCancelEdit}/>
    <BookList books={sortedBooks} onEdit={handleEdit} onDelete={handleDelete} />
    <h2 className="text-xl font-semibold mt-8 mb-2">Loan Management</h2>
    <LoanForm onSubmit={handleSaveLoan} books={books} loan={editingLoan} onCancel={handleCancelLoanEdit}/>
    <LoanList loans={sortedLoans} books={books} onEdit={setEditingLoan} onDelete={handleDeleteLoan} onReturn={handleReturnLoan} />
    <button
      onClick={() => {
        localStorage.removeItem("librarianUser");
        window.location.href = "/";
      }}
      className="text-sm text-red-600 underline mt-4"
    >
      Logout
    </button>
  </div>
);}
