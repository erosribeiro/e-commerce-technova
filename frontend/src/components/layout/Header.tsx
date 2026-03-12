'use client';

import Link from 'next/link';
import { Search, Mic, ShoppingCart, User, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useHydration } from '@/hooks/useHydration';
import { useCartStore } from '@/store/useCartStore';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const cartItemsCount = useCartStore(state => state.items.length);

  const isAuthenticated = useHydration(useAuthStore, state => state.isAuthenticated);
  const user = useHydration(useAuthStore, state => state.user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/`);
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-white/5 bg-white/70 dark:bg-black/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60 transition-colors">
      <div className="container flex h-16 items-center mx-auto px-4 md:px-8">
        <div className="flex gap-6 md:gap-10 items-center w-full justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight text-primary">TECHNOVA</span>
          </Link>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden md:flex flex-1 max-w-xl items-center relative gap-2">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Busque por categoria, produto ou marca..."
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary transition-colors focus:outline-none"
                aria-label="Pesquisa por voz"
              >
                <Mic className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </button>
            </form>
          </div>

          <nav className="flex items-center gap-4 hidden md:flex">
            <Link
              href="/trade-in"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pr-2"
            >
              Trade-in Sustentável
            </Link>
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <Link href="/cart" className="p-2 hover:bg-accent rounded-full transition-colors relative" aria-label="Carrinho">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center pointer-events-none">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              {isAuthenticated && user ? (
                <Link href="/account" className="flex items-center gap-2 p-1.5 pl-3 hover:bg-accent rounded-full transition-colors border border-transparent hover:border-border" aria-label="Conta">
                  <span className="text-sm font-semibold max-w-[100px] truncate hidden md:block">{user.name.split(' ')[0]}</span>
                  <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
              ) : (
                <Link href="/login" className="p-2 hover:bg-accent rounded-full transition-colors" aria-label="Conta">
                  <User className="h-5 w-5" />
                </Link>
              )}
              <ThemeToggle />
            </div>
          </nav>
          
          <button className="md:hidden p-2 hover:bg-accent rounded-full transition-colors" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
