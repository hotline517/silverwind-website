// Express 4 does not catch a rejected promise thrown inside an async
// route/middleware — it becomes an unhandled rejection and can take the
// whole process down (confirmed: a DB outage crashed the server entirely
// via requireAgent's un-wrapped `await query(...)`). Wrapping every async
// handler in this forwards the rejection to next(err) → the centralized
// error middleware in server.js, which is the only place that talks to
// the client about failures.
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
