'use client';

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Credenciais inválidas");
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side Form */}
      <div className="flex flex-col justify-center px-8 md:px-24 xl:px-32 bg-background relative">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Bem-vindo(a)</h1>
          <p className="text-muted-foreground mb-8">Acesse sua conta para visualizar pedidos, wishlist e muito mais.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="bg-destructive/10 text-destructive dark:text-red-400 text-sm font-semibold p-4 rounded-xl border border-destructive/20 shadow-sm">
                {error}
              </div>
            )}
            
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
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold">Senha</label>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Esqueceu a senha?</Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••" 
                className="px-4 py-3 rounded-xl border border-border/80 dark:border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/60 shadow-inner" 
              />
            </div>

            <button disabled={loading} type="submit" className="flex items-center justify-center w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl mt-4 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-70 disabled:hover:scale-100">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
            </button>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              Ainda não tem conta? <Link href="/signup" className="text-foreground font-semibold hover:underline">Crie uma agora</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side Art */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-zinc-100 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000')] opacity-40 mix-blend-multiply object-cover" />
        <div className="z-10 bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-white max-w-md text-center">
          <h2 className="text-3xl font-black mb-4">Experiência Integrada</h2>
          <p className="text-zinc-700 font-medium">Faça login para salvar seus itens na wishlist em todos os dispositivos e aproveitar nosso programa de reuso.</p>
        </div>
      </div>
    </div>
  );
}
