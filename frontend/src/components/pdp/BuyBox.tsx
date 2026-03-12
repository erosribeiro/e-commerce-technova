'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, RefreshCw, ShieldCheck, Truck, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

interface BuyBoxProps {
  product: {
    id: string;
    name: string;
    basePrice: number;
    description: string;
    isRefurbished?: boolean;
    brand: string;
    imageUrls?: string[];
  };
  onTradeInClick: () => void;
}

export function BuyBox({ product, onTradeInClick }: BuyBoxProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const { isAuthenticated, accessToken } = useAuthStore();
  const [isWished, setIsWished] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

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
        setIsLoadingWishlist(false);
      })
      .catch(() => setIsLoadingWishlist(false));
    } else {
      setIsLoadingWishlist(false);
    }
  }, [isAuthenticated, accessToken, product.id]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) return alert("Faça login para salvar favoritos");
    setIsWished(!isWished);
    try {
      await fetch(`http://localhost:3001/api/v1/users/wishlist/${product.id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
    } catch {
      setIsWished(!isWished);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
      image: product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000'
    });
    // Simula adição ao carrinho e feedback visual
    setTimeout(() => setIsAdding(false), 800);
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.basePrice);

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl">
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        {product.isRefurbished && (
          <span className="bg-secondary/80 text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
            Recondicionado
          </span>
        )}
        <span className="bg-primary/20 text-primary border border-primary/50 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {product.brand}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight shrink-0 flex-1">
          {product.name}
        </h1>
        <button 
          onClick={toggleWishlist}
          disabled={isLoadingWishlist}
          className="mt-1 flex-shrink-0 w-12 h-12 bg-white/50 backdrop-blur-md border border-border/50 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
          aria-label="Adicionar Favoritos"
        >
          <Heart className={`w-6 h-6 transition-colors ${isWished ? 'fill-red-500 text-red-500 stroke-red-500' : 'text-zinc-600'}`} />
        </button>
      </div>
      
      <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
        {product.description}
      </p>

      {/* Preço e Conversão */}
      <div className="mt-auto flex flex-col gap-6">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">
            Por apenas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              {formattedPrice}
            </span>
            <span className="text-sm text-muted-foreground font-medium">à vista</span>
          </div>
          <span className="text-sm text-muted-foreground mt-2">
            ou em até 12x de {(product.basePrice / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
              isAdding 
                ? 'bg-green-600/90 text-white cursor-not-allowed scale-[0.98]' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_20px_rgba(239,192,123,0.3)] hover:shadow-[0_0_30px_rgba(239,192,123,0.5)]'
            }`}
          >
            {isAdding ? (
              <span className="animate-pulse">Adicionado!</span>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Adicionar ao Carrinho
              </>
            )}
            
            {/* Efeito de brilho ao passar o mouse */}
            {!isAdding && (
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}
          </button>

          <button 
            onClick={onTradeInClick}
            className="w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-base bg-secondary/50 text-foreground border border-border/80 hover:bg-secondary hover:border-primary/50 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
            Dar meu usado na troca
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center gap-4 pt-6 border-t border-border/40 mt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="w-4 h-4 text-primary" />
            1 Ano de Garantia
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Truck className="w-4 h-4 text-primary" />
            Frete Grátis Sul/Sudeste
          </div>
        </div>
      </div>
    </div>
  );
}
