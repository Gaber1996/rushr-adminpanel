// Build-time only (see build/bootSkeletons.js). Renders the real app at each page with no data
// yet, so every admin page draws its own loading skeleton. Those snapshots go into index.html and
// show while the app's JavaScript downloads.
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from '../App'
import { ROUTES } from '../config/routes'

/**
 * - `paths`: the addresses this snapshot is for (route patterns, with :params).
 * - `render`: the route to render, when it is not the first path.
 * - `signedIn`: only for a live session (admin pages).
 * - `fallback`: what a signed-out visitor sees on any other address (the app sends them there).
 */
const BOOT_PAGES = [
  { paths: [ROUTES.dashboard], signedIn: true },
  { paths: [ROUTES.proVerification, ROUTES.home], signedIn: true },
  { paths: [ROUTES.verificationDetails], signedIn: true },
  { paths: [ROUTES.disputeResolution], signedIn: true },
  { paths: [ROUTES.disputeDetails], signedIn: true },
  { paths: [ROUTES.userManagement], signedIn: true },
  { paths: [ROUTES.platformSettings], signedIn: true },
  { paths: [ROUTES.auditLog], signedIn: true },
  { paths: [ROUTES.login, '/'], fallback: true },
]

/** [{ paths, signedIn, fallback, html }]: `html` is the page as it first renders. */
export function renderBootSkeletons(basename) {
  return BOOT_PAGES.map((page) => {
    const location = basename + page.paths[0].replace(/:\w+/g, '0').slice(1)
    const html = renderToStaticMarkup(
      <StaticRouter basename={basename} location={location}>
        <App />
      </StaticRouter>
    )
    return { ...page, html }
  })
}
