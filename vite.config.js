import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { bootSkeletons } from './build/bootSkeletons'
import { spaFallback } from './build/spaFallback'

export default defineConfig({
  base: '/rushr-adminpanel/',
  plugins: [react(), bootSkeletons(), spaFallback()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
