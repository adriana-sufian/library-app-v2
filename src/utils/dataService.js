import { getLoans } from "./loanService";
export const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
export const saveBooks = (books) => localStorage.setItem("books", JSON.stringify(books));

export const getAvailableBooks = () => {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  return books.filter(book => {
    const onHold = book.onHoldCopies || 0;
    const available = (book.totalCopies || 0) - onHold;
    return available > 0;
  });
};

export const recalculateBookHoldCounts = () => {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const loans = getLoans();
  const requests = JSON.parse(localStorage.getItem("borrowRequests")) || [];

  const holdMap = {};

  loans.forEach(l => {
    if (l.status === "Active") {
      holdMap[l.bookId] = (holdMap[l.bookId] || 0) + 1;
    }
  });

  requests.forEach(r => {
    r.bookIds.forEach(id => {
      holdMap[id] = (holdMap[id] || 0) + 1;
    });
  });

  const updatedBooks = books.map(b => ({
    ...b,
    onHoldCopies: holdMap[b.id] || 0,
  }));

  localStorage.setItem("books", JSON.stringify(updatedBooks));
  return updatedBooks;
};

// sample books to load for first time running
export const seedBooks = () => {
  const existing = JSON.parse(localStorage.getItem("books"));
  if (existing && existing.length > 0) return; // already seeded

  const sampleBooks = [
    {
      author: "Robert Galbraith",
      available: true,
      copies: "1",
      genre: "Crime Fiction",
      id: "2f91c00b-ac17-4a6b-b39b-a687551740a2",
      isbn: "0316351989",
      onHoldCopies: 0,
      title: "The Silkworm",
      totalCopies: "1",
      year: "2015",
    },
    {
      author: "James Clear",
      available: true,
      copies: "10",
      genre: "Self Help",
      id: "9054a529-29f5-400a-9e1c-3ef31ddb347c",
      isbn: "0735211299",
      onHoldCopies: 0,
      title: "Atomic Habit",
      totalCopies: "10",
      year: "2018",
    },
    {
      author: "Simon Sinek",
      available: true,
      copies: "3",
      genre: "Self Help",
      id: "956d071c-3218-4c60-9f9c-17d20665568c",
      isbn: "1591846447",
      onHoldCopies: 0,
      title: "Start with Why",
      totalCopies: "3",
      year: "2011",
    },
    {
      author: "Antoine de Saint-Exupéry",
      available: true,
      copies: "5",
      genre: "Classic Literature",
      id: "4f7597e0-f880-4ce9-8261-94b90944a272",
      isbn: "0156012197",
      onHoldCopies: 0,
      title: "The Little Prince",
      totalCopies: "5",
      year: "2000",
    },
    {
      author: "Kurt Vonnegut",
      available: true,
      copies: "4",
      genre: "Classic Literature",
      id: "6f101ca6-f9f3-4c1a-a8a4-ececa8d4f905",
      isbn: "038533348X",
      onHoldCopies: 0,
      title: "Cat's Cradle",
      totalCopies: "4",
      year: "1998",
    },
    {
      author: "F. Scott Fitzgerald",
      available: true,
      genre: "Classic Literature",
      id: "077d9739-0a0c-4858-98af-a3bab448d658",
      isbn: "8745274824",
      onHoldCopies: 0,
      title: "The Great Gatsby",
      totalCopies: "10",
      year: "1925",
    },
    {
      author: "George Orwell",
      available: true,
      genre: "Classic Literature",
      id: "4b9bc9e4-56a4-409e-a793-5b288a1d6f58",
      isbn: "9780451524935",
      onHoldCopies: 0,
      title: "1984",
      totalCopies: "3",
      year: "1961",
    },
    {
      author: "Eckhart Tolle",
      available: true,
      genre: "Self Help",
      id: "68f4acff-c176-48e2-9ab6-c9d43c67cf5f",
      isbn: "1577314808",
      onHoldCopies: 0,
      title: "The Power of Now",
      totalCopies: "2",
      year: "2004",
    },
    {
      author: "Harper Lee",
      available: true,
      genre: "Classic Literature",
      id: "3fdd011a-8b1a-4d32-a288-8b756cd57aa1",
      isbn: "0062420704",
      onHoldCopies: 0,
      title: "To Kill a Mockingbird",
      totalCopies: "6",
      year: "1960",
    },
  ];

  localStorage.setItem("books", JSON.stringify(sampleBooks));
};

// sample users
export const seedUsers = () => {
  const existing = JSON.parse(localStorage.getItem("users"));
  if (existing && existing.length > 0) return;

  const users = [
    { role: "librarian", username: "admin", password: "admin123" },
    { role: "member", cardNumber: "12345678", pin: "4321", name: "Adriana" },
    { role: "member", cardNumber: "87654321", pin: "1234", name: "John" }
  ];

  localStorage.setItem("users", JSON.stringify(users));
};
