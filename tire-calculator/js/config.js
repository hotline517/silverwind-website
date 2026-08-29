/* config.js
   Every tunable value lives here: thresholds, weights, API base URL,
   inquiry channel. Nothing else in the app hard-codes these.
*/

/* ============================================================
   recommendationConfig  →  recommendationConfig.js
   ============================================================ */
const recommendationConfig = {
  thresholds: { good: 3.0, check: 5.0 },
  maxRecommendations: 3,
  weights: { exactSize:100, rimMatch:40, loadIndex:25, speedRating:20, application:15, diameter:30, category:10, availability:12, price:8 }
};

const inquiryConfig = {
  channel: "messenger",
  endpoints: { messenger:"https://m.me/dubshop", whatsapp:"https://wa.me/63XXXXXXXXXX", form:"/contact" }
};

const siteConfig = { apiBaseUrl:"", productPageBase:"/products" };
