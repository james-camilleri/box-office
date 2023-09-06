import { createViteConfig } from '@the-gods/box-office/web'
import { resolve } from 'path'

export default createViteConfig({
  seatPlan: resolve('./src/SeatPlan.svelte'),
  emailFooter: resolve('./src/EmailFooter.svelte'),
})
