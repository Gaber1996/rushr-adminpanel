import { copyFileSync, existsSync } from 'fs'
import path from 'path'

/**
 * GitHub Pages has no SPA rewrite: reloading a deep link such as /pro-verification/207 asks for
 * a file that does not exist and gets the site's 404.html. Shipping the app as 404.html too means
 * that page boots the app at the same URL, and the router shows the right screen.
 */
export function spaFallback() {
  let outDir
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const index = path.join(outDir, 'index.html')
      // Also runs after a failed build; don't hide that error behind a missing-file one.
      if (existsSync(index)) copyFileSync(index, path.join(outDir, '404.html'))
    },
  }
}
