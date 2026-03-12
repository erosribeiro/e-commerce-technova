'use client';

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formattedSubtotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Parece que você ainda não adicionou nada. Descubra nossos lançamentos.
        </p>
        <Link href="/" className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors">
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-black tracking-tight mb-10">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Lista de Itens */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-6 border border-border/50 bg-card rounded-3xl shadow-sm">
              <div className="relative w-32 h-32 bg-muted rounded-2xl overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
              </div>
              <div className="flex flex-col flex-1 py-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-bold leading-tight">{item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div className="text-2xl font-black">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                  </div>
                  <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-lg font-medium">
                    <span className="text-sm text-muted-foreground">Qtd</span>
                    {item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
             onClick={clearCart}
             className="text-sm text-muted-foreground hover:text-destructive self-start mt-4 underline underline-offset-4"
          >
            Limpar carrinho
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-muted/30 border border-border/50 rounded-3xl p-8 sticky top-24">
          <h2 className="text-2xl font-bold mb-6">Resumo</h2>
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({items.length} itens)</span>
              <span>{formattedSubtotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Frete</span>
              <span className="text-green-600 font-medium">Grátis</span>
            </div>
            <div className="w-full h-px bg-border my-2" />
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-lg">Total</span>
              <span className="text-3xl font-black">{formattedSubtotal}</span>
            </div>
          </div>

          <Link 
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Fechar Pedido
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <p className="text-xs text-center text-muted-foreground mt-6">
            Transação 100% segura usando criptografia end-to-end.
          </p>
        </div>
      </div>
    </div>
  );
}
