import { createViteConfig } from './vite-config.js'
import { resolve } from 'path'

export default createViteConfig({
  seatPlan: resolve('./src/DummySeatPlan.svelte'),
  emailFooter: resolve('./src/DummyEmailFooter.svelte'),
})
