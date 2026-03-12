'use client';

import { useState } from 'react';
import { X, Smartphone, Check, ChevronRight } from 'lucide-react';

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'BRAND' | 'MODEL' | 'CONDITION' | 'RESULT';
type Condition = 'A' | 'B' | 'C';

export function TradeInModal({ isOpen, onClose }: TradeInModalProps) {
  const [step, setStep] = useState<Step>('BRAND');
  
  const [selections, setSelections] = useState({
    brand: '',
    model: '',
    condition: '' as Condition | '',
  });

  if (!isOpen) return null;

  // Mock data para o Wizard
  const brands = ['Apple', 'Samsung', 'Google'];
  const models: Record<string, {name: string, value: number}[]> = {
    Apple: [
      { name: 'iPhone 13 Pro', value: 2000 },
      { name: 'iPhone 14', value: 2500 },
      { name: 'iPhone 14 Pro Max', value: 3800 },
    ],
    Samsung: [
      { name: 'Galaxy S22 Ultra', value: 1800 },
      { name: 'Galaxy S23+', value: 2400 },
    ],
    Google: [
      { name: 'Pixel 7 Pro', value: 1600 }
    ]
  };

  const handleBrandSelect = (b: string) => {
    setSelections({ brand: b, model: '', condition: '' });
    setStep('MODEL');
  };

  const handleModelSelect = (m: string) => {
    setSelections(prev => ({ ...prev, model: m }));
    setStep('CONDITION');
  };

  const handleConditionSelect = (c: Condition) => {
    setSelections(prev => ({ ...prev, condition: c }));
    setTimeout(() => setStep('RESULT'), 400); // pequeno delay visual
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div 
        className="w-full max-w-lg bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tradein-title"
      >
        <div className="flex justify-between items-center p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 id="tradein-title" className="text-xl font-bold text-foreground">
              Troque seu Usado
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 flex-1">
          {step === 'BRAND' && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-medium">Qual é a marca do seu aparelho?</h3>
              <div className="grid gap-3">
                {brands.map(b => (
                  <button 
                    key={b} 
                    onClick={() => handleBrandSelect(b)}
                    className="flex justify-between items-center w-full p-4 rounded-xl border border-border bg-card/50 hover:border-primary hover:bg-accent hover:text-primary transition-all text-left"
                  >
                    <span className="font-semibold">{b}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'MODEL' && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
              <button 
                onClick={() => setStep('BRAND')}
                className="text-sm text-primary hover:underline self-start -mt-2"
              >
                Voltar
              </button>
              <h3 className="text-lg font-medium">Qual é o modelo?</h3>
              <div className="grid gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {models[selections.brand]?.map(m => (
                  <button 
                    key={m.name} 
                    onClick={() => handleModelSelect(m.name)}
                    className="flex justify-between items-center w-full p-4 rounded-xl border border-border bg-card/50 hover:border-primary hover:bg-accent transition-all text-left"
                  >
                    <span className="font-semibold">{m.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'CONDITION' && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
               <button 
                onClick={() => setStep('MODEL')}
                className="text-sm text-primary hover:underline self-start -mt-2"
              >
                Voltar
              </button>
              <h3 className="text-lg font-medium">Qual é o estado do aparelho?</h3>
              <div className="grid gap-4">
                <button 
                  onClick={() => handleConditionSelect('A')}
                  className="flex flex-col w-full p-4 rounded-xl border border-border bg-card/50 hover:border-primary transition-all text-left group"
                >
                  <span className="font-bold text-foreground group-hover:text-primary mb-1">Excelente</span>
                  <span className="text-sm text-muted-foreground">Sem arranhões ou marcas, tela perfeita e bateria &gt;90%</span>
                </button>
                <button 
                  onClick={() => handleConditionSelect('B')}
                  className="flex flex-col w-full p-4 rounded-xl border border-border bg-card/50 hover:border-primary transition-all text-left group"
                >
                  <span className="font-bold text-foreground group-hover:text-primary mb-1">Bom</span>
                  <span className="text-sm text-muted-foreground">Desgaste leve de uso, micro-arranhões imperceptíveis</span>
                </button>
                <button 
                  onClick={() => handleConditionSelect('C')}
                  className="flex flex-col w-full p-4 rounded-xl border border-border bg-card/50 hover:border-primary transition-all text-left group"
                >
                  <span className="font-bold text-foreground group-hover:text-primary mb-1">Regular</span>
                  <span className="text-sm text-muted-foreground">Danos ou desgastes visíveis, tela funcional mas com marcas</span>
                </button>
              </div>
            </div>
          )}

          {step === 'RESULT' && (
            <div className="flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-500 py-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(239,192,123,0.3)]">
                <Check className="w-10 h-10 text-primary" />
              </div>
              
              <div className="space-y-2">
                <p className="text-muted-foreground">Crédito estimado para o seu</p>
                <h3 className="text-2xl font-bold">{selections.brand} {selections.model}</h3>
                <span className="inline-block px-3 py-1 bg-secondary rounded-full text-xs uppercase font-bold text-secondary-foreground">
                  Condição {selections.condition}
                </span>
              </div>

              <div className="text-5xl font-black text-primary my-4">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalValue)}
              </div>

              <div className="w-full flex flex-col gap-3 mt-4">
                <button className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg">
                  Aplicar Desconto e Continuar
                </button>
                <button 
                  onClick={() => {
                    setStep('BRAND');
                    setSelections({ brand: '', model: '', condition: '' });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Refazer cotação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
