import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '8biawkr2',
    dataset: 'production',
  },
  vite: {
    server: {
      https: true,
    },
    plugins: [basicSsl()],
  },
})
