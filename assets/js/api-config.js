/* api-config.js — the ONE place the API base URL is defined.
   Load this before any script that talks to the backend.
*/
(function () {
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