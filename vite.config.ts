import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function inlineCssAssets(): Plugin {
  return {
    name: 'inline-css-assets',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const cssAssets = Object.entries(bundle).filter(
        ([, item]) => item.type === 'asset' && item.fileName.endsWith('.css'),
      )
      const inlinedAssets = new Set<string>()

      for (const item of Object.values(bundle)) {
        if (item.type !== 'asset' || !item.fileName.endsWith('.html')) continue

        let html = String(item.source)

        for (const [cssName, cssAsset] of cssAssets) {
          if (cssAsset.type !== 'asset' || !html.includes(cssAsset.fileName)) continue

          const escapedFileName = cssAsset.fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const stylesheet = new RegExp(
            `<link\\b[^>]*href=["'][^"']*${escapedFileName}["'][^>]*>`,
            'g',
          )

          html = html.replace(
            stylesheet,
            `<style data-inline-css="${cssAsset.fileName}">${String(cssAsset.source)}</style>`,
          )
          inlinedAssets.add(cssName)
        }

        item.source = html
      }

      for (const assetName of inlinedAssets) delete bundle[assetName]
    },
  }
}

export default defineConfig({
  plugins: [react(), inlineCssAssets()],
  resolve: {
    alias: [
      { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
      { find: 'react-dom/client', replacement: 'preact/compat/client' },
      { find: 'react-dom', replacement: 'preact/compat' },
      { find: 'react/jsx-dev-runtime', replacement: 'preact/jsx-dev-runtime' },
      { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      { find: 'react', replacement: 'preact/compat' },
    ],
  },
  base: '/ai-cafe-network/',
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
  },
})
