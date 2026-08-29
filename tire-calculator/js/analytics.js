/* analytics.js
   Event queue. Wire a real service to analytics.track() later.
*/

/* ============================================================
   analytics  →  analytics.js   (queued, no service wired yet)
   ============================================================ */
const analytics = { queue: [], track(event, payload = {}) { analytics.queue.push({ event, payload, at: Date.now() }); } };
