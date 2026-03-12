'use client';

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface WishedProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  imageUrls: string[];
  brand: string;
  category: string;
  isRefurbished: boolean;
}

export default function WishlistPage() {
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/v1/users/wishlist", {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setWishlist(data);
        }
      } catch (e) {
        console.error("Error fetching wishlist", e);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, accessToken, router]);

  const removeWishlist = async (productId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/users/wishlist/${productId}`, {
        method: "POST", // The toggle endpoint will remove it if it exists
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      if (res.ok) {
        setWishlist(prev => prev.filter(p => p.id !== productId));
      }
    } catch (e) {
      console.error("Error removing from wishlist", e);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/account" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-4xl font-black">Lista de Desejos</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">💔</span>
          </div>
          <h2 className="text-2xl font-bold">Sua lista está vazia</h2>
          <p className="text-muted-foreground max-w-md">Que tal explorar nossos produtos e salvar os que você mais gostar aqui?</p>
          <Link href="/" className="mt-4 bg-foreground text-background font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all">
            Explorar Produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="group relative flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              
              <button 
                onClick={() => removeWishlist(item.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-colors"
                aria-label="Remover"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <Link href={`/product/${item.slug}`} className="relative h-64 overflow-hidden bg-white flex items-center justify-center p-6">
                <img 
                  src={item.imageUrls[0]} 
                  alt={item.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </Link>

              <div className="p-6 flex flex-col flex-1 gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.brand}</span>
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-bold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-xl font-black">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.basePrice)}
                  </span>
                  <button 
                    onClick={() => {
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: Number(item.basePrice),
                        quantity: 1,
                        image: item.imageUrls[0]
                      });
                    }}
                    className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Adicionar ao Carrinho"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
