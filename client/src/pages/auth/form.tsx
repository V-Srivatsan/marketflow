import React, { useState } from "react";
import { makeRequest, showMessage, getFormData } from "../../lib/utils";

type LoginProps = {
  isLogin: boolean
};

const AuthForm = ({ isLogin }: LoginProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await getFormData(e.currentTarget)
      console.log(data)
      const payload = await makeRequest(`user/${isLogin ? 'login' : 'signup'}`, "POST", data)

      if (payload.detail) {
        const msg = (payload.detail.message || `${isLogin ? 'Login' : 'Signup'} failed`);
        showMessage(msg, true);
        return
      }

      const token = payload.token;

      localStorage.setItem("token", token);
      window.location.href = "/stocks";
      
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

      {!isLogin && (
        <div className="bg-primary/10 text-primary border border-primary/20 rounded-lg p-3 text-sm flex gap-2">
          <p>You'll start with $100,000 in virtual cash.</p>
        </div>
      )}

      <button 
        type="submit" disabled={loading}
        className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg py-3 font-medium transition-colors mt-2 shadow-lg shadow-primary/20"
      >
        {isLogin ? 'Continue to Market' : 'Create account'}
      </button>
    </form>
  );
};

export default AuthForm;