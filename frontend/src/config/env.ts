export const env = {
  BACKEND_MODE: import.meta.env.VITE_MODE,
  BACKEND_DEV_API: import.meta.env.VITE_DEV_BASE_BACKEND_URL,
  BACKEND_PROD_API: import.meta.env.VITE_PROD_BASE_BACKEND_URL,
};
