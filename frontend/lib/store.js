import { create } from "zustand";

export const useFeedFilterStore = create((set) => ({
  search: "",
  tech: "",
  setSearch: (v) => set({ search: v }),
  setTech: (v) => set({ tech: v }),
}));