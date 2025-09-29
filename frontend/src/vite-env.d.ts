// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // You can add your other environment variables here for type safety
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
