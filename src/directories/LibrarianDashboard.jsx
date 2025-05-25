import { useState, useEffect, useRef } from "react";
import { getBooks, saveBooks, recalculateBookHoldCounts, seedBooks } from "../utils/dataService";
import { getLoans, saveLoans } from "../utils/loanService";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import LoanForm from "../components/LoanForm";
import LoanList from "../components/LoanList";
import CollapsibleCard from "../components/CollapsibleCard";
import { v4 as uuidv4 } from "uuid";

export default function LibrarianDashboard() {
  useEffect(() => {
    document.title = "Librarian Dashboard";
  }, []);

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
  const formWrapperRef = useRef(null);
  const handleEdit = (book) => {
    setEditingBook(book); 
    formWrapperRef.current?.scrollIntoView({ behavior: "smooth" });
  }
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
  
  const loanFormRef = useRef(null);
  const handleEditLoan = (loan) => {
    setEditingLoan(loan);
    loanFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        <h1 className="text-3xl font-bold">📚 Librarian Dashboard</h1>
        <button onClick={logout} className="btn btn-sm btn-outline btn-error">
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered">
        <button
          role="tab"
          className={`tab ${activeTab === "books" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          Manage Books
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === "loans" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("loans")}
        >
          Loan Management
        </button>
      </div>

      {/* Search (only shown for books) */}
      {activeTab === "books" && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Search Books</h2>
          <input
            type="text"
            placeholder="Search by title, author, genre, or ISBN"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
        </section>
      )}

      {/* Tab Content */}
      {activeTab === "books" && (
        <section className="space-y-4">
          <CollapsibleCard title="Manage Books">
            <div ref={formWrapperRef}>
              <BookForm onSubmit={handleSave} book={editingBook} onCancel={handleCancelEdit} />
            </div>
          </CollapsibleCard>
          <BookList books={sortedBooks} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
      )}

      {activeTab === "loans" && (
        <section className="space-y-4">
          <CollapsibleCard title="Manage Loans">
            <div ref={loanFormRef}>
              <LoanForm
              onSubmit={handleSaveLoan}
              books={books}
              loan={editingLoan}
              onCancel={handleCancelLoanEdit}
            />
            </div>
          </CollapsibleCard>
          <LoanList
            loans={sortedLoans}
            books={books}
            onEdit={handleEditLoan}
            onDelete={handleDeleteLoan}
            onReturn={handleReturnLoan}
          />
        </section>
      )}
    </div>
  );
}
