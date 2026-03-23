import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

function normalizeVersionToken(value: string): string {
  return value.trim().replace(/^['"]+|['"]+$/g, '');
}

function readGitTag(): string {
  const commands = ['git describe --tags --exact-match', 'git describe --tags'];

  for (const command of commands) {
    try {
      const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const normalized = normalizeVersionToken(output);
      if (normalized) {
        return normalized;
      }
    } catch {
      // try next command
    }
  }

  return '';
}

// Get version from environment, git tag, or package.json
function getVersion(): string {
  // 1. Environment variable (set by GitHub Actions)
  if (process.env.VERSION) {
    const version = normalizeVersionToken(process.env.VERSION);
    if (version) {
      return version;
    }
  }

  // 2. Try git tag
  const gitTag = readGitTag();
  if (gitTag) {
    return gitTag;
  }

  // 3. Fall back to package.json version
  try {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
    if (pkg.version && pkg.version !== '0.0.0') {
      const version = normalizeVersionToken(String(pkg.version));
      if (version) {
        return version;
      }
    }
  } catch {
    // package.json not readable
  }

  return 'dev';
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile({
      removeViteModuleLoader: true
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(getVersion())
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    }
  }
});
