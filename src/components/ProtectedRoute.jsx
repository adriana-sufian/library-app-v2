import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const librarian = JSON.parse(localStorage.getItem("librarianUser"));

  if (!librarian) {
    return <Navigate to="/" replace />;
  }

  return children;
}