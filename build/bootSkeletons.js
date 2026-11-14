import { createServer } from 'vite'

/**
 * Runs in the browser, inline in index.html, before the app's JavaScript arrives. Picks the
 * start-up skeleton for the current address and shows it, inert (no typing or focus), until
 * React replaces it. Admin pages need a live session; everyone else gets the sign-in page.
 * The token checks are passed in from src/lib/session.js, so there is one copy of them.
 */
function showBootSkeleton(config, isTokenLive, tokenExpiry) {
  try {
    let path = location.pathname
    if (path.indexOf(config.base) === 0) path = '/' + path.slice(config.base.length)
    const live = isTokenLive(localStorage.getItem(config.tokenKey), Date.now(), tokenExpiry)

    const templates = [...document.querySelectorAll('template[data-boot-route]')]
    const chosen =
      templates.find(
        (t) =>
          (live || !t.hasAttribute('data-boot-signed-in')) &&
          new RegExp(t.dataset.bootRoute).test(path)
      ) ??
      // Signed out on an admin page: the app will send them to sign in.
      (live ? null : templates.find((t) => t.hasAttribute('data-boot-fallback')))
    if (!chosen) return

    const shell = document.createElement('div')
    shell.inert = true
    shell.appendChild(chosen.content.cloneNode(true))
    // The avatar initials belong to the signed-in admin; React fills them in.
    const initials = shell.querySelector('[data-initials]')
    if (initials) initials.textContent = ''
    document.getElementById('root').appendChild(shell)
  } catch {
    // No storage access: start with the blank page.
  }
}

/**
 * Start-up skeletons: while the app's JavaScript downloads, the page would be blank. At build
 * time this renders the real app at each page (src/boot/renderBootSkeletons.jsx), where every
 * admin page draws its own loading skeleton, and puts each one in index.html as a <template>,
 * with the script above to show the right one.
 */
export function bootSkeletons() {
  let config
  return {
    name: 'boot-skeletons',
    apply: 'build',
    configResolved(resolved) {
      config = resolved
    },
    async transformIndexHtml(html, ctx) {
      const server = await createServer({
        configFile: config.configFile,
        server: { middlewareMode: true, hmr: false },
        appType: 'custom',
        logLevel: 'silent',
        // Load the router's ES-module build: its plain Node entry is CommonJS.
        ssr: { resolve: { externalConditions: ['module-sync'] } },
      })
      let pages, session
      try {
        const boot = await server.ssrLoadModule('/src/boot/renderBootSkeletons.jsx')
        session = await server.ssrLoadModule('/src/lib/session.js')
        pages = boot.renderBootSkeletons(config.base)
      } finally {
        await server.close()
      }

      // The render used source paths for images (an <img src>, React's preload <link href>);
      // point them at the built files.
      const builtAssets = Object.values(ctx.bundle ?? {}).filter((f) => f.type === 'asset')
      const withBuiltAssets = (markup) =>
        markup.replace(
          /(src|href)="[^"]*\/src\/assets\/([^"?]+)[^"]*"/g,
          (match, attribute, file) => {
            const built = builtAssets.find((a) => a.names?.includes(file) || a.name === file)
            return built ? `${attribute}="${config.base}${built.fileName}"` : match
          }
        )

      const templates = pages
        .map(({ route, signedIn, fallback, html: page }) => {
          const flags = [signedIn && 'data-boot-signed-in', fallback && 'data-boot-fallback']
            .filter(Boolean)
            .join(' ')
          return `<template data-boot-route="${route}" ${flags}>${withBuiltAssets(page)}</template>`
        })
        .join('\n')

      const settings = JSON.stringify({ base: config.base, tokenKey: session.TOKEN_KEY })
      const call = `(${showBootSkeleton})(${settings}, ${session.isTokenLive}, ${session.tokenExpiry})`

      return html.replace('<!--boot-skeletons-->', `${templates}\n<script>${call}</script>`)
    },
  }
}
