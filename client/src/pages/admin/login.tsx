import React, { useState } from "react";
import { makeRequest, showMessage, getFormData } from "../../lib/utils";

type LoginProps = {
  onLogin: (token: string) => void
};

const LoginForm = ({ onLogin }: LoginProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await getFormData(e.currentTarget)
      console.log(data)
      const payload = await makeRequest(`admin/login`, "POST", data)

      if (payload.detail) {
        const msg = (payload.detail.message || 'Login failed');
        showMessage(msg, true);
        return
      }

      localStorage.setItem("token", payload.token)
      onLogin(payload.token)
    } catch (err) {
      console.log(err)
      showMessage("An unexpected error occurred. Please try again", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <input disabled={loading}
          type="text" required
          name="username" placeholder="Username" 
          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>
      <div className="relative">
        <input disabled={loading}
          type='password' required
          name="password" placeholder="Password" 
          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-10"
        />
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg py-3 font-medium transition-colors mt-2 shadow-lg shadow-primary/20"
      >
        Login as Admin
      </button>
    </form>
  );
};

export default LoginForm;