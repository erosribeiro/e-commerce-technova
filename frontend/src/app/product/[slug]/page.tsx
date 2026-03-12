"use client";

import { useState, useEffect, use } from "react";
import { ProductGallery } from "@/components/pdp/ProductGallery";
import { BuyBox } from "@/components/pdp/BuyBox";
import { SpecsTable } from "@/components/pdp/SpecsTable";
import { TradeInModal } from "@/components/pdp/TradeInModal";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  const [isTradeInOpen, setTradeInOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:3001/api/v1/catalog/products/${unwrappedParams.slug}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [unwrappedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
        <Link href="/" className="text-primary hover:underline">Voltar para a Home</Link>
      </div>
    );
  }

  // Format specs for the SpecsTable component
  const specs = product.specs || {};

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Pão de Açúcar (Breadcrumb) */}
      <div className="text-sm text-muted-foreground mb-6 flex gap-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="hover:text-primary cursor-pointer transition-colors">{product.category}</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Lado Esquerdo - Galeria */}
        <section className="w-full lg:sticky lg:top-24">
          <ProductGallery 
            images={product.imageUrls?.length > 0 ? product.imageUrls : ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000"]} 
            productName={product.name} 
          />
        </section>

        {/* Lado Direito - Buy Box & Specs */}
        <section className="flex flex-col gap-10">
          <BuyBox 
            product={product} 
            onTradeInClick={() => setTradeInOpen(true)} 
          />
          
          {Object.keys(specs).length > 0 && (
            <SpecsTable specs={specs} />
          )}
        </section>
      </div>

      {/* Modal Recommerce */}
      <TradeInModal isOpen={isTradeInOpen} onClose={() => setTradeInOpen(false)} />
    </div>
  );
}
