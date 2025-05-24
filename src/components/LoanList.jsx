export default function LoanList({ loans, books, onEdit, onDelete, onReturn }) {
  const getBookTitle = (id) => books.find(b => b.id === id)?.title || "Unknown";

  return (
    <div className="mt-4">
      {loans.map((loan) => (
        <div key={loan.id} className="border p-4 rounded mb-2 bg-gray-50">
          <p><strong>Book:</strong> {getBookTitle(loan.bookId)}</p>
          <p><strong>Member:</strong> {loan.memberName}</p>
          <p><strong>Loan Date:</strong> {loan.loanDate}</p>
          <p><strong>Due Date:</strong> {loan.dueDate}</p>
          <p><strong>Status:</strong> {loan.status}</p>
          <div className="space-x-2 mt-2">
            <button onClick={() => onEdit(loan)} className="text-blue-600">Edit</button>
            <button onClick={() => onDelete(loan.id)} className="text-red-600">Delete</button>

            {loan.status === "Active" && (
              <button
                onClick={() => onReturn(loan)}
                className="text-green-600 underline"
              >
                Mark as Returned
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
