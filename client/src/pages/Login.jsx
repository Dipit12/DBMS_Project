import { useState } from "react";
import { api } from "../api";

export default function Login({ onLogin }) {
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  async function login(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      onLogin(res.data.token);
    } catch {
      alert("Invalid username or password.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen min-w-screen bg-gray-100">
      <form
        onSubmit={login}
        className="w-[370px] bg-white shadow-lg rounded-lg p-8"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome Back</h1>

        <div className="space-y-4">
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Username"
            onChange={e => setU(e.target.value)}
          />

          <input
            className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            type="password"
            placeholder="Password"
            onChange={e => setP(e.target.value)}
          />

          <button
            type="submit"
            className="bg-purple-500 hover:bg-blue-700 text-black font-medium w-full py-2 rounded transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
