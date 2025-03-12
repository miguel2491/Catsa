import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import fs from 'fs';

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      host:'localhost',
      https:false,//{
      //   key: fs.readFileSync(path.resolve(__dirname, './certs/key.pem')),
      //   cert: fs.readFileSync(path.resolve(__dirname, './certs/cert.pem')),
      // },
      port: 3000,
      open:true,
      proxy: {
        '/api': {
          target: 'http://apicatsa.catsaconcretos.mx:2543',//'https://apicatsa2.catsaconcretos.mx:2533/api/',  // La URL de tu servidor ASP.NET Core
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
