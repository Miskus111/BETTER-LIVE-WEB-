/* Retired. The offline app moved to its own project; this website no longer uses a service worker.
 * Browsers that installed the old one fetch this file on their next update check: it deletes every cache
 * (including cached personal app pages), unregisters itself and reloads open tabs from the network. */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) await caches.delete(key)
      await self.registration.unregister()
      for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url)
    })(),
  )
})
