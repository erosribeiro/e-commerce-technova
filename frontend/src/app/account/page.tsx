'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User, RefreshCw, Heart } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { user, isAuthenticated, logout, accessToken, updateUser } = useAuthStore();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setName(user.name);
    }
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/v1/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        updateUser({ name });
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-8">Minha Conta</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Menu/Sidebar */}
        <div className="flex flex-col gap-2">
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
            
            <nav className="flex flex-col gap-1">
              <button className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl font-medium text-sm text-left">
                <User className="w-4 h-4" /> Informações Pessoais
              </button>
              <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-xl font-medium text-sm text-left transition-colors">
                <Heart className="w-4 h-4" /> Lista de Desejos
              </Link>
              <Link href="/trade-in" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-xl font-medium text-sm text-left transition-colors">
                <RefreshCw className="w-4 h-4" /> Programas Trade-In
              </Link>
            </nav>

            <div className="w-full h-px bg-border my-6" />

            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl font-bold text-sm w-full transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair da conta
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Informações Pessoais</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-primary text-sm font-semibold hover:underline">
                  Editar
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Nome Completo</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                ) : (
                  <span className="text-lg font-medium">{user.name}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">E-mail</label>
                <span className="text-lg font-medium opacity-70">{user.email}</span>
                {isEditing && <span className="text-xs text-muted-foreground">O e-mail não pode ser alterado no momento.</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Sua Função Restrita</label>
                <span className="inline-block w-fit px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-md">{user.role}</span>
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={saveProfile} 
                  disabled={loading}
                  className="bg-primary text-primary-foreground font-bold px-6 py-2 rounded-lg"
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setName(user.name); }} 
                  className="text-muted-foreground font-semibold px-6 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
