/* api-config.js — the ONE place the API base URL is defined.
   Load this before any script that talks to the backend.

   It auto-detects the environment, so the same files work locally and in
   production with no edit at deploy time:
     - served from localhost / 127.0.0.1  -> local dev backend
     - served from any real domain        -> production API

   TO GO LIVE: set PRODUCTION_API_BASE below to the real HTTPS API URL.
   That is the only line that needs to change.
*/
(function () {
  // <<< SET THIS TO YOUR RENDER BACKEND URL >>>
  const PRODUCTION_API_BASE = 'https://silverwind-website.onrender.com';
  const LOCAL_API_BASE = 'http://localhost:4100';

  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '' || host === '::1';

  window.SILVERWIND_API_BASE = isLocal ? LOCAL_API_BASE : PRODUCTION_API_BASE;

  // Back-compat: existing scripts read these config objects.
  window.adminAuthConfig = window.adminAuthConfig || {};
  window.adminAuthConfig.apiBaseUrl = window.SILVERWIND_API_BASE;

  window.dealerPortalConfig = window.dealerPortalConfig || {};
  window.dealerPortalConfig.apiBaseUrl = window.SILVERWIND_API_BASE;
})();