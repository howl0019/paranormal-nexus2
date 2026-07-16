import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'paranormal-nexus2';

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [react()],
});
