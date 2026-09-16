import type { Config } from 'tailwindcss';
import cinmaxPreset from '@cinmax/theme/tailwind-preset';

const config: Config = {
  presets: [cinmaxPreset as Config],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
