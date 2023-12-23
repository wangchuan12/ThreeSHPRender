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
    sourcemap : true,
    rollupOptions : {
      external : ['three'],
      output : {
        globals : {
          three : 'THREE'
        }
      },
    },
    outDir : 'public/build',
  },
  server : {
    host : '0.0.0.0'
  }
})
