'use client';

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consentGdpr, setConsentGdpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const setAuth = useAuthStore(state => state.setAuth);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!consentGdpr) {
      setError("Você deve aceitar os Termos de Privacidade e GDPR.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, consentGdpr }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao registrar conta");
      }

      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/account");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-zinc-50 py-12">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-border/50">
        <h1 className="text-3xl font-black mb-2 text-center">Criar Conta</h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">Junte-se à revolução tech.</p>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-semibold p-4 rounded-xl border border-destructive/20 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Nome Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe" 
              className="px-4 py-3 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="voce@exemplo.com" 
              className="px-4 py-3 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Senha</label>
            <input 
              type="password" 
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres" 
              className="px-4 py-3 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
            />
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input 
              type="checkbox" 
              id="consent"
              checked={consentGdpr}
              onChange={e => setConsentGdpr(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-input text-primary focus:ring-primary"
            />
            <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              Eu concordo com os Termos de Serviço e a Política de Privacidade (GDPR). Entendo que meus dados serão processados para gerenciamento da conta.
            </label>
          </div>

          <button disabled={loading} type="submit" className="flex items-center justify-center w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl mt-4 hover:bg-primary/90 transition-all shadow-md disabled:opacity-70 disabled:hover:bg-primary">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cadastrar"}
          </button>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Já possui conta? <Link href="/login" className="text-foreground font-semibold hover:underline">Faça login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
