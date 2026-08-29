/* config.js — one place to point the wizard at the backend API.
   Update apiBaseUrl once the dealer-backend is deployed. */
const dealerAppConfig = {
  apiBaseUrl: window.SILVERWIND_API_BASE || 'http://localhost:4100'
  // production example: apiBaseUrl: 'https://api.silverwind.website'
};
