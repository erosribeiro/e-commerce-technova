'use client';

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ProductCard({ product, index = 0 }: { product: any; index?: number }) {
  const { isAuthenticated, accessToken } = useAuthStore();
  const [isWished, setIsWished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Checks initial wishlist state if logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetch("http://localhost:3001/api/v1/users/wishlist", {
        headers: { "Authorization": `Bearer ${accessToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIsWished(data.some(p => p.id === product.id));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, accessToken, product.id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Navigation if wrapped in Link somehow
    if (!isAuthenticated) {
      alert("Faça login para adicionar à sua Wishlist.");
      return;
    }
    
    // Optmistic UI Update
    setIsWished(!isWished);

    try {
      const res = await fetch(`http://localhost:3001/api/v1/users/wishlist/${product.id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      if (!res.ok) {
        throw new Error("Failed");
      }
    } catch (e) {
      // Revert if failed
      setIsWished(!isWished);
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col bg-card bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent border border-slate-200/50 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-black/5 dark:shadow-none hover:shadow-2xl hover:shadow-primary/5 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-500 relative"
    >
      <div className="relative aspect-square w-full bg-background overflow-hidden flex items-center justify-center p-8">
        
        {/* Wishlist Button Overlay */}
        <button 
          onClick={toggleWishlist}
          disabled={loading}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group-hover:opacity-100 opacity-0 md:opacity-100 shadow-sm"
          aria-label="Adicionar Favoritos"
        >
          <Heart className={`w-5 h-5 transition-colors ${isWished ? 'fill-red-500 text-red-500 stroke-red-500' : 'text-zinc-600'}`} />
        </button>

        {product.isFeatured && (
          <span className="absolute top-4 left-4 z-10 bg-foreground text-background px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
            Novo
          </span>
        )}

        <Link href={`/product/${product.slug}`} className="relative w-full h-full flex items-center justify-center">
          <Image 
            src={product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000'}
            alt={product.name}
            fill
            className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
          {product.brand}
        </span>
        <Link href={`/product/${product.slug}`} className="block mb-4">
          <h3 className="text-lg font-bold text-foreground leading-snug group-hover:underline decoration-border underline-offset-4 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.basePrice || 0)}
            </span>
            <span className="text-xs text-muted-foreground">Em até 12x sem juros</span>
          </div>
          <Link 
            href={`/product/${product.slug}`}
            className="p-3 bg-muted text-foreground rounded-full hover:bg-foreground hover:text-background transition-colors hover:scale-110"
            aria-label="Ver Produto"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
