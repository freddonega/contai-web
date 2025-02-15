import { create } from "zustand";

interface ColorModeState {
  colorMode: "light" | "dark";
  setColorMode: (mode: "light" | "dark") => void;
}

export const useColorModeStore = create<ColorModeState>((set) => ({
  colorMode: "dark",
  setColorMode: (mode) => set({ colorMode: mode }),
}));
