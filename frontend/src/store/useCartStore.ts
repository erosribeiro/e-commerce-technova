'use client';

// O Next.js 15 SSR precisa que as diretivas globais e as fontes funcionem junto. 
// Mas para o `page.tsx` usamos 'use client' porque o ProductPage tem state (embora recomendado separar em componentes menores na vida real). No caso do ProductPage, o Next App Router fará isso se fizermos default export mas só usarmos state dentro dele ou ele será transformado em cliente.

// O arquivo product/[slug]/page.tsx foi sobrescrito pela substituição acima e precisa de `use client`. Mas na real, os filhos é que precisam do use client, então vou sobrescrever novamente a page com `use client` no topo ou criar o src/store/useCartStore.ts primeiro.

import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}));
