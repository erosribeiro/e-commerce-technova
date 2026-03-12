'use client';

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formattedSubtotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => clearCart(), 500);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-500">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-black mb-4">Pedido Confirmado!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Sua compra foi processada com sucesso. Você receberá um e-mail com os detalhes de rastreio em breve.
        </p>
        <Link href="/" className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors">
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Carrinho Vazio</h1>
        <Link href="/" className="text-primary hover:underline">Voltar para a Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link href="/cart" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Carrinho
      </Link>
      
      <h1 className="text-3xl font-black tracking-tight mb-10">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulário de Endereço e Pagamento */}
        <form onSubmit={handleCheckout} className="flex flex-col gap-8">
          <section className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Endereço de Entrega</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-semibold mb-1 block">CEP</label>
                <input required type="text" placeholder="00000-000" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold mb-1 block">Endereço</label>
                <input required type="text" placeholder="Rua / Avenida" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Número</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Complemento</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
          </section>

          <section className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Pagamento (Simulação)</h2>
            <div className="p-4 border border-primary bg-primary/5 rounded-xl flex items-center gap-4">
              <div className="w-4 h-4 rounded-full border-4 border-primary bg-background" />
              <span className="font-semibold">Cartão de Crédito</span>
            </div>
            <div className="p-4 border border-border rounded-xl flex items-center gap-4 mt-3 opacity-50 pointer-events-none">
              <div className="w-4 h-4 rounded-full border border-border" />
              <span className="font-semibold">Pix</span>
            </div>
          </section>

          <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-xl hover:bg-primary/90 transition-all text-lg shadow-lg">
            Confirmar Compra Simmulada
          </button>
        </form>

        {/* Resumo Estático */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-border/50 rounded-3xl p-8 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6">Itens do Pedido ({items.length})</h2>
          
          <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/50">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm truncate w-48">{item.name}</span>
                  <span className="text-xs text-muted-foreground">Qtd: {item.quantity}</span>
                </div>
                <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-border my-6" />
          
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-muted-foreground font-medium">Subtotal</span>
            <span className="text-lg font-bold">{formattedSubtotal}</span>
          </div>
          <div className="flex justify-between items-baseline mb-6">
            <span className="text-muted-foreground font-medium">Frete Expresso</span>
            <span className="text-lg font-bold text-green-600">Grátis</span>
          </div>
          
          <div className="flex justify-between items-baseline bg-background p-4 rounded-xl border border-border">
            <span className="font-bold text-xl">Total a Pagar</span>
            <span className="text-3xl font-black text-primary">{formattedSubtotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
