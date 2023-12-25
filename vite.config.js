import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib : {
      entry :'src/three-shapfile-render/shap/index.js',
      name : "ThreeShpRender",
      fileName : (formate)=>{return `three-shp-render.${formate}.js`}
    },
    assetsDir : './worker/',
    sourcemap : false,
    esbuild: {
      drop: ["console", "debugger"],
    },
    rollupOptions : {
      external : ['three'],
      treeshake : "smallest",
      output : {
        globals : {
          three : 'THREE'
        }
      },
    },
    outDir : './build',
  },
  server : {
    host : '0.0.0.0'
  }
})
