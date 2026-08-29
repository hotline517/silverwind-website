// ============================================================
//  MAG WHEELS — catalog data
//  Source: Dubshop / Silverwind supplier price lists (2026)
//
//  HOW TO ADD OR EDIT A WHEEL
//  Copy an existing line, change the values, give it a new id.
//
//    id        unique, "mag-<number>" — never reuse a number
//    brand     the real wheel brand (shows in the Brand filter)
//    model     model name as printed on the product photo
//    finish    colour / finish name, e.g. "Hyper Black"
//    diameter  rim size in inches, as a number: 17
//    width     rim width as text, e.g. "8.5" or "8 / 8.5 / 9".
//              Use null when the price list doesn't state it.
//    holes     bolt pattern(s) as an array: [6] or [5, 6]
//              PRICING FOLLOWS HOLES — keep this accurate.
//    price     peso amount as a number, or null for "Contact for price"
//    img       path under assets/images/mags/... (or null)
//    variant   OPTIONAL — price-list variant label such as
//              "Black Vacuum" or "Forged". Omit when there isn't one.
//    listedUnder OPTIONAL — only when the wheel is sold under a
//              different heading than its brand, e.g. an Ion wheel
//              listed under "TWG Wheels".
//
//  After editing, bump DATA_VERSION in db.js so browsers pick up
//  the change instead of serving their cached copy.
// ============================================================

const MAG_ROWS = [

  // ── BLACK MAMBA ───────────────────────────────────
  { id: "mag-1", brand: "Black Mamba", model: "Kenzo", finish: "Machine Face", diameter: 16, width: "10", holes: [6], price: 34400, img: "assets/images/mags/BlackMamba/blackmamba_01.jpg" },
  { id: "mag-2", brand: "Black Mamba", model: "Swagg", finish: "Hyper Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], price: 52800, img: "assets/images/mags/BlackMamba/blackmamba_02.jpg" },
  { id: "mag-3", brand: "Black Mamba", model: "Helix", finish: "Hyper Black", diameter: 17, width: "8.5", holes: [6], price: 63600, img: "assets/images/mags/BlackMamba/blackmamba_03.jpg", variant: "Black Vacuum" },
  { id: "mag-4", brand: "Black Mamba", model: "GR6", finish: "Matte Purple", diameter: 17, width: "10", holes: [6], price: 54400, img: "assets/images/mags/BlackMamba/blackmamba_04.jpg" },
  { id: "mag-5", brand: "Black Mamba", model: "JTBM1", finish: "Satin Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], price: 54800, img: "assets/images/mags/BlackMamba/blackmamba_05.jpg" },
  { id: "mag-6", brand: "Black Mamba", model: "KF926", finish: "Satin Black", diameter: 18, width: "9", holes: [6], price: 66000, img: "assets/images/mags/BlackMamba/blackmamba_06.jpg", variant: "Black Vacuum" },
  { id: "mag-7", brand: "Black Mamba", model: "N2412", finish: "Gloss Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [5, 6], price: 65200, img: "assets/images/mags/BlackMamba/blackmamba_07.jpg" },
  { id: "mag-8", brand: "Black Mamba", model: "SRFF124", finish: "Gloss Black", diameter: 20, width: "10", holes: [6], price: 68800, img: "assets/images/mags/BlackMamba/blackmamba_08.jpg" },
  { id: "mag-9", brand: "Black Mamba", model: "SRFF125", finish: "Satin Black", diameter: 20, width: "12", holes: [6], price: 77200, img: "assets/images/mags/BlackMamba/blackmamba_09.jpg" },
  { id: "mag-10", brand: "Black Mamba", model: "FBX388 Strata", finish: "Gloss Black", diameter: 22, width: "9 / 9.5", holes: [5, 6], price: 76800, img: "assets/images/mags/BlackMamba/blackmamba_10.jpg" },
  { id: "mag-11", brand: "Black Mamba", model: "5840 Devastator", finish: "Satin Dark Bronze", diameter: 22, width: "9 / 9.5", holes: [5, 6], price: 173600, img: "assets/images/mags/BlackMamba/blackmamba_11.jpg", variant: "Forged" },
   { id: "mag-12", brand: "Black Mamba", model: "GR6", finish: "Hyper Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-gr6-1143-hb.jpg" },
  { id: "mag-13", brand: "Black Mamba", model: "G234X", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-g234x-1143-sb.jpg" },
  { id: "mag-14", brand: "Black Mamba", model: "AZ319", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-az319-1143-sb.jpg" },
  { id: "mag-15", brand: "Black Mamba", model: "GR6", finish: "Matte Bronze / Gloss Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-gr6-1143-mbgb.jpg" },  // VERIFY finish
  { id: "mag-16", brand: "Black Mamba", model: "JTBM1", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-jtbm1-1143-sb.jpg" },
  { id: "mag-17", brand: "Black Mamba", model: "KF926", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-kf926-1143-sb.jpg" },
  { id: "mag-18", brand: "Black Mamba", model: "GR6", finish: "Matte Purple", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-gr6-1143-mp.jpg" },
  { id: "mag-19", brand: "Black Mamba", model: "GR6", finish: "Matte Purple", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-gr6-1397-mp.jpg" },
  { id: "mag-20", brand: "Black Mamba", model: "G236X", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-g236x-1397-sb.jpg" },
  { id: "mag-21", brand: "Black Mamba", model: "BM707Z", finish: "Satin Machine Face", diameter: 17, width: "9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-bm707z-1397-smf.jpg" },
  { id: "mag-22", brand: "Black Mamba", model: "G235X", finish: "Satin Silver", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-g235x-1397-ss.jpg" },
  { id: "mag-23", brand: "Black Mamba", model: "F20Q501", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-f20q501-1397-sb.jpg" },
  { id: "mag-24", brand: "Black Mamba", model: "GBM71", finish: "Matte Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-gbm71-1397-mb.jpg" },
  { id: "mag-25", brand: "Black Mamba", model: "14152 TANKER", finish: "Satin Black Lip / Bronze Face", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-14152-tanker-1397-sblbzf.jpg" },  // VERIFY finish
  { id: "mag-26", brand: "Black Mamba", model: "FF117", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-ff117-1397-sb.jpg" },
  { id: "mag-27", brand: "Black Mamba", model: "FF121", finish: "Dark Bronze", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-ff121-1397-dbz.jpg" },
  { id: "mag-28", brand: "Black Mamba", model: "66683", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-66683-1397-sb.jpg" },
  { id: "mag-29", brand: "Black Mamba", model: "GR6", finish: "Hyper Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-gr6-1397-hb.jpg" },
  { id: "mag-30", brand: "Black Mamba", model: "53846", finish: "Satin Silver", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-53846-1397-ss.jpg" },
  { id: "mag-31", brand: "Black Mamba", model: "66683", finish: "Satin Black / Gunmetal", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-66683-1397-sbg.jpg" },
  { id: "mag-32", brand: "Black Mamba", model: "AM626", finish: "Dark Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-am626-1397-dg.jpg" },
  { id: "mag-33", brand: "Black Mamba", model: "M73", finish: "Satin Machine Face", diameter: 17, width: "8.5", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-m73-1397-smf.jpg" },
  { id: "mag-34", brand: "Black Mamba", model: "70243", finish: "Gloss Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-70243-1397-gb.jpg" },
  { id: "mag-35", brand: "Black Mamba", model: "G236X", finish: "Satin Silver", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-g236x-1397-ss.jpg" },
  { id: "mag-36", brand: "Black Mamba", model: "GBM71", finish: "Dark Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-gbm71-1397-dg.jpg" },
  { id: "mag-37", brand: "Black Mamba", model: "53844", finish: "Neo Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-53844-1397-ng.jpg" },  // VERIFY finish
  { id: "mag-38", brand: "Black Mamba", model: "BM71", finish: "Matte Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-bm71-1397-mb.jpg" },
  { id: "mag-39", brand: "Black Mamba", model: "TOKIO", finish: "Satin Face / Matte Face", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-tokio-1397-sfmf.jpg" },
  { id: "mag-40", brand: "Black Mamba", model: "SRFF119", finish: "Dark Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-srff119-1397-dsb.jpg" },
  { id: "mag-41", brand: "Black Mamba", model: "BM73Z1", finish: "Machine Face", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-bm73z1-1397-mf.jpg" },
  { id: "mag-42", brand: "Black Mamba", model: "13356", finish: "Black Machine Silver", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-13356-1397-bms.jpg" },
  { id: "mag-43", brand: "Black Mamba", model: "G236X", finish: "Satin Dark Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-g236x-1397-sdg.jpg" },
  { id: "mag-44", brand: "Black Mamba", model: "5835", finish: "Satin Dark Bronze", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-5835-1397-sdbz.jpg" },
  { id: "mag-45", brand: "Black Mamba", model: "AZ319", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-az319-1397-sb.jpg" },
  { id: "mag-46", brand: "Black Mamba", model: "FF117", finish: "Satin Dark Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-ff117-1397-sdg.jpg" },
  { id: "mag-47", brand: "Black Mamba", model: "BM707Z", finish: "Satin Machine Face", diameter: 17, width: "9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-bm707z-1397-smf-2.jpg" },
  { id: "mag-48", brand: "Black Mamba", model: "5005", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-5005-1397-sb.jpg" },
  { id: "mag-49", brand: "Black Mamba", model: "77453", finish: "Gloss Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-77453-1397-gb.jpg" },
  { id: "mag-50", brand: "Black Mamba", model: "820931", finish: "Satin Silver", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-820931-1397-ss.jpg" },
  { id: "mag-51", brand: "Black Mamba", model: "TOKIO", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-tokio-1397-sb.jpg" },
  { id: "mag-52", brand: "Black Mamba", model: "70243", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-70243-1397-sb.jpg" },
  { id: "mag-53", brand: "Black Mamba", model: "N2409", finish: "Satin Face Machine Cut", diameter: 17, width: "8.5", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-n2409-1397-sfmcc.jpg" },  // VERIFY finish
  { id: "mag-54", brand: "Black Mamba", model: "GR6", finish: "Matte Bronze / Gloss Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-gr6-1397-mbgb.jpg" },  // VERIFY finish
  { id: "mag-55", brand: "Black Mamba", model: "SR0246", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-sr0246-1397-sb.jpg" },
  { id: "mag-56", brand: "Black Mamba", model: "14152 TANKER", finish: "Satin Black Lip / Silver-Sunshine Face", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-14152-tanker-1397-sblshsf.jpg" },  // VERIFY finish
  { id: "mag-57", brand: "Black Mamba", model: "53844", finish: "Satin Face Machine", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-53844-1397-sfm.jpg" },
  { id: "mag-58", brand: "Black Mamba", model: "BM71", finish: "Dark Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-bm71-1397-dg.jpg" },
  { id: "mag-59", brand: "Black Mamba", model: "53844", finish: "BBL", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-53844-1397-bbl.jpg" },  // VERIFY finish
  { id: "mag-60", brand: "Black Mamba", model: "5006", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-5006-1397-sb.jpg" },
  { id: "mag-61", brand: "Black Mamba", model: "70243", finish: "Satin Matte Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-70243-1397-smb.jpg" },
  { id: "mag-62", brand: "Black Mamba", model: "14152 TANKER", finish: "Satin Black Lip / Gunmetal Face", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-14152-tanker-1397-sblgf.jpg" },  // VERIFY finish
  { id: "mag-63", brand: "Black Mamba", model: "77453", finish: "Satin Black Machine Silver", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-77453-1397-sbms.jpg" },  // VERIFY finish
  { id: "mag-64", brand: "Black Mamba", model: "TOKIO", finish: "Satin Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-tokio-1397-sg.jpg" },
  { id: "mag-65", brand: "Black Mamba", model: "84243", finish: "Satin Silver", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-84243-1397-ss.jpg" },
  { id: "mag-66", brand: "Black Mamba", model: "66683", finish: "Satin Gray / Black Lip", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-66683-1397-sgbl.jpg" },  // VERIFY finish
  { id: "mag-67", brand: "Black Mamba", model: "N2403", finish: "Satin Face Machine Cut", diameter: 17, width: "9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-n2403-1397-sfmcc.jpg" },  // VERIFY finish
  { id: "mag-68", brand: "Black Mamba", model: "820931", finish: "Gloss Black / Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-820931-1397-gbsb.jpg" },  // VERIFY finish
  { id: "mag-69", brand: "Black Mamba", model: "SRFF119", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-srff119-1397-sb.jpg" },
  { id: "mag-70", brand: "Black Mamba", model: "SRFF119", finish: "Satin Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-srff119-1397-sg.jpg" },
  { id: "mag-71", brand: "Black Mamba", model: "FF121", finish: "Black Machine Face", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-ff121-1397-bmf.jpg" },
  { id: "mag-72", brand: "Black Mamba", model: "53846", finish: "Satin Dark Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-53846-1397-sdg.jpg" },
  { id: "mag-73", brand: "Black Mamba", model: "3S1102", finish: "Satin Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-3s1102-1397-sg.jpg" },
  { id: "mag-74", brand: "Black Mamba", model: "TOKIO", finish: "Hyper Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-tokio-1397-hb.jpg" },
  { id: "mag-75", brand: "Black Mamba", model: "FF121", finish: "Dark Gray", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-ff121-1397-dg.jpg" },
  { id: "mag-76", brand: "Black Mamba", model: "SR111", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-sr111-1397-sb.jpg" },
  { id: "mag-77", brand: "Black Mamba", model: "SRFF122", finish: "Black Vacuum", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 63600, img: "assets/images/mags/BlackMamba/blackmamba-srff122-1397-bvc.jpg" },
  { id: "mag-78", brand: "Black Mamba", model: "FF121", finish: "Hyper Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-ff121-1397-hb.jpg" },
  { id: "mag-79", brand: "Black Mamba", model: "BM71", finish: "Matte", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-bm71-1397-m.jpg" },  // VERIFY finish
  { id: "mag-80", brand: "Black Mamba", model: "SR6100", finish: "Satin Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 52800, img: "assets/images/mags/BlackMamba/blackmamba-sr6100-1397-sb.jpg" },
   { id: "mag-81", brand: "Black Mamba", model: "5840", finish: "Satin Dark Bronze", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-5840-1143-sdbz-18.jpg" },
  { id: "mag-82", brand: "Black Mamba", model: "MADNESS", finish: "Satin Machine Face", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-madness-1143-smf-18.jpg" },
  { id: "mag-83", brand: "Black Mamba", model: "SRFF124", finish: "GBSRLW", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff124-1143-gbsrlw-18.jpg" },  // VERIFY finish
  { id: "mag-84", brand: "Black Mamba", model: "SRFF124", finish: "GBPM", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff124-1143-gbpm-18.jpg" },  // VERIFY finish
  { id: "mag-85", brand: "Black Mamba", model: "F22318", finish: "Gloss Black / Machine Silver", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-f22318-1143-gbms-18.jpg" },  // VERIFY finish
  { id: "mag-86", brand: "Black Mamba", model: "MADNESS", finish: "Gloss Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-madness-1143-gb-18.jpg" },
  { id: "mag-87", brand: "Black Mamba", model: "SRFF124", finish: "RWBB", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff124-1143-rwbb-18.jpg" },  // VERIFY finish
  { id: "mag-88", brand: "Black Mamba", model: "SR114", finish: "Satin Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 114.3, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-sr114-1143-sb-18.jpg" },
  { id: "mag-89", brand: "Black Mamba", model: "FF120", finish: "Satin Dark Gray", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-ff120-1397-sdg-18.jpg" },
  { id: "mag-90", brand: "Black Mamba", model: "MADNESS", finish: "GMFSBL", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-madness-1397-gmfsbl-18.jpg" },  // VERIFY finish
  { id: "mag-91", brand: "Black Mamba", model: "538412", finish: "Satin Bronze", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-538412-1397-sbz-18.jpg" },  // VERIFY finish
  { id: "mag-92", brand: "Black Mamba", model: "F22218", finish: "Satin Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-f22218-1397-sb-18.jpg" },
  { id: "mag-93", brand: "Black Mamba", model: "FBX059", finish: "Gloss Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-fbx059-1397-gb-18.jpg" },
  { id: "mag-94", brand: "Black Mamba", model: "MADNESS", finish: "Satin Machine Face", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-madness-1397-smf-18.jpg" },
  { id: "mag-95", brand: "Black Mamba", model: "SR114", finish: "Satin Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-sr114-1397-sb-18.jpg" },
  { id: "mag-96", brand: "Black Mamba", model: "FF120", finish: "Satin Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-ff120-1397-sb-18.jpg" },
  { id: "mag-97", brand: "Black Mamba", model: "SR114", finish: "Satin Black / Gunmetal Face", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-sr114-1397-sbgf-18.jpg" },  // VERIFY finish
  { id: "mag-98", brand: "Black Mamba", model: "AM626", finish: "Dark Gray", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-am626-1397-dg-18.jpg" },
  { id: "mag-99", brand: "Black Mamba", model: "SRFF124", finish: "Gloss Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff124-1397-gb-18.jpg" },
  { id: "mag-100", brand: "Black Mamba", model: "SRFF125", finish: "Satin Machine Face", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff125-1397-smf-18.jpg" },
  { id: "mag-101", brand: "Black Mamba", model: "F22318", finish: "Satin Dark Gray", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-f22318-1397-sdg-18.jpg" },
  { id: "mag-102", brand: "Black Mamba", model: "SRFF125", finish: "Dark Gray", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff125-1397-dg-18.jpg" },
  { id: "mag-103", brand: "Black Mamba", model: "SRFF125", finish: "Satin Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff125-1397-sb-18.jpg" },
  { id: "mag-104", brand: "Black Mamba", model: "F22218", finish: "Satin Dark Bronze", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-f22218-1397-sdbz-18.jpg" },
  { id: "mag-105", brand: "Black Mamba", model: "SR114", finish: "SBPG", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-sr114-1397-sbpg-18.jpg" },  // VERIFY finish
  { id: "mag-106", brand: "Black Mamba", model: "AZ321", finish: "Satin Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-az321-1397-sb-18.jpg" },
  { id: "mag-107", brand: "Black Mamba", model: "SRFF124", finish: "Satin Machine Face", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff124-1397-smf-18.jpg" },
  { id: "mag-108", brand: "Black Mamba", model: "FBX059", finish: "NB", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-fbx059-1397-nb-18.jpg" },  // VERIFY finish
  { id: "mag-109", brand: "Black Mamba", model: "F22318", finish: "Satin Dark Bronze", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-f22318-1397-sdbz-18.jpg" },
  { id: "mag-110", brand: "Black Mamba", model: "5840 Devastator", finish: "Satin Dark Bronze", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-5840-devastator-1397-sdbz-18.jpg" },
  { id: "mag-111", brand: "Black Mamba", model: "SRFF124", finish: "RWBB", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff124-1397-rwbb-18.jpg" },  // VERIFY finish
  { id: "mag-112", brand: "Black Mamba", model: "N2412", finish: "Gloss Black", diameter: 18, width: "9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-n2412-1397-gb-18.jpg" },
  { id: "mag-113", brand: "Black Mamba", model: "SRFF124", finish: "GBSRLW", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff124-1397-gbsrlw-18.jpg" },  // VERIFY finish
  { id: "mag-114", brand: "Black Mamba", model: "F22318", finish: "Gloss Black / Machine Silver", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-f22318-1397-gbms-18.jpg" },  // VERIFY finish
  { id: "mag-115", brand: "Black Mamba", model: "GR6", finish: "Black Vacuum", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 66000, img: "assets/images/mags/BlackMamba/blackmamba-gr6-1397-bvc-18.jpg" },
  { id: "mag-116", brand: "Black Mamba", model: "N2412", finish: "Satin Machine", diameter: 18, width: "9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-n2412-1397-sm-18.jpg" },  // VERIFY finish
  { id: "mag-117", brand: "Black Mamba", model: "Fbx388 Strata", finish: "Gloss Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-fbx388-strata-1397-gb-18.jpg" },
  { id: "mag-118", brand: "Black Mamba", model: "SRFF124", finish: "Black", diameter: 18, width: "8 / 8.5 / 9", holes: [6], pcd: 139.7, price: 54800, img: "assets/images/mags/BlackMamba/blackmamba-srff124-1397-b-18.jpg" },
   { id: "mag-119", brand: "Black Mamba", model: "SR115", finish: "Satin Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 114.3, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr115-1143-sb-20.jpg" },
  { id: "mag-120", brand: "Black Mamba", model: "AZ320", finish: "Satin Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 114.3, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-az320-1143-sb-20.jpg" },
  { id: "mag-121", brand: "Black Mamba", model: "3S198", finish: "Satin Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 114.3, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-3s198-1143-sb-20.jpg" },
  { id: "mag-122", brand: "Black Mamba", model: "3S198", finish: "Dark Gray", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 114.3, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-3s198-1143-dg-20.jpg" },
  { id: "mag-123", brand: "Black Mamba", model: "3S198", finish: "Black Machine Silver", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 114.3, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-3s198-1143-bms-20.jpg" },
  { id: "mag-124", brand: "Black Mamba", model: "CT1066", finish: "Satin Gray", diameter: 20, width: "8.5 / 9 / 9.5", holes: [5], pcd: 114.3, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-ct1066-1143-sg-20.jpg" },
  { id: "mag-125", brand: "Black Mamba", model: "FBX028", finish: "Hyper Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 114.3, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-fbx028-1143-hb-20.jpg" },
  { id: "mag-126", brand: "Black Mamba", model: "JTBM3", finish: "BM", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 114.3, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-jtbm3-1143-bm-20.jpg" },  // VERIFY finish
  { id: "mag-127", brand: "Black Mamba", model: "SR114", finish: "SBPG", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr114-1397-sbpg-20.jpg" },  // VERIFY finish
  { id: "mag-128", brand: "Black Mamba", model: "SRFF123", finish: "Gloss Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-srff123-1397-gb-20.jpg" },
  { id: "mag-129", brand: "Black Mamba", model: "SR102", finish: "HS", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr102-1397-hs-20.jpg" },  // VERIFY finish
  { id: "mag-130", brand: "Black Mamba", model: "D005", finish: "SBMRS", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-d005-1397-sbmrs-20.jpg" },  // VERIFY finish
  { id: "mag-131", brand: "Black Mamba", model: "D007", finish: "Satin Black Machine Silver", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-d007-1397-sbms-20.jpg" },
  { id: "mag-132", brand: "Black Mamba", model: "80243", finish: "Black Machine Silver", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-80243-1397-bms-20.jpg" },
  { id: "mag-133", brand: "Black Mamba", model: "SR115", finish: "SBPG", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr115-1397-sbpg-20.jpg" },  // VERIFY finish
  { id: "mag-134", brand: "Black Mamba", model: "6985X", finish: "BPCC", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-6985x-1397-bpcc-20.jpg" },  // VERIFY finish
  { id: "mag-135", brand: "Black Mamba", model: "FBX027", finish: "TGB", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-fbx027-1397-tgb-20.jpg" },  // VERIFY finish
  { id: "mag-136", brand: "Black Mamba", model: "SR113", finish: "Satin Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr113-1397-sb-20.jpg" },
  { id: "mag-137", brand: "Black Mamba", model: "AZ312", finish: "SBPF", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-az312-1397-sbpf-20.jpg" },  // VERIFY finish
  { id: "mag-138", brand: "Black Mamba", model: "SR115", finish: "BP", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr115-1397-bp-20.jpg" },  // VERIFY finish
  { id: "mag-139", brand: "Black Mamba", model: "SR114", finish: "Satin Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr114-1397-sb-20.jpg" },
  { id: "mag-140", brand: "Black Mamba", model: "SR115", finish: "Satin Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr115-1397-sb-20.jpg" },
  { id: "mag-141", brand: "Black Mamba", model: "SR108", finish: "BP", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-sr108-1397-bp-20.jpg" },  // VERIFY finish
  { id: "mag-142", brand: "Black Mamba", model: "FF116", finish: "Satin Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-ff116-1397-sb-20.jpg" },
  { id: "mag-143", brand: "Black Mamba", model: "SRFF123", finish: "Satin Black / Machine Face", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-srff123-1397-sbmf-20.jpg" },  // VERIFY finish
  { id: "mag-144", brand: "Black Mamba", model: "AZ320", finish: "Satin Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-az320-1397-sb-20.jpg" },
  { id: "mag-145", brand: "Black Mamba", model: "5774", finish: "BG", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-5774-1397-bg-20.jpg" },  // VERIFY finish
  { id: "mag-146", brand: "Black Mamba", model: "D005", finish: "SBM", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-d005-1397-sbm-20.jpg" },
  { id: "mag-147", brand: "Black Mamba", model: "CT1079", finish: "BP", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-ct1079-1397-bp-20.jpg" },  // VERIFY finish
  { id: "mag-148", brand: "Black Mamba", model: "71243", finish: "Black Machine Silver", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-71243-1397-bms-20.jpg" },
  { id: "mag-149", brand: "Black Mamba", model: "5774 Frostbite", finish: "Satin Machine Face", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-5774-frostbite-1397-smf-20.jpg" },
  { id: "mag-150", brand: "Black Mamba", model: "SRFF123", finish: "Satin Machine Face", diameter: 20, width: "8.5 / 9 / 9.5", holes: [6], pcd: 139.7, price: 65200, img: "assets/images/mags/BlackMamba/blackmamba-srff123-1397-smf-20.jpg" },
  { id: "mag-151", brand: "Black Mamba", model: "SR102", finish: "HS", diameter: 22, width: "9 / 9.5", holes: [6], pcd: 114.3, price: 76800, img: "assets/images/mags/BlackMamba/blackmamba-sr102-1143-hs-22.jpg" },  // VERIFY finish
  { id: "mag-152", brand: "Black Mamba", model: "SR102", finish: "Gloss Black", diameter: 22, width: "9 / 9.5", holes: [6], pcd: 114.3, price: 76800, img: "assets/images/mags/BlackMamba/blackmamba-sr102-1143-gb-22.jpg" },
  { id: "mag-153", brand: "Black Mamba", model: "3S1156", finish: "GBLP", diameter: 22, width: "9 / 9.5", holes: [6], pcd: 139.7, price: 76800, img: "assets/images/mags/BlackMamba/blackmamba-3s1156-1397-gblp-22.jpg" },  // VERIFY finish
  { id: "mag-154", brand: "Black Mamba", model: "SR102", finish: "Hyper Black", diameter: 22, width: "9 / 9.5", holes: [6], pcd: 139.7, price: 76800, img: "assets/images/mags/BlackMamba/blackmamba-sr102-1397-hb-22.jpg" },
  { id: "mag-155", brand: "Black Mamba", model: "3S1156", finish: "Machine Face", diameter: 22, width: "9 / 9.5", holes: [6], pcd: 139.7, price: 76800, img: "assets/images/mags/BlackMamba/blackmamba-3s1156-1397-mf-22.jpg" },
  { id: "mag-156", brand: "Black Mamba", model: "SR110", finish: "Hyper Black", diameter: 22, width: "9 / 9.5", holes: [6], pcd: 139.7, price: 76800, img: "assets/images/mags/BlackMamba/blackmamba-sr110-1397-hb-22.jpg" },
  { id: "mag-157", brand: "Black Mamba", model: "SR102", finish: "Gloss Black", diameter: 22, width: "9 / 9.5", holes: [5], pcd: 150, price: 76800, img: "assets/images/mags/BlackMamba/blackmamba-sr102-150-gb-22.jpg" },
  

  // ── 305 FORGED WHEELS ─────────────────────────────
  { id: "mag-12", brand: "305 Forged Wheels", model: "UF151", finish: "Brushed Silver", diameter: 18, width: "9", holes: [6], price: 54800, img: "assets/images/mags/305Forged/305forged_00.jpg" },
  { id: "mag-13", brand: "305 Forged Wheels", model: "UF175", finish: "Polished", diameter: 19, width: "8.5", holes: [5], price: 71600, img: "assets/images/mags/305Forged/305forged_04.jpg" },
  { id: "mag-14", brand: "305 Forged Wheels", model: "FT124", finish: "Hyper Black", diameter: 20, width: "8.5", holes: [5], price: 78800, img: "assets/images/mags/305Forged/305forged_05.jpg" },
  { id: "mag-15", brand: "305 Forged Wheels", model: "UF179", finish: "Satin Full Polish", diameter: 20, width: "8.5", holes: [5], price: 150000, img: "assets/images/mags/305Forged/305forged_03.jpg" },
  { id: "mag-16", brand: "305 Forged Wheels", model: "UF175", finish: "Polished", diameter: 20, width: "9.5/10", holes: [5], price: 180000, img: "assets/images/mags/305Forged/305forged_04.jpg" },
  { id: "mag-17", brand: "305 Forged Wheels", model: "UF151", finish: "Deep GM Brushed", diameter: 22, width: "9.5", holes: [6], price: 200000, img: "assets/images/mags/305Forged/305forged_02.jpg" },
  { id: "mag-18", brand: "305 Forged Wheels", model: "UF151", finish: "Brushed Silver", diameter: 24, width: "10", holes: [6], price: 240000, img: "assets/images/mags/305Forged/305forged_00.jpg" },

  // ── TSR ───────────────────────────────────────────
  { id: "mag-28", brand: "TSR", model: "TSR15", finish: "Matte Gray", diameter: 15, width: "6.5", holes: [4, 8], price: 26000, img: "assets/images/mags/TSR/tsr_05.jpg" },
  { id: "mag-29", brand: "TSR", model: "CTWGT", finish: "Black", diameter: 15, width: "7", holes: [4, 8], price: 31200, img: "assets/images/mags/TSR/tsr_10.jpg" },
  { id: "mag-30", brand: "TSR", model: "DX541", finish: "Full Matte Face", diameter: 16, width: "7", holes: [6], price: 36400, img: "assets/images/mags/TSR/tsr_08.jpg" },
  { id: "mag-31", brand: "TSR", model: "TSR18", finish: "Black Lip Polish", diameter: 17, width: "7/7.5", holes: [6], price: 52800, img: "assets/images/mags/TSR/tsr_09.jpg" },
  { id: "mag-32", brand: "TSR", model: "CTWGT", finish: "Satin Black", diameter: 17, width: "7.5", holes: [4, 8], price: 44400, img: "assets/images/mags/TSR/tsr_04.jpg" },
  { id: "mag-33", brand: "TSR", model: "XY66", finish: "Bronze Matte", diameter: 18, width: "8/8.5/9", holes: [6], price: 54800, img: "assets/images/mags/TSR/tsr_07.jpg" },
  { id: "mag-70", brand: "TSR", model: "1051", finish: "Bronze Machined Face", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-01-1051-bronze-machined.jpg" },
  { id: "mag-71", brand: "TSR", model: "259", finish: "Bronze Machined Face", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-02-259-bronze-machined.jpg" },
  { id: "mag-72", brand: "TSR", model: "ADVAN", finish: "Hyper Black Lip Machined", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-03-advan-hyper-black.jpg" },
  { id: "mag-73", brand: "TSR", model: "CTW TYPE-C", finish: "Bronze", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-04-ctw-typec-bronze.jpg" },
  { id: "mag-74", brand: "TSR", model: "CTW-TYPE C", finish: "Silver", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-05-ctw-typec-silver.jpg" },
  { id: "mag-75", brand: "TSR", model: "CTW-TYPE C", finish: "Gunmetal Silver", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-06-ctw-typec-gunmetal-silver.jpg" },
  { id: "mag-76", brand: "TSR", model: "CTWGT", finish: "Gunmetal Silver", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-07-ctwgt-gunmetal-silver.jpg" },
  { id: "mag-77", brand: "TSR", model: "CTWGT", finish: "Hyper Black Lip Polish", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-08-ctwgt-hyper-black-lip.jpg" },
  { id: "mag-78", brand: "TSR", model: "CTWGT", finish: "Satin Black", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-09-ctwgt-satin-black.jpg" },
  { id: "mag-79", brand: "TSR", model: "DX007", finish: "Bronze Machined Face", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-10-dx007-bronze-machined.jpg" },
  { id: "mag-80", brand: "TSR", model: "DX007", finish: "Dark Gray", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-11-dx007-dark-gray.jpg" },
  { id: "mag-81", brand: "TSR", model: "DX137", finish: "Black", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-12-dx137-black.jpg" },
  { id: "mag-82", brand: "TSR", model: "DX137", finish: "Gray", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-13-dx137-gray.jpg" },
  { id: "mag-83", brand: "TSR", model: "DX376", finish: "Dark Gray", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-14-dx376-dark-gray.jpg" },
  { id: "mag-84", brand: "TSR", model: "FBX014 SPOON", finish: "Matte Black", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-15-fbx014-spoon-matte-black.jpg" },
  { id: "mag-85", brand: "TSR", model: "FBX014 SPOON", finish: "White", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-16-fbx014-spoon-white.jpg" },
  { id: "mag-86", brand: "TSR", model: "FBX019 CE28", finish: "Bronze", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-17-fbx019-ce28-bronze.jpg" },
  { id: "mag-87", brand: "TSR", model: "FBX019 CE28", finish: "Gunmetal Black", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-18-fbx019-ce28-gunmetal-black.jpg" },
  { id: "mag-88", brand: "TSR", model: "FBX022 RPF1", finish: "Gunmetal Black", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-19-fbx022-rpf1-gunmetal-black.jpg" },
  { id: "mag-89", brand: "TSR", model: "FBX022 RPF1", finish: "Silver", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-20-fbx022-rpf1-silver.jpg" },
  { id: "mag-90", brand: "TSR", model: "TC105X", finish: "Bronze", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-21-tc105x-bronze.jpg" },
  { id: "mag-91", brand: "TSR", model: "TC105X", finish: "Gunmetal", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-22-tc105x-gunmetal.jpg" },
  { id: "mag-92", brand: "TSR", model: "TC105X", finish: "Satin Black", diameter: 16, width: "7", holes: [4], price: 36400, img: "assets/images/mags/TSR/tsr100-23-tc105x-satin-black.jpg" },
  { id: "mag-93", brand: "TSR", model: "TE37", finish: "Gunmetal Black", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-24-te37-gunmetal-black.jpg" },
  { id: "mag-94", brand: "TSR", model: "TS04", finish: "Satin Black", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-25-ts04-satin-black.jpg" },
  { id: "mag-95", brand: "TSR", model: "TS04", finish: "Satin Dark Bronze", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-26-ts04-satin-dark-bronze.jpg" },
  { id: "mag-96", brand: "TSR", model: "TS08", finish: "Satin Dark Gray", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-27-ts08-satin-dark-gray.jpg" },
  { id: "mag-97", brand: "TSR", model: "TSR15", finish: "Matte Gray", diameter: 15, width: "7", holes: [8], price: 31200, img: "assets/images/mags/TSR/tsr100-28-tsr15-matte-gray.jpg" },
  { id: "mag-98", brand: "TSR", model: "TSR13", finish: "Matte Black", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-29-tsr13-matte-black.jpg" },
  { id: "mag-99", brand: "TSR", model: "TSR15", finish: "Matte Dark Gray", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-30-tsr15-matte-dark-gray.jpg" },
  { id: "mag-100", brand: "TSR", model: "TSR17", finish: "Dark Bronze", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-31-tsr17-dark-bronze.jpg" },
  { id: "mag-101", brand: "TSR", model: "TSR17", finish: "Dark Gray", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-32-tsr17-dark-gray.jpg" },
  { id: "mag-102", brand: "TSR", model: "TSR17", finish: "Gloss Gunmetal", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-33-tsr17-gloss-gunmetal.jpg" },
  { id: "mag-103", brand: "TSR", model: "TYPE C", finish: "Satin Black", diameter: 15, width: "7", holes: [4], price: 31200, img: "assets/images/mags/TSR/tsr100-34-typec-satin-black.jpg" },
  { id: "mag-104", brand: "TSR", model: "ADVAN", finish: "Hyper Black Lip Machined", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-01-advan-hyper-black.jpg" },
  { id: "mag-105", brand: "TSR", model: "CTWGT", finish: "Gunmetal Silver", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-02-ctwgt-gunmetal-silver.jpg" },
  { id: "mag-106", brand: "TSR", model: "CTWGT", finish: "Satin Black", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-03-ctwgt-satin-black.jpg" },
  { id: "mag-107", brand: "TSR", model: "FBX019 CE28", finish: "Bronze", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-04-fbx019-ce28-bronze.jpg" },
  { id: "mag-108", brand: "TSR", model: "FBX019 CE28", finish: "Gunmetal Black", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-05-fbx019-ce28-gunmetal-black.jpg" },
  { id: "mag-109", brand: "TSR", model: "FBX022 RPF1", finish: "Gunmetal Black", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-06-fbx022-rpf1-gunmetal-black.jpg" },
  { id: "mag-110", brand: "TSR", model: "FBX022 RPF1", finish: "Silver", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-07-fbx022-rpf1-silver.jpg" },
  { id: "mag-111", brand: "TSR", model: "TE37", finish: "Gunmetal Black", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-08-te37-gunmetal-black.jpg" },
  { id: "mag-112", brand: "TSR", model: "TSR15", finish: "Matte Gray", diameter: 15, width: "7", holes: [8], variant: "114.3 PCD", price: 31200, img: "assets/images/mags/TSR/tsr1143-09-tsr15-matte-gray.jpg" },
  { id: "mag-113", brand: "TSR", model: "CTWGT", finish: "Satin Black", diameter: 16, width: "7", holes: [8], variant: "100/114.3 PCD", price: 36400, img: "assets/images/mags/TSR/tsr16-01-ctwgt-satin-black.jpg" },
  { id: "mag-114", brand: "TSR", model: "TC105X", finish: "Gunmetal", diameter: 16, width: "7", holes: [4], price: 36400, img: "assets/images/mags/TSR/tsr16-02-tc105x-gunmetal.jpg" },
  { id: "mag-115", brand: "TSR", model: "CTWGT", finish: "Black", diameter: 16, width: "7", holes: [8], variant: "100/114.3 PCD", price: 36400, img: "assets/images/mags/TSR/tsr16-03-ctwgt-black.jpg" },
  { id: "mag-116", brand: "TSR", model: "T2FF", finish: "Gunmetal Black", diameter: 16, width: "7", holes: [6], variant: "130 PCD", price: 36400, img: "assets/images/mags/TSR/tsr16-04-t2ff-gunmetal-black-130pcd.jpg" },
  { id: "mag-117", brand: "TSR", model: "CTWGT", finish: "Hyper Black Lip Polish", diameter: 16, width: "7", holes: [8], variant: "100/114.3 PCD", price: 36400, img: "assets/images/mags/TSR/tsr16-05-ctwgt-hyper-black-lip.jpg" },
  { id: "mag-118", brand: "TSR", model: "TC105X", finish: "Gloss Gunmetal", diameter: 16, width: "7", holes: [4], price: 36400, img: "assets/images/mags/TSR/tsr16-06-tc105x-gloss-gunmetal.jpg" },
  { id: "mag-119", brand: "TSR", model: "T2FF", finish: "Gray", diameter: 16, width: "7", holes: [6], variant: "139.7 PCD", price: 36400, img: "assets/images/mags/TSR/tsr16-07-t2ff-gray-1397pcd.jpg" },

  // ── TSR 17" — 4x100 / SANFO & TSR09 (dual 8x100/114.3) ──────
  { id: "mag-120", brand: "TSR", model: "SANFO", finish: "Satin Dark Bronze", diameter: 17, width: "7.5", holes: [4], variant: "100 PCD, ET42", price: 44400, img: "assets/images/mags/TSR/tsr100-35-sanfo-satin-dark-bronze-17x7.5-4x100.jpg" },
  { id: "mag-121", brand: "TSR", model: "SANFO", finish: "Satin Dark Gunmetal", diameter: 17, width: "7.5", holes: [4], variant: "100 PCD, ET42", price: 44400, img: "assets/images/mags/TSR/tsr100-36-sanfo-satin-dark-gunmetal-17x7.5-4x100.jpg" },
  { id: "mag-122", brand: "TSR", model: "TSR09", finish: "Black Lip Polish", diameter: 17, width: "7.5", holes: [8], variant: "100/114.3 PCD, ET40", price: 44400, img: "assets/images/mags/TSR/tsr09-01-black-lip-polish-17x7.5-8x100-114.3.jpg" },
  { id: "mag-123", brand: "TSR", model: "TSR09", finish: "Hyper Silver", diameter: 17, width: "7.5", holes: [8], variant: "100/114.3 PCD, ET40", price: 44400, img: "assets/images/mags/TSR/tsr09-02-hyper-silver-17x7.5-8x100-114.3.jpg" },

  // ── TSR 17" — 5x114.3 / SANFO, OREGON & TSR09 ────────────────
  { id: "mag-124", brand: "TSR", model: "SANFO", finish: "Satin Black", diameter: 17, width: "7.5", holes: [5], variant: "114.3 PCD, ET38", price: 44400, img: "assets/images/mags/TSR/tsr1143-10-sanfo-satin-black-17x7.5-5x114.3.jpg" },
  { id: "mag-125", brand: "TSR", model: "SANFO", finish: "Satin Dark Bronze", diameter: 17, width: "7.5", holes: [5], variant: "114.3 PCD, ET38", price: 44400, img: "assets/images/mags/TSR/tsr1143-11-sanfo-satin-dark-bronze-17x7.5-5x114.3.jpg" },
  { id: "mag-126", brand: "TSR", model: "SANFO", finish: "Satin Dark Gunmetal", diameter: 17, width: "7.5", holes: [5], variant: "114.3 PCD, ET38", price: 44400, img: "assets/images/mags/TSR/tsr1143-12-sanfo-satin-dark-gunmetal-17x7.5-5x114.3.jpg" },
  { id: "mag-127", brand: "TSR", model: "OREGON", finish: "Black Machine Black Clear Coat", diameter: 17, width: "7.5", holes: [5], variant: "114.3 PCD, ET42", price: 44400, img: "assets/images/mags/TSR/tsr1143-13-oregon-black-machine-black-clear-17x7.5-5x114.3.jpg" },
  { id: "mag-128", brand: "TSR", model: "TSR09", finish: "Black Lip Polish", diameter: 17, width: "7.5", holes: [5], variant: "114.3 PCD, ET40", price: 44400, img: "assets/images/mags/TSR/tsr09-03-black-lip-polish-17x7.5-5x114.3.jpg" },
  { id: "mag-129", brand: "TSR", model: "TSR09", finish: "Hyper Silver", diameter: 17, width: "7.5", holes: [5], variant: "114.3 PCD, ET40", price: 44400, img: "assets/images/mags/TSR/tsr09-04-hyper-silver-17x7.5-5x114.3.jpg" },

  // ── TSR 17" — 6x139.7 / XY09 & XY66 (T2FF) ───────────────────
  { id: "mag-130", brand: "TSR", model: "XY09", finish: "Satin Dark Bronze", diameter: 17, width: "8.5", holes: [6], variant: "139.7 PCD, ET-10", price: 52800, img: "assets/images/mags/TSR/tsr1397-01-xy09-satin-dark-bronze-17x8.5-6x139.7.jpg" },
  { id: "mag-131", brand: "TSR", model: "XY09", finish: "Satin Dark Gunmetal", diameter: 17, width: "8.5", holes: [6], variant: "139.7 PCD, ET-10", price: 52800, img: "assets/images/mags/TSR/tsr1397-02-xy09-satin-dark-gunmetal-17x8.5-6x139.7.jpg" },
  { id: "mag-132", brand: "TSR", model: "XY66 (T2FF)", finish: "Black Milled", diameter: 17, width: "8.5", holes: [6], variant: "139.7 PCD, ET-10", price: 52800, img: "assets/images/mags/TSR/tsr1397-03-xy66-t2ff-black-milled-17x8.5-6x139.7.jpg" },
  { id: "mag-133", brand: "TSR", model: "XY66 (T2FF)", finish: "Dark Gunmetal", diameter: 17, width: "8.5", holes: [6], variant: "139.7 PCD, ET-10", price: 52800, img: "assets/images/mags/TSR/tsr1397-04-xy66-t2ff-dark-gunmetal-17x8.5-6x139.7.jpg" },

 // ── TSR 18" — 6x139.7 / DX541, FBX377 (57DRX) ───────────────
  { id: "mag-134", brand: "TSR", model: "DX541", finish: "Flat Black", diameter: 18, width: "9", holes: [6], variant: "139.7 PCD, ET0, CB108.1", price: 54800, img: "assets/images/mags/TSR/tsr139-7-05-dx541-flat-black-18x9-6x139.7.jpg" },
  { id: "mag-135", brand: "TSR", model: "DX541", finish: "Full Machine Face", diameter: 18, width: "9", holes: [6], variant: "139.7 PCD, ET0, CB108.1", price: 54800, img: "assets/images/mags/TSR/tsr139-7-06-dx541-full-machine-face-18x9-6x139.7.jpg" },
  { id: "mag-136", brand: "TSR", model: "FBX377 (57DRX)", finish: "Bronze Almite", diameter: 18, width: "9", holes: [6], variant: "139.7 PCD, ET0, CB106.1", price: 54800, img: "assets/images/mags/TSR/tsr139-7-07-fbx377-57drx-bronze-almite-18x9-6x139.7.jpg" },
 
  // ── TSR 18" — 5x114.3 / TS07 ─────────────────────────────────
  { id: "mag-137", brand: "TSR", model: "TS07", finish: "Gloss Black Milled Polish Lip", diameter: 18, width: "8.5", holes: [5], variant: "114.3 PCD, ET35, CB73.1", price: 54800, img: "assets/images/mags/TSR/tsr1143-14-ts07-gloss-black-milled-polish-lip-18x8.5-5x114.3.jpg" },
  { id: "mag-138", brand: "TSR", model: "TS07", finish: "Gloss Black Rainbow Coat", diameter: 18, width: "8.5", holes: [5], variant: "114.3 PCD, ET35, CB73.1", price: 54800, img: "assets/images/mags/TSR/tsr1143-15-ts07-gloss-black-rainbow-coat-18x8.5-5x114.3.jpg" },
 
  // ── TSR 18" — 6x139.7 / S1FF ─────────────────────────────────
  { id: "mag-139", brand: "TSR", model: "S1FF", finish: "Bronze", diameter: 18, width: "9", holes: [6], variant: "139.7 PCD, ET0, CB112", price: 54800, img: "assets/images/mags/TSR/tsr139-7-08-s1ff-bronze-18x9-6x139.7.jpg" },
  { id: "mag-140", brand: "TSR", model: "S1FF", finish: "Satin Black", diameter: 18, width: "9", holes: [6], variant: "139.7 PCD, ET0, CB112", price: 54800, img: "assets/images/mags/TSR/tsr139-7-09-s1ff-satin-black-18x9-6x139.7.jpg" },
  { id: "mag-141", brand: "TSR", model: "S1FF", finish: "Satin Silver", diameter: 18, width: "9", holes: [6], variant: "139.7 PCD, ET0, CB112", price: 54800, img: "assets/images/mags/TSR/tsr139-7-10-s1ff-satin-silver-18x9-6x139.7.jpg" },
 
  // ── TSR 18" — 6x139.7 / T1FF ─────────────────────────────────
  { id: "mag-142", brand: "TSR", model: "T1FF", finish: "Gloss Black Machine Lip", diameter: 18, width: "8.5", holes: [6], variant: "139.7 PCD, ET25, CB106.1", price: 54800, img: "assets/images/mags/TSR/tsr139-7-11-t1ff-gloss-black-machine-lip-18x8.5-6x139.7.jpg" },
  { id: "mag-143", brand: "TSR", model: "T1FF", finish: "Gloss Black Rainbow Coat", diameter: 18, width: "8.5", holes: [6], variant: "139.7 PCD, ET25, CB106.1", price: 54800, img: "assets/images/mags/TSR/tsr139-7-12-t1ff-gloss-black-rainbow-coat-18x8.5-6x139.7.jpg" },
 
  // ── TSR 18" — 6x139.7 / TSR18 ─────────────────────────────────
  { id: "mag-144", brand: "TSR", model: "TSR18", finish: "Black Lip Polish", diameter: 18, width: "9", holes: [6], variant: "139.7 PCD, ET0, CB106.1", price: 54800, img: "assets/images/mags/TSR/tsr139-7-13-tsr18-black-lip-polish-18x9-6x139.7.jpg" },
  { id: "mag-145", brand: "TSR", model: "TSR18", finish: "Hyper Silver", diameter: 18, width: "9", holes: [6], variant: "139.7 PCD, ET0, CB106.1", price: 54800, img: "assets/images/mags/TSR/tsr139-7-14-tsr18-hyper-silver-18x9-6x139.7.jpg" },
  // ── ION ───────────────────────────────────────────
  { id: "mag-21", brand: "Ion", model: "Ion 146", finish: "Machine Cast Clear Coat", diameter: 17, width: "9", holes: [5, 6], price: 83200, img: "assets/images/mags/TWG/twg_00.jpg", variant: "Beadlock", listedUnder: "TWG Wheels" },
  { id: "mag-24", brand: "Ion", model: "Ion 146", finish: "Machine Cast Clear Coat", diameter: 20, width: "10", holes: [6], price: 126000, img: "assets/images/mags/TWG/twg_00.jpg", variant: "Cali Offroad", listedUnder: "TWG Wheels" },
  { id: "mag-26", brand: "Ion", model: "Ion 146", finish: "Machine Cast Clear Coat", diameter: 20, width: "12", holes: [6], price: 77200, img: "assets/images/mags/TWG/twg_00.jpg", listedUnder: "TWG Wheels" },

  // ── TWG WHEELS ────────────────────────────────────
  { id: "mag-19", brand: "TWG Wheels", model: "8303", finish: "Matte Black", diameter: 17, width: "8 / 8.5 / 9", holes: [6], price: 52800, img: "assets/images/mags/TWG/twg_02.jpg" },
  { id: "mag-20", brand: "TWG Wheels", model: "8303", finish: "Matte Black", diameter: 17, width: "9", holes: [5, 6], price: 75600, img: "assets/images/mags/TWG/twg_02.jpg", variant: "Simulated Beadlock" },
  { id: "mag-22", brand: "TWG Wheels", model: "TR93", finish: "Hyper Silver Black Ring", diameter: 18, width: "8 / 8.5 / 9", holes: [5, 6], price: 54800, img: "assets/images/mags/TWG/twg_01.jpg" },
  { id: "mag-23", brand: "TWG Wheels", model: "8303", finish: "Matte Black", diameter: 20, width: "8.5 / 9 / 9.5", holes: [5, 6], price: 65200, img: "assets/images/mags/TWG/twg_02.jpg" },
  { id: "mag-25", brand: "TWG Wheels", model: "8303", finish: "Matte Black", diameter: 20, width: "12", holes: [6], price: 131600, img: "assets/images/mags/TWG/twg_02.jpg", variant: "Cali Offroad Purge" },
  { id: "mag-27", brand: "TWG Wheels", model: "8303", finish: "Matte Black", diameter: 22, width: "12", holes: [6], price: 157600, img: "assets/images/mags/TWG/twg_02.jpg", variant: "Cali Offroad" },

  // ── REP WHEELS ────────────────────────────────────
  { id: "mag-57", brand: "Rep Wheels", model: "509", finish: "Gloss Gunmetal", diameter: 18, width: "8", holes: [5], price: null, img: "assets/images/mags/RepWheels/repwheels_00.jpg" },
  { id: "mag-58", brand: "Rep Wheels", model: "SR97", finish: "Satin Black", diameter: 18, width: "8.5", holes: [5], price: null, img: "assets/images/mags/RepWheels/repwheels_01.jpg" },
  { id: "mag-59", brand: "Rep Wheels", model: "TE37SL Sonic (CTW-TE37)", finish: "Gloss Gunmetal", diameter: 15, width: "6.5", holes: [8], price: null, img: "assets/images/mags/RepWheels/repwheels_02.jpg" },
  { id: "mag-60", brand: "Rep Wheels", model: "SR17", finish: "Standard", diameter: 15, width: null, holes: [5], price: null, img: "assets/images/mags/RepWheels/repwheels_03.jpg" },
  { id: "mag-61", brand: "Rep Wheels", model: "SR99", finish: "Hyper Silver", diameter: 20, width: null, holes: [5], price: null, img: "assets/images/mags/RepWheels/repwheels_04.jpg" },
  { id: "mag-62", brand: "Rep Wheels", model: "TE37XT", finish: "Flat Bronze", diameter: 17, width: "8.5", holes: [6], price: 52800, img: "assets/images/mags/RepWheels/repwheels_05.jpg" },
  { id: "mag-63", brand: "Rep Wheels", model: "SR118", finish: "Hyper Silver", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/RepWheels/repwheels_06.jpg" },
  { id: "mag-64", brand: "Rep Wheels", model: "TE37P2", finish: "Gloss Black", diameter: 18, width: "9", holes: [6], price: 54800, img: "assets/images/mags/RepWheels/repwheels_07.jpg" },
  { id: "mag-65", brand: "Rep Wheels", model: "ZE40X", finish: "Bronze Black", diameter: 18, width: "9", holes: [6], price: null, img: "assets/images/mags/RepWheels/repwheels_08.jpg" },
  { id: "mag-66", brand: "Rep Wheels", model: "GR", finish: "Gunmetal Machine Face", diameter: 18, width: "9", holes: [6], price: null, img: "assets/images/mags/RepWheels/repwheels_09.jpg" },
  { id: "mag-67", brand: "Rep Wheels", model: "FBX377", finish: "Matte Black", diameter: 18, width: "9", holes: [6], price: null, img: "assets/images/mags/RepWheels/repwheels_10.jpg" },
  { id: "mag-68", brand: "Rep Wheels", model: "TE37P2", finish: "Dark Bronze", diameter: 18, width: "9", holes: [6], price: 52000, img: "assets/images/mags/RepWheels/repwheels_11.jpg" },
  { id: "mag-69", brand: "Rep Wheels", model: "TE37XT", finish: "Dark Bronze", diameter: 18, width: "9", holes: [6], price: 52000, img: "assets/images/mags/RepWheels/repwheels_12.jpg" },

  // ── AD ────────────────────────────────────────────
  { id: "mag-34", brand: "AD", model: "D2853", finish: "Black Polish", diameter: 17, width: "7.5", holes: [5], price: 35500, img: "assets/images/mags/OnSale/onsale_02.jpg", listedUnder: "On Sale" },
  { id: "mag-35", brand: "AD", model: "D2853", finish: "Black Polish", diameter: 17, width: "9", holes: [6], price: 50000, img: "assets/images/mags/OnSale/onsale_02.jpg", listedUnder: "On Sale" },
  { id: "mag-36", brand: "AD", model: "D2853", finish: "Black Polish", diameter: 18, width: "9", holes: [6], price: 52000, img: "assets/images/mags/OnSale/onsale_02.jpg", listedUnder: "On Sale" },
    { id: "mag-165", brand: "AD", model: "3154",    finish: "Black Polish", diameter: 17, width: "8",   holes: [4], price: 40000, img: "assets/images/mags/AD/ad_01.jpg", listedUnder: "AD" },
  { id: "mag-166", brand: "AD", model: "3154",    finish: "Black Polish", diameter: 17, width: "7.5", holes: [5], price: 35500, img: "assets/images/mags/AD/ad_02.jpg", listedUnder: "AD" },
  { id: "mag-167", brand: "AD", model: "3378",    finish: "Black",        diameter: 17, width: "9",   holes: [6], price: 50000, img: "assets/images/mags/AD/ad_03.jpg", listedUnder: "AD" },
  { id: "mag-168", brand: "AD", model: "3378",    finish: "Black",        diameter: 17, width: "9",   holes: [6], price: 50000, img: "assets/images/mags/AD/ad_04.jpg", listedUnder: "AD" },
  { id: "mag-169", brand: "AD", model: "3378",    finish: "Black Polish", diameter: 17, width: "9",   holes: [6], price: 50000, img: "assets/images/mags/AD/ad_05.jpg", listedUnder: "AD" },
  { id: "mag-170", brand: "AD", model: "8510",    finish: "Black",        diameter: 17, width: "9",   holes: [6], price: 50000, img: "assets/images/mags/AD/ad_06.jpg", listedUnder: "AD" },
  { id: "mag-171", brand: "AD", model: "ADF2",    finish: "Black Polish", diameter: 17, width: "7.5", holes: [5], price: 35500, img: "assets/images/mags/AD/ad_07.jpg", listedUnder: "AD" },
  { id: "mag-172", brand: "AD", model: "D2827",   finish: "Black",        diameter: 17, width: "9",   holes: [6], price: 50000, img: "assets/images/mags/AD/ad_08.jpg", listedUnder: "AD" },
  { id: "mag-173", brand: "AD", model: "D2827",   finish: "Black",        diameter: 17, width: "9",   holes: [6], price: 50000, img: "assets/images/mags/AD/ad_09.jpg", listedUnder: "AD" },
  { id: "mag-174", brand: "AD", model: "D2853",   finish: "Black Polish", diameter: 17, width: "7.5", holes: [5], price: 35500, img: "assets/images/mags/AD/ad_10.jpg", listedUnder: "AD" },
  { id: "mag-175", brand: "AD", model: "D2853",   finish: "Black Polish", diameter: 17, width: "9",   holes: [8], price: 50000, img: "assets/images/mags/AD/ad_11.jpg", listedUnder: "AD" },
  { id: "mag-176", brand: "AD", model: "ADF5651", finish: "Black Polish", diameter: 18, width: "9",   holes: [5], price: 52000, img: "assets/images/mags/AD/ad_12.jpg", listedUnder: "AD" },
  { id: "mag-177", brand: "AD", model: "D2843",   finish: "Black Polish", diameter: 18, width: "9",   holes: [6], price: 52000, img: "assets/images/mags/AD/ad_13.jpg", listedUnder: "AD" },
 
  // ── RAFFA ─────────────────────────────────────────
  { id: "mag-37", brand: "Raffa", model: "RS02", finish: "Hyper Silver", diameter: 18, width: "8.5", holes: [10], price: null, img: "assets/images/mags/OnSale/onsale_00.jpg", listedUnder: "On Sale" },
  { id: "mag-38", brand: "Raffa", model: "RS02", finish: "Matte Gray", diameter: 18, width: "8.5", holes: [10], price: null, img: "assets/images/mags/OnSale/onsale_01.jpg", listedUnder: "On Sale" },
  { id: "mag-41", brand: "Raffa", model: "RS01", finish: "Hyper Silver", diameter: 20, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_05.jpg", listedUnder: "On Sale" },
  { id: "mag-178", brand: "Raffa", model: "RS03", finish: "Black Bronze",  diameter: 17, width: "7.5", holes: [4],  price: 35500, img: "assets/images/mags/Raffa/raffa_01.jpg", listedUnder: "Raffa" },
  { id: "mag-179", brand: "Raffa", model: "RS02", finish: "Hyper Silver",  diameter: 18, width: "8.5", holes: [10], price: 43500, img: "assets/images/mags/Raffa/raffa_02.jpg", listedUnder: "Raffa" },
  { id: "mag-180", brand: "Raffa", model: "RS02", finish: "Matte Gray",    diameter: 18, width: "8.5", holes: [10], price: 43500, img: "assets/images/mags/Raffa/raffa_03.jpg", listedUnder: "Raffa" },
  { id: "mag-181", brand: "Raffa", model: "RS01", finish: "Hyper Silver",  diameter: 20, width: "9",   holes: [5],  price: 62000, img: "assets/images/mags/Raffa/raffa_04.jpg", listedUnder: "Raffa" },
 
  // ── KALON ─────────────────────────────────────────
  { id: "mag-42", brand: "Kalon", model: "PD9", finish: "Dark Gunmetal", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/Kalon/kalon_00.jpg", listedUnder: "On Sale" },
  { id: "mag-42",  brand: "Kalon", model: "TK3", finish: "Dark Gunmetal",             diameter: 17, width: "7", holes: [4], price: null, img: "assets/images/mags/Kalon/kalon_07.jpg", listedUnder: "Kalon" },
 
  { id: "mag-182", brand: "Kalon", model: "102", finish: "Gloss Black",               diameter: 17, width: "8", holes: [5], price: null, img: "assets/images/mags/Kalon/kalon_01.jpg", listedUnder: "Kalon" },
  { id: "mag-183", brand: "Kalon", model: "102", finish: "Gloss Gunmetal",            diameter: 17, width: "8", holes: [5], price: null, img: "assets/images/mags/Kalon/kalon_02.jpg", listedUnder: "Kalon" },
  { id: "mag-184", brand: "Kalon", model: "102", finish: "Black Machine Face",        diameter: 17, width: "8", holes: [5], price: null, img: "assets/images/mags/Kalon/kalon_03.jpg", listedUnder: "Kalon" },
  { id: "mag-185", brand: "Kalon", model: "103", finish: "Gloss Gunmetal",            diameter: 17, width: "8", holes: [5], price: null, img: "assets/images/mags/Kalon/kalon_04.jpg", listedUnder: "Kalon" },
  { id: "mag-186", brand: "Kalon", model: "103", finish: "Gunmetal Black Machine Face", diameter: 17, width: "8", holes: [5], price: null, img: "assets/images/mags/Kalon/kalon_05.jpg", listedUnder: "Kalon" },
  { id: "mag-187", brand: "Kalon", model: "TK3", finish: "Satin Black Machine Lip",   diameter: 17, width: "7", holes: [4], price: null, img: "assets/images/mags/Kalon/kalon_06.jpg", listedUnder: "Kalon" },
  { id: "mag-188", brand: "Kalon", model: "102", finish: "Black Machine Face",        diameter: 18, width: "8", holes: [5], price: null, img: "assets/images/mags/Kalon/kalon_08.jpg", listedUnder: "Kalon" },
  { id: "mag-189", brand: "Kalon", model: "102", finish: "Gloss Black",               diameter: 18, width: "8", holes: [5], price: null, img: "assets/images/mags/Kalon/kalon_09.jpg", listedUnder: "Kalon" },
 
  // ── VORTEK ────────────────────────────────────────
  { id: "mag-43", brand: "Vortek", model: "VRT601", finish: "Matte Black", diameter: 17, width: null, holes: [6], price: null, img: "assets/images/mags/Vortek/vortek_00.jpg", listedUnder: "On Sale" },
  { id: "mag-43",  brand: "Vortek", model: "VRT601", finish: "Matt Black",                    diameter: 17, width: "9", holes: [6], price: 50000, img: "assets/images/mags/Vortek/vortek_01.jpg", listedUnder: "Vortek" },
  { id: "mag-190", brand: "Vortek", model: "VRT601", finish: "Matt Bronze Black Bead Ring",   diameter: 17, width: "9", holes: [6], price: 50000, img: "assets/images/mags/Vortek/vortek_02.jpg", listedUnder: "Vortek" },
  { id: "mag-191", brand: "Vortek", model: "VRT608", finish: "Matt Black",                    diameter: 17, width: "9", holes: [6], price: 50000, img: "assets/images/mags/Vortek/vortek_03.jpg", listedUnder: "Vortek" },
  { id: "mag-192", brand: "Vortek", model: "VRT606", finish: "Matt Titanium Black Bead Ring", diameter: 18, width: "9", holes: [6], price: 56000, img: "assets/images/mags/Vortek/vortek_04.jpg", listedUnder: "Vortek" },
  { id: "mag-193", brand: "Vortek", model: "VRT606", finish: "Matt Black",                    diameter: 18, width: "9", holes: [6], price: 56000, img: "assets/images/mags/Vortek/vortek_05.jpg", listedUnder: "Vortek" },
  { id: "mag-194", brand: "Vortek", model: "VRT606", finish: "Matt Bronze Black Bead Ring",   diameter: 18, width: "9", holes: [6], price: 56000, img: "assets/images/mags/Vortek/vortek_06.jpg", listedUnder: "Vortek" },
  { id: "mag-195", brand: "Vortek", model: "VRT603", finish: "Matt Titanium Black",           diameter: 18, width: "9", holes: [6], price: 56000, img: "assets/images/mags/Vortek/vortek_07.jpg", listedUnder: "Vortek" },
  { id: "mag-196", brand: "Vortek", model: "VRT601", finish: "Matt Titanium Black",           diameter: 20, width: "9", holes: [6], price: 62000, img: "assets/images/mags/Vortek/vortek_08.jpg", listedUnder: "Vortek" },
  { id: "mag-197", brand: "Vortek", model: "VRT602", finish: "Matt Titanium Black",           diameter: 20, width: "9", holes: [6], price: 62000, img: "assets/images/mags/Vortek/vortek_09.jpg", listedUnder: "Vortek" },
  { id: "mag-198", brand: "Vortek", model: "VRP503", finish: "Silver Full Machine",           diameter: 20, width: "9", holes: [6], price: 62000, img: "assets/images/mags/Vortek/vortek_10.jpg", listedUnder: "Vortek" },
  
  // ── ON SALE ───────────────────────────────────────
  { id: "mag-39", brand: "On Sale", model: "SR25", finish: "Satin Gunmetal Machine Lip", diameter: 15, width: "7", holes: [8], price: null, img: "assets/images/mags/OnSale/onsale_03.jpg" },
  { id: "mag-40", brand: "On Sale", model: "SRFF03", finish: "Bronze", diameter: 18, width: "8", holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_04.jpg" },
  { id: "mag-44", brand: "On Sale", model: "1176", finish: "Black Polish", diameter: 18, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_06.jpg" },
  { id: "mag-45", brand: "On Sale", model: "3154", finish: "Black Polish", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/OnSale/onsale_07.jpg" },
  { id: "mag-46", brand: "On Sale", model: "3S1101", finish: "Matte Black", diameter: 18, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_08.jpg" },
  { id: "mag-47", brand: "On Sale", model: "5317", finish: "Standard", diameter: 15, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_09.jpg" },
  { id: "mag-48", brand: "On Sale", model: "5479", finish: "Satin Dark Bronze", diameter: 15, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_10.jpg" },
  { id: "mag-49", brand: "On Sale", model: "D2843", finish: "Black Polish", diameter: 18, width: null, holes: [6], price: null, img: "assets/images/mags/OnSale/onsale_11.jpg" },
  { id: "mag-50", brand: "On Sale", model: "D2862", finish: "Black Polish", diameter: 18, width: null, holes: [6], price: null, img: "assets/images/mags/OnSale/onsale_12.jpg" },
  { id: "mag-51", brand: "On Sale", model: "D6075", finish: "Black Machine Silver", diameter: 18, width: null, holes: [6], price: null, img: "assets/images/mags/OnSale/onsale_13.jpg" },
  { id: "mag-52", brand: "On Sale", model: "F20L04F", finish: "Gloss Lip Polish", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/OnSale/onsale_14.jpg" },
  { id: "mag-53", brand: "On Sale", model: "F20N203", finish: "Silver", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/OnSale/onsale_15.jpg" },
  { id: "mag-54", brand: "On Sale", model: "JT5317", finish: "Black Polish", diameter: 15, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_16.jpg" },
  { id: "mag-55", brand: "On Sale", model: "RS03", finish: "Hyper Silver", diameter: 18, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_17.jpg" },
  { id: "mag-56", brand: "On Sale", model: "XH152", finish: "Standard", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/OnSale/onsale_18.jpg" },
  { id: "mag-39", brand: "On Sale", model: "SR25", finish: "Satin Gunmetal Machine Lip", diameter: 15, width: "7", holes: [8], price: null, img: "assets/images/mags/OnSale/onsale_03.jpg", listedUnder: "On Sale" },
  { id: "mag-40", brand: "On Sale", model: "SRFF03", finish: "Bronze", diameter: 18, width: "8", holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_04.jpg", listedUnder: "On Sale" },
  { id: "mag-44", brand: "On Sale", model: "1176", finish: "Black Polish", diameter: 18, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_06.jpg", listedUnder: "On Sale" },
  { id: "mag-45", brand: "On Sale", model: "3154", finish: "Black Polish", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/OnSale/onsale_07.jpg", listedUnder: "On Sale" },
  { id: "mag-46", brand: "On Sale", model: "3S1101", finish: "Matte Black", diameter: 18, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_08.jpg", listedUnder: "On Sale" },
  { id: "mag-47", brand: "On Sale", model: "5317", finish: "Standard", diameter: 15, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_09.jpg", listedUnder: "On Sale" },
  { id: "mag-48", brand: "On Sale", model: "5479", finish: "Satin Dark Bronze", diameter: 15, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_10.jpg", listedUnder: "On Sale" },
  { id: "mag-49", brand: "On Sale", model: "D2843", finish: "Black Polish", diameter: 18, width: null, holes: [6], price: null, img: "assets/images/mags/OnSale/onsale_11.jpg", listedUnder: "On Sale" },
  { id: "mag-50", brand: "On Sale", model: "D2862", finish: "Black Polish", diameter: 18, width: null, holes: [6], price: null, img: "assets/images/mags/OnSale/onsale_12.jpg", listedUnder: "On Sale" },
  { id: "mag-51", brand: "On Sale", model: "D6075", finish: "Black Machine Silver", diameter: 18, width: null, holes: [6], price: null, img: "assets/images/mags/OnSale/onsale_13.jpg", listedUnder: "On Sale" },
  { id: "mag-52", brand: "On Sale", model: "F20L04F", finish: "Gloss Lip Polish", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/OnSale/onsale_14.jpg", listedUnder: "On Sale" },
  { id: "mag-53", brand: "On Sale", model: "F20N203", finish: "Silver", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/OnSale/onsale_15.jpg", listedUnder: "On Sale" },
  { id: "mag-54", brand: "On Sale", model: "JT5317", finish: "Black Polish", diameter: 15, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_16.jpg", listedUnder: "On Sale" },
  { id: "mag-55", brand: "On Sale", model: "RS03", finish: "Hyper Silver", diameter: 18, width: null, holes: [5], price: null, img: "assets/images/mags/OnSale/onsale_17.jpg", listedUnder: "On Sale" },
  { id: "mag-56", brand: "On Sale", model: "XH152", finish: "Standard", diameter: 17, width: null, holes: [4], price: null, img: "assets/images/mags/OnSale/onsale_18.jpg", listedUnder: "On Sale" },
 
];

// ---- Derived lists used by the filter dropdowns (don't edit) ----
const MAG_BRANDS    = [...new Set(MAG_ROWS.map(r => r.brand))].sort();
const MAG_DIAMETERS = [...new Set(MAG_ROWS.map(r => r.diameter))].sort((a, b) => a - b);
const MAG_HOLES     = [...new Set(MAG_ROWS.flatMap(r => r.holes))].sort((a, b) => a - b);

// A wheel's display size: "17x8.5" when the width is known, otherwise just 17".
function magSizeLabel(r) {
  return r.width ? `${r.diameter}x${r.width}` : `${r.diameter}"`;
}
