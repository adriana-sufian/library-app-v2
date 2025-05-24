import { useState, useEffect } from "react";

export default function LoanForm({ onSubmit, books, loan , onCancel
}) {
  const [form, setForm] = useState({
    bookId: "",
    memberName: "",
    loanDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "Active",
  });

  // This useEffect updates the form when loan prop changes (for editing)
  useEffect(() => {
    if (loan) {
      setForm(loan);
    } else {
      // Clear form when no loan is being edited (for new loans)
      setForm({
        bookId: "",
        memberName: "",
        loanDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        status: "Active",
      });
    }
  }, [loan]);

  // This useEffect calculates due date when loan date changes
  useEffect(() => {
    const date = new Date(form.loanDate);
    date.setDate(date.getDate() + 14);
    setForm(f => ({ ...f, dueDate: date.toISOString().split("T")[0] }));
  }, [form.loanDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.bookId || !form.memberName) return alert("Missing fields");
    onSubmit(form);
    setForm({
      bookId: "",
      memberName: "",
      loanDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      status: "Active",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow space-y-4">
      <select name="bookId" value={form.bookId} onChange={handleChange} required>
        <option value="">Select Book</option>
          {books
            .filter(b => (b.totalCopies - (b.onHoldCopies || 0)) > 0)
            .map(b => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))
          }
      </select>
      <input name="memberName" placeholder="Member Name" value={form.memberName} onChange={handleChange} required />
      <input name="loanDate" type="date" value={form.loanDate} onChange={handleChange} required />
      <input name="dueDate" type="date" value={form.dueDate} disabled />
      <select name="status" value={form.status} onChange={handleChange}>
        <option>Active</option>
      </select>
      <button 
      type="submit" 
      className="bg-blue-500 text-white px-4 py-2"
      >
        {loan ? 'Update' : 'Add Loan'}
      </button>
      {loan && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
      )}
    </form>
  );
}
