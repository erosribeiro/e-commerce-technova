'use client';

import { useState } from 'react';
import { Smartphone, Check, ChevronRight, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Step = 'BRAND' | 'MODEL' | 'CONDITION' | 'RESULT';
type Condition = 'A' | 'B' | 'C';

export default function TradeInPage() {
  const [step, setStep] = useState<Step>('BRAND');
  const [selections, setSelections] = useState({
    brand: '',
    model: '',
    condition: '' as Condition | '',
  });

  const brands = ['Apple', 'Samsung', 'Google'];
  const models: Record<string, {name: string, value: number}[]> = {
    Apple: [
      { name: 'iPhone 13 Pro', value: 2000 },
      { name: 'iPhone 14', value: 2500 },
      { name: 'iPhone 14 Pro Max', value: 3800 },
      { name: 'MacBook Pro M1', value: 4500 }
    ],
    Samsung: [
      { name: 'Galaxy S22 Ultra', value: 1800 },
      { name: 'Galaxy S23+', value: 2400 },
      { name: 'Galaxy Watch 6', value: 600 }
    ],
    Google: [
      { name: 'Pixel 7 Pro', value: 1600 }
    ]
  };

  const calculateEstimate = () => {
    const baseValue = models[selections.brand]?.find(m => m.name === selections.model)?.value || 0;
    if (selections.condition === 'A') return baseValue;
    if (selections.condition === 'B') return baseValue * 0.8;
    if (selections.condition === 'C') return baseValue * 0.5;
    return 0;
  };

  const finalValue = calculateEstimate();

  return (
    <div className="min-h-screen pt-12">
      {/* Banner */}
      <section className="bg-primary/5 border-b border-border/50 py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Trade-In Sustentável</h1>
          <p className="text-xl text-muted-foreground font-medium">
            Seu dispositivo antigo vale crédito na hora para você comprar a mais nova tecnologia. Simples, rápido e ecológico.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-2xl">
          
          <div className="bg-card border border-border/50 shadow-xl rounded-3xl overflow-hidden p-8 md:p-12 relative z-10 min-h-[500px] flex flex-col justify-center">
            
            {step === 'BRAND' && (
              <div className="animate-in fade-in slide-in-from-bottom-8">
                <span className="text-sm font-bold text-primary mb-2 block tracking-widest uppercase">Passo 1/3</span>
                <h3 className="text-3xl font-bold mb-8">Qual é a marca do seu aparelho?</h3>
                <div className="grid gap-4">
                  {brands.map(b => (
                    <button 
                      key={b} 
                      onClick={() => { setSelections({ brand: b, model: '', condition: '' }); setStep('MODEL'); }}
                      className="flex justify-between items-center w-full p-6 text-lg rounded-2xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left font-semibold"
                    >
                      {b} <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'MODEL' && (
              <div className="animate-in fade-in slide-in-from-bottom-8">
                <button 
                  onClick={() => setStep('BRAND')}
                  className="text-sm text-primary hover:underline font-semibold mb-4 block"
                >
                  &larr; Voltar
                </button>
                <span className="text-sm font-bold text-primary mb-2 block tracking-widest uppercase">Passo 2/3</span>
                <h3 className="text-3xl font-bold mb-8">Qual é o modelo?</h3>
                <div className="grid gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {models[selections.brand]?.map(m => (
                    <button 
                      key={m.name} 
                      onClick={() => { setSelections(prev => ({ ...prev, model: m.name })); setStep('CONDITION'); }}
                      className="flex justify-between items-center w-full p-6 text-lg rounded-2xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left font-semibold"
                    >
                      {m.name} <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'CONDITION' && (
              <div className="animate-in fade-in slide-in-from-bottom-8">
                <button 
                  onClick={() => setStep('MODEL')}
                  className="text-sm text-primary hover:underline font-semibold mb-4 block"
                >
                  &larr; Voltar
                </button>
                <span className="text-sm font-bold text-primary mb-2 block tracking-widest uppercase">Passo 3/3</span>
                <h3 className="text-3xl font-bold mb-8">Qual é o estado do dispositivo?</h3>
                <div className="grid gap-4">
                  <button 
                    onClick={() => { setSelections(prev => ({ ...prev, condition: 'A' })); setStep('RESULT'); }}
                    className="flex flex-col w-full p-6 rounded-2xl border border-border bg-background hover:border-primary transition-all text-left group"
                  >
                    <span className="font-bold text-xl group-hover:text-primary mb-2">Excelente</span>
                    <span className="text-muted-foreground">Sem arranhões ou marcas, tela perfeita e bateria &gt;90%</span>
                  </button>
                  <button 
                    onClick={() => { setSelections(prev => ({ ...prev, condition: 'B' })); setStep('RESULT'); }}
                    className="flex flex-col w-full p-6 rounded-2xl border border-border bg-background hover:border-primary transition-all text-left group"
                  >
                    <span className="font-bold text-xl group-hover:text-primary mb-2">Bom</span>
                    <span className="text-muted-foreground">Desgaste leve de uso, micro-arranhões imperceptíveis</span>
                  </button>
                  <button 
                    onClick={() => { setSelections(prev => ({ ...prev, condition: 'C' })); setStep('RESULT'); }}
                    className="flex flex-col w-full p-6 rounded-2xl border border-border bg-background hover:border-primary transition-all text-left group"
                  >
                    <span className="font-bold text-xl group-hover:text-primary mb-2">Regular</span>
                    <span className="text-muted-foreground">Danos ou desgastes visíveis, tela funcional mas com marcas</span>
                  </button>
                </div>
              </div>
            )}

            {step === 'RESULT' && (
              <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500 py-6">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Check className="w-12 h-12 text-green-500" />
                </div>
                
                <p className="text-lg text-muted-foreground font-semibold mb-2">Crédito estimado para o seu</p>
                <h3 className="text-3xl font-bold mb-4">{selections.brand} {selections.model}</h3>
                <span className="inline-block px-4 py-2 bg-secondary rounded-full text-sm uppercase font-bold text-secondary-foreground mb-8">
                  Condição {selections.condition}
                </span>

                <div className="text-6xl font-black text-primary mb-8 tracking-tighter">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalValue)}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Link href="/" className="flex-1 h-14 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:bg-primary/90 transition-colors shadow-lg flex items-center justify-center gap-2">
                    Comprar Novos <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => { setStep('BRAND'); setSelections({ brand: '', model: '', condition: '' }); }}
                    className="flex-1 h-14 bg-background border border-border font-bold text-lg rounded-xl hover:bg-accent transition-colors"
                  >
                    Fazer outra cotação
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full z-0 pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
