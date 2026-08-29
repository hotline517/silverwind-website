/* inquiry.js
   Builds the prefilled enquiry message and hands it to the
   configured channel (messenger / whatsapp / form).
*/

/* ============================================================
   inquiry  →  inquiry.js
   ============================================================ */
function buildInquiry(p, target, vehicleLabel) {
  const forCar = vehicleLabel ? ` for my ${vehicleLabel}` : "";
  return `Hi, I'm interested in ${tireMath.format(target)} ${p.model}${forCar}. Quantity: 4. Is it available?`;
}
function sendInquiry(p, target, vehicleLabel) {
  const msg = buildInquiry(p, target, vehicleLabel);
  analytics.track("inquiry_clicked", { product:p.id, size:tireMath.format(target) });
  if (inquiryConfig.channel === "whatsapp") {
    window.open(`${inquiryConfig.endpoints.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(msg); alert("Message copied — paste it to us:\n\n" + msg);
  } else { alert(msg); }
}
