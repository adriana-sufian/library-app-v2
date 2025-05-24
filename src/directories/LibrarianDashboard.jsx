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

  // for librarians to see borrow requests
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const updatedBooks = recalculateBookHoldCounts();
    setBooks(updatedBooks);
    setLoans(getLoans());
    const existingRequests = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    setRequests(existingRequests);
  }, []);

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


// loan management - borrow request
const handleApproveRequest = (request) => {
  const newLoans = request.bookIds.map(bookId => {
    const loanDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(loanDate.getDate() + 14);

    return {
      id: uuidv4(),
      bookId,
      memberName: request.memberName,
      loanDate: loanDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      status: "Active",
    };
  });

  // Update loans
  const updatedLoans = [...loans, ...newLoans];
  setLoans(updatedLoans);
  saveLoans(updatedLoans);

  // Update books (decrease copies)
  const updatedBooks = books.map(book => {
    if (request.bookIds.includes(book.id) && book.copies > 0) {
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

  // Remove request
  const updatedRequests = requests.filter(r => r.id !== request.id);
  setRequests(updatedRequests);
  localStorage.setItem("borrowRequests", JSON.stringify(updatedRequests));
};

  // edit , cancel list
  const handleCancelEdit = () => setEditingBook(null);
  const handleCancelLoanEdit = () => setEditingLoan(null);

  // total, on hold, available copies
  useEffect(() => {
    const allBooks = getBooks();
    const allLoans = getLoans();
    const allRequests = JSON.parse(localStorage.getItem("borrowRequests")) || [];

    // Step 1: build on-hold copy count map
    const holdCountMap = {};

    // Count from loans
    allLoans.forEach(loan => {
      if (loan.status === "Active") {
        holdCountMap[loan.bookId] = (holdCountMap[loan.bookId] || 0) + 1;
      }
    });

    // Count from borrow requests
    allRequests.forEach(req => {
      req.bookIds.forEach(bookId => {
        holdCountMap[bookId] = (holdCountMap[bookId] || 0) + 1;
      });
    });

    // Step 2: apply onHoldCopies to books
    const updatedBooks = allBooks.map(book => ({
      ...book,
      onHoldCopies: holdCountMap[book.id] || 0,
    }));

    // Step 3: save and set state
    saveBooks(updatedBooks);
    setBooks(updatedBooks);
    setLoans(allLoans);
    setRequests(allRequests);
  }, []);

  // sort book list by genre
  const sortedBooks = [...books].sort((a, b) => {
    return a.genre.localeCompare(b.genre);
  });

  // sort loan list by genre
  const sortedLoans = [...loans].sort((a, b) => {
  const genreA = books.find(book => book.id === a.bookId)?.genre || "";
  const genreB = books.find(book => book.id === b.bookId)?.genre || "";
    return genreA.localeCompare(genreB);
  });


return (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Library Book Management</h1>
    <BookForm onSubmit={handleSave} book={editingBook} onCancel={handleCancelEdit}/>
    <BookList books={sortedBooks} onEdit={handleEdit} onDelete={handleDelete} />
    <h2 className="text-xl font-semibold mt-8 mb-2">Loan Management</h2>
    <LoanForm onSubmit={handleSaveLoan} books={books} loan={editingLoan} onCancel={handleCancelLoanEdit}/>
    <LoanList loans={sortedLoans} books={books} onEdit={setEditingLoan} onDelete={handleDeleteLoan} onReturn={handleReturnLoan} />
    <h2 className="text-xl font-semibold mt-8 mb-2">Borrow Requests</h2>
    {requests.map((req) => (
      <div key={req.id} className="border p-4 rounded mb-2 bg-yellow-50">
        <p><strong>Member:</strong> {req.memberName}</p>
        <p><strong>Date:</strong> {req.requestDate}</p>
        <p><strong>Books:</strong></p>
        <ul className="list-disc list-inside ml-4">
          {req.bookIds.map(id => {
            const book = books.find(b => b.id === id);
            return <li key={id}>{book ? book.title : "(Unknown Book)"}</li>;
          })}
        </ul>
        <button
          onClick={() => handleApproveRequest(req)}
          className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded"
        >
          Approve Request
        </button>
      </div>
    ))}
  </div>
);}
