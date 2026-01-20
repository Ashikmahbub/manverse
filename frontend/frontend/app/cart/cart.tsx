import { create } from "zustand";

export const useCart = create((set:any) => ({
  items: [],
  addItem: (item:any) =>
    set((state:any) => ({ items: [...state.items, item] })),
  clear: () => set({ items: [] })
}));
