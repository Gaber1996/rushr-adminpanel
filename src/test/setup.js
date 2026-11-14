import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { installPopoverStandIn, resetPopovers } from './popover'

installPopoverStandIn()

afterEach(() => {
  cleanup()
  resetPopovers()
  localStorage.clear()
})
