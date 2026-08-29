/* productService.js
   Data layer for products. Swap DEMO_CATALOG for the real catalog,
   or set siteConfig.apiBaseUrl and the fetch path takes over.
*/

/* ============================================================
   productService  →  productService.js   (demo rows only)
   ============================================================ */
const demoCatalog = [
  { id:"t01", brand:"Our Brand", model:"Grand Tourer GT7", width:265, aspect:65, rim:17, loadIndex:112, speedRating:"H", tireType:"All Season", application:["SUV","Pickup"], price:6450, stock:12, productUrl:"/products/grand-tourer-gt7-265-65r17" },
  { id:"t02", brand:"Our Brand", model:"Apex Sport AS4",  width:245, aspect:45, rim:17, loadIndex:95,  speedRating:"W", tireType:"Summer",     application:["Sedan"],        price:5980, stock:8,  productUrl:"/products/apex-sport-as4-245-45r17" },
  { id:"t03", brand:"Our Brand", model:"Apex Sport AS4",  width:225, aspect:50, rim:17, loadIndex:94,  speedRating:"V", tireType:"All Season", application:["Sedan"],        price:5320, stock:20, productUrl:"/products/apex-sport-as4-225-50r17" },
  { id:"t04", brand:"Our Brand", model:"Terrain AT9",     width:265, aspect:70, rim:16, loadIndex:112, speedRating:"T", tireType:"All Terrain",application:["SUV","Pickup"], price:6890, stock:6,  productUrl:"/products/terrain-at9-265-70r16" },
  { id:"t05", brand:"Our Brand", model:"Highway HT3",     width:275, aspect:55, rim:20, loadIndex:117, speedRating:"H", tireType:"Highway",    application:["SUV"],          price:8250, stock:4,  productUrl:"/products/highway-ht3-275-55r20" },
  { id:"t06", brand:"Our Brand", model:"Highway HT3",     width:235, aspect:60, rim:18, loadIndex:107, speedRating:"H", tireType:"Highway",    application:["SUV"],          price:6120, stock:0,  productUrl:"/products/highway-ht3-235-60r18" },
  { id:"t07", brand:"Our Brand", model:"Urban UC2",       width:215, aspect:55, rim:17, loadIndex:94,  speedRating:"V", tireType:"All Season", application:["Sedan"],        price:4780, stock:15, productUrl:"/products/urban-uc2-215-55r17" },
  { id:"t08", brand:"Our Brand", model:"Terrain AT9",     width:265, aspect:60, rim:18, loadIndex:110, speedRating:"T", tireType:"All Terrain",application:["SUV","Pickup"], price:7340, stock:9,  productUrl:"/products/terrain-at9-265-60r18" }
];
const productService = {
  async loadProducts() {
    if (siteConfig.apiBaseUrl) {
      try { const r = await fetch(`${siteConfig.apiBaseUrl}/tires`); if (r.ok) return await r.json(); } catch (e) {}
    }
    return demoCatalog;
  },
  productUrl: p => siteConfig.apiBaseUrl ? new URL(p.productUrl, siteConfig.apiBaseUrl).href : p.productUrl
};
