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

  // updates the form when loan prop changes (for editing)
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

  // calculates due date when loan date changes
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
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-6 space-y-4">
      {/* Row 1: Book Selector and Member Name */}
      <div className="flex flex-wrap lg:flex-row gap-4">
        <select
          name="bookId"
          value={form.bookId}
          onChange={handleChange}
          required
          className="select select-bordered flex-1"
        >
          <option value="">Select Book</option>
          {books
            .filter(b => b.available && (b.totalCopies - (b.onHoldCopies || 0)) > 0)
            .map(b => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))
          }
        </select>

        <input
          name="memberName"
          placeholder="Member Name"
          value={form.memberName}
          onChange={handleChange}
          required
          className="input input-bordered flex-1"
        />
      </div>

      {/* Row 2: Loan Date, Due Date, Status */}
      <div className="flex flex-wrap lg:flex-row gap-4">
        <input
          name="loanDate"
          type="date"
          value={form.loanDate}
          onChange={handleChange}
          required
          className="input input-bordered flex-1"
        />

        <input
          name="dueDate"
          type="date"
          value={form.dueDate}
          disabled
          className="input input-bordered flex-1"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="select select-bordered flex-1"
        >
          <option>Active</option>
        </select>
      </div>

      {/* Buttons: horizontal on desktop, vertical on mobile */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        <button type="submit" className="btn btn-primary flex-1">
          {loan ? 'Update' : 'Add Loan'}
        </button>

        {loan && (
          <button type="button" onClick={onCancel} className="btn btn-neutral flex-1">
            Cancel
          </button>
        )}
      </div>
    </form>
  );

}
