import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const uiRoot = path.resolve(__dirname, '../../packages/ui')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@repo/ui/Avatar': path.join(uiRoot, 'components/ui/avatar.tsx'),
      '@repo/ui/Tabs': path.join(uiRoot, 'components/ui/tabs.tsx'),
      '@repo/ui/Dialog': path.join(uiRoot, 'components/ui/dialog.tsx'),
      '@repo/ui/Drawer': path.join(uiRoot, 'components/ui/drawer.tsx'),
      '@repo/ui/Input': path.join(uiRoot, 'components/ui/input.tsx'),
    },
  },
  optimizeDeps: {
    exclude: ['@repo/ui'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
