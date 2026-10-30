import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In the sandbox preview the app is reached through the proxy at
// https://<port>-<BASE44_PUBLIC_HOST_SUFFIX>, which Vite's host check rejects by
// default. Allow exactly that host while preview mode is on; with the flag unset
// (any other value) the default host checking is untouched.
const previewHost =
  process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? `3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}`
    : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: previewHost ? [previewHost] : undefined,
  },
})
