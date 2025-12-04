import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ ESTA LÍNEA ES VITAL PARA LA APK:
  // Indica que los archivos deben buscarse de forma relativa (./) y no absoluta (/)
  base: './', 
})