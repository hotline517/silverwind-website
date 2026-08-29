/* vehicleService.js
   Data layer for vehicles and their OEM tire sizes.
*/

/* ============================================================
   vehicleService  →  vehicleService.js
   ============================================================ */
const demoVehicles = [
  { year:2024, make:"Toyota", model:"Fortuner", trim:"G 4x2",   oem:{width:265,aspect:65,rim:17} },
  { year:2024, make:"Toyota", model:"Fortuner", trim:"LTD 4x4", oem:{width:265,aspect:60,rim:18} },
  { year:2024, make:"Toyota", model:"Vios",     trim:"XLE",     oem:{width:185,aspect:60,rim:15} },
  { year:2023, make:"Mitsubishi", model:"Montero Sport", trim:"GT", oem:{width:265,aspect:60,rim:18} },
  { year:2023, make:"Ford",   model:"Ranger",   trim:"Wildtrak",oem:{width:265,aspect:65,rim:17} },
  { year:2022, make:"Honda",  model:"Civic",    trim:"RS",      oem:{width:235,aspect:40,rim:18} },
  { year:2022, make:"Honda",  model:"Civic",    trim:"S",       oem:{width:215,aspect:55,rim:16} }
];
const vehicleService = {
  async load(){ return demoVehicles; },
  years:  v => [...new Set(v.map(x=>x.year))].sort((a,b)=>b-a),
  makes:  (v,y) => [...new Set(v.filter(x=>x.year==y).map(x=>x.make))].sort(),
  models: (v,y,mk) => [...new Set(v.filter(x=>x.year==y&&x.make==mk).map(x=>x.model))].sort(),
  trims:  (v,y,mk,md) => v.filter(x=>x.year==y&&x.make==mk&&x.model==md)
};
