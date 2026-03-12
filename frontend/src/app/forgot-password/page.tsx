'use client';

import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock delay for UI UX
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 sm:p-10 rounded-3xl shadow-xl shadow-primary/5 border border-slate-200/50 dark:border-white/10 relative">
        <Link href="/login" className="absolute top-6 left-6 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-black mb-2 tracking-tight">Recuperar Senha</h1>
          <p className="text-muted-foreground text-sm">
            Digite o e-mail associado à sua conta e enviaremos instruções para redefinir sua senha.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">E-mail Enviado!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Enviamos um link de recuperação para <strong>{email}</strong>. Por favor, verifique sua caixa de entrada e spam.
            </p>
            <Link href="/login" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
              Voltar ao Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRecovery} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="voce@exemplo.com" 
                className="px-4 py-3 rounded-xl border border-border/80 dark:border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/60 shadow-inner" 
              />
            </div>

            <button disabled={loading} type="submit" className="flex items-center justify-center w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl mt-2 hover:scale-[1.02] hover:shadow-lg transition-all disabled:opacity-70 disabled:hover:scale-100">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Instruções"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
