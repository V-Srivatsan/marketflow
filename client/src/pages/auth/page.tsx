import { useState } from "react";
import AuthForm from "./form";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      
      <div className="h-full text-center px-20 py-5">
        <h1 className="text-white text-5xl font-semibold leading-tight">Master the Markets</h1>
        <h2 className="text-secondary-foreground text-4xl font-semibold">Compete for Glory</h2>
      </div>

      <div className="w-full max-w-[440px] bg-card border border-border rounded-xl p-6 z-10 shadow-2xl">
        <div className="flex bg-background rounded-full p-1 mb-6 border border-border">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${isLogin ? 'bg-primary text-white' : 'text-secondary-foreground hover:text-foreground'}`}
            onClick={() => setIsLogin(true)}
          >
            Log in
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${!isLogin ? 'bg-primary text-white' : 'text-secondary-foreground hover:text-foreground'}`}
            onClick={() => setIsLogin(false)}
          >
            Sign up
          </button>
        </div>

        <AuthForm isLogin={isLogin} />
      </div>
    </main>
  );
};

export default AuthPage;
