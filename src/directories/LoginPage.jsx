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
      <h1 className="text-3xl font-bold text-center mb-6">📚 Library Login</h1>

      <div className="mx-auto w-72 space-y-4">
        {/* Inline Role Selector */}
        <div className="form-control">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="librarian">Librarian</option>
          </select>
        </div>

        {/* Username Field */}
        <div className="form-control">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Password Field */}
        <div className="form-control">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="btn btn-primary w-full"
        >
          Login
        </button>
      </div>
    </div>
  );


}
