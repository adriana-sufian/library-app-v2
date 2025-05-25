export default function LoanList({ loans, books, onEdit, onDelete, onReturn }) {
  const getBookTitle = (id) => books.find(b => b.id === id)?.title || "Unknown";
  
  const today = new Date();
  const enhancedLoans = loans.map((loan) => {
    const dueDate = new Date(loan.dueDate);
    const isOverdue = loan.status === "Active" && today > dueDate;

    return {
      ...loan,
      displayStatus: loan.status === "Returned" 
        ? "Returned" 
        : isOverdue 
          ? "Overdue" 
          : "Active"
    };
  });

  return (
    <div className="mt-4">
      {enhancedLoans.map((loan) => (
        <div key={loan.id} className="border p-4 rounded mb-2 bg-base-100 shadow-sm">
          <p><strong>Book:</strong> {getBookTitle(loan.bookId)}</p>
          <p><strong>Borrower:</strong> {loan.memberName}</p>
          <p><strong>Loan Date:</strong> {loan.loanDate}</p>
          <p><strong>Due Date:</strong> {loan.dueDate}</p>
          <p className={loan.displayStatus === "Overdue" ? "text-error font-semibold" : ""}>
            <strong>Status:</strong> {loan.displayStatus}
          </p>

          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            <button onClick={() => onEdit(loan)} className="btn btn-sm btn-outline btn-info">
              Edit
            </button>

            <button
              onClick={() => onDelete(loan.id)}
              className="btn btn-sm btn-outline btn-error"
              disabled={loan.displayStatus !== "Returned"}
              title={loan.displayStatus !== "Returned" ? "Cannot delete active or overdue loan" : "Delete loan"}
            >
              Delete
            </button>

            {loan.status === "Active" && (
              <button
                onClick={() => onReturn(loan)}
                className="btn btn-sm btn-success"
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
