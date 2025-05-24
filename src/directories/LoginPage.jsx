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
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">📚 Library Login</h1>

      <div className="mx-auto w-72 space-y-4">
        {/* Inline Role Selector */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex-1 p-2 border rounded shadow-sm"
          >
            <option value="librarian">Librarian</option>
          </select>
        </div>

        {/* Input Fields */}
        <input
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-sm"
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-sm"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );

}
