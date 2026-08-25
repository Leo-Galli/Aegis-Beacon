// Tailwind CDN configuration — load this AFTER the Tailwind CDN script;
// the Play CDN observes the global `tailwind.config` once it is set.
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  }
};
