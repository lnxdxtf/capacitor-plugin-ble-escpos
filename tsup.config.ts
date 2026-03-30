import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'], // seu entry principal
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false
})