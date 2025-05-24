import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("member");
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const match = users.find(
      u => u.role === "librarian" && u.username === credentials.username && u.password === credentials.password
    );

    if (match) {
      localStorage.setItem("librarianUser", JSON.stringify(match));
      navigate("/librarian");
    } else {
      alert("Invalid librarian credentials.");
      setCredentials({ username: "", password: "" });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Library Login</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 w-full">
          <option value="librarian">Librarian</option>
        </select>
      </div>

      <input
        name="username"
        placeholder={role === "librarian" ? "Username" : "Username"}
        value={credentials.username}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <input
        name="password"
        placeholder={role === "librarian" ? "Password" : "Password"}
        value={credentials.password}
        type="password"
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />

      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Login
      </button>
    </div>
  );
}
