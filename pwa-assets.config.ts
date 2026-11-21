import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// Gera os ícones do app a partir de public/icon.svg, com o fundo roxo do jogo.
export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: { background: "#140b24" } },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: { background: "#140b24" } },
  },
  images: ["public/icon.svg"],
});
