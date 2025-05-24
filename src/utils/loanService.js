export const getLoans = () => JSON.parse(localStorage.getItem("loans")) || [];
export const saveLoans = (loans) => localStorage.setItem("loans", JSON.stringify(loans));
