import {Output} from '@mui/icons-material';
import react from '@vitejs/plugin-react';
import {visualizer} from 'rollup-plugin-visualizer';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        visualizer(),
        VitePWA(),
    ],
    build: {
        sourcemap: true,
    },
    server: {
        proxy: {
            '^/getMyShows.*': {
                target: 'http://localhost:8000/getMyShows?limit=50&tivo=Bolt&offset=0',
                changeOrigin: true,
            },
            '^/stream/.*': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '^/session-streaming/.*': {
                target: 'http://localhost:8000',
            },
        },
    },
});
