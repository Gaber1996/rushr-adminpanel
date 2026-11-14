// Build-time only (see build/bootSkeletons.js). Renders the real app at each page with no data
// yet, so every admin page draws its own loading skeleton. Those snapshots go into index.html and
// show while the app's JavaScript downloads.
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from '../App'
import { ROUTES } from '../config/routes'

/** Addresses that only redirect; they show the page they lead to. */
const REDIRECTS = { [ROUTES.home]: ROUTES.proVerification, [ROUTES.root]: ROUTES.login }

/** Every admin page in ROUTES, so a new page gets its start-up skeleton without an edit here. */
const ADMIN_PAGES = Object.values(ROUTES).filter(
  (path) => path !== ROUTES.login && !(path in REDIRECTS)
)

/** The addresses that show `page`: itself plus any redirect leading to it. */
const addressesOf = (page) => [
  page,
  ...Object.keys(REDIRECTS).filter((from) => REDIRECTS[from] === page),
]

/** The route pattern with every :param replaced by `value`. */
const fillParams = (path, value) => path.replace(/:\w+/g, value)

/** Route patterns as one regex source for the address (after the base path). */
const routeRegex = (paths) =>
  `^(${paths.map((path) => fillParams(path, '[^/]+').replace(/\/$/, '')).join('|')})/?$`

/** A concrete address for a route pattern, for rendering it. */
const sampleAddress = (path) => fillParams(path, '0')

/**
 * One snapshot per page: `route` (regex source for the addresses it covers), `signedIn` (admin
 * pages: only with a live session), `fallback` (sign-in: what a signed-out visitor sees on any
 * other address, since the app sends them there) and `html` (the page as it first renders).
 */
export function renderBootSkeletons(basename) {
  const pages = [
    ...ADMIN_PAGES.map((page) => ({ page, signedIn: true, fallback: false })),
    { page: ROUTES.login, signedIn: false, fallback: true },
  ]
  return pages.map(({ page, signedIn, fallback }) => ({
    route: routeRegex(addressesOf(page)),
    signedIn,
    fallback,
    html: renderToStaticMarkup(
      <StaticRouter basename={basename} location={basename + sampleAddress(page).slice(1)}>
        <App />
      </StaticRouter>
    ),
  }))
}
