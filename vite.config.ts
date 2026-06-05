import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { pageServerPlugin } from './vite-plugin-page-server';

export default defineConfig({
  plugins: [react(), pageServerPlugin()],
});
