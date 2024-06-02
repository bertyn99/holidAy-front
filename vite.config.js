import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[tj]sx?$/,   // Use regex to include .js and .jsx files
    exclude: [],
  },
})