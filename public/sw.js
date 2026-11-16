/* BLWB service worker — offline shell.
 * - static build assets, fonts, images: cache-first (immutable)
 * - app pages and their RSC payloads: network-first, falling back to the last cached copy,
 *   then to /offline. API calls and auth routes are never cached.
 * The page cache holds personal data, so it is cleared when the user reaches /login. */
const VERSION = 'v1'
const STATIC = `blwb-static-${VERSION}`
const PAGES = `blwb-pages-${VERSION}`
const OFFLINE = '/offline'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.add(OFFLINE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ![STATIC, PAGES].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'clear-user-cache') event.waitUntil(caches.delete(PAGES).then(() => caches.open(PAGES)).then((c) => c.add(OFFLINE)))
})

const isStatic = (url) =>
  url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/images/') || url.pathname.startsWith('/pwa-icon/') || /\.(woff2?|png|svg|jpg|webp|ico)$/.test(url.pathname)
const NEVER = ['/api/', '/auth/', '/login', '/preview/']

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (NEVER.some((p) => url.pathname.startsWith(p))) return

  if (isStatic(url)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone()
              caches.open(STATIC).then((c) => c.put(req, copy))
            }
            return res
          }),
      ),
    )
    return
  }

  const isPage = req.mode === 'navigate' || req.headers.get('RSC') === '1'
  if (!isPage) return
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && !res.redirected) {
          const copy = res.clone()
          caches.open(PAGES).then((c) => c.put(req, copy))
        }
        return res
      })
      .catch(async () => (await caches.match(req)) || (req.mode === 'navigate' ? caches.match(OFFLINE) : Response.error())),
  )
})
