import React, { useState } from "react";

type LoginProps = {
  onSwitch: () => void;
};

const login = ({ onSwitch }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = (payload && (payload.detail || "Login failed"));
        throw new Error(msg);
      }

      const token = payload.token;
      if (!token || typeof token !== "string") throw new Error("No token returned from server");

      localStorage.setItem("token", token);
      window.location.href = "/stocks";
      
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-[420px] rounded-3xl p-10
      bg-gradient-to-br from-[#12133f] via-[#1b1c55] to-[#17184a]
      shadow-2xl border border-white/10"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-white">
          Welcome Back
        </h1>
        <p className="text-gray-300 mt-2">
          Sign in to your account
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-200 mb-2">
            Username
          </label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full px-3 py-2 rounded-full
              bg-white/20 text-white placeholder-gray-300
              outline-none border border-white/10
              focus:ring-2 focus:ring-green-400/70
            "
          />
        </div>

        <div>
          <label className="block text-sm text-gray-200 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-3 py-2 rounded-full
              bg-white/20 text-white placeholder-gray-300
              outline-none border border-white/10
              focus:ring-2 focus:ring-green-400/70
            "
          />
        </div>

        {error && <div className="text-rose-300 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-4 rounded-full
            bg-gradient-to-r from-[#6ee38f] to-[#3ca76a]
            text-white font-medium text-lg
            hover:opacity-90 transition disabled:opacity-60
          "
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-8">
        <div onClick={onSwitch}>
          <p className="cursor-pointer text-[#6ee38f] underline text-sm">Don&apos;t have an account? Sign up</p>
        </div>
      </div>
    </div>
  );
};

export default login;