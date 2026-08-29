import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';

// v1: a scoped, rule-based responder — no AI provider wired up yet, so
// there is nothing here that could invent a brand/price/stock figure.
// No conversation is persisted (no accounts, no DB writes) — the caller
// keeps history client-side for the current browser session only.
// Swap-in point for a real provider later: replace buildReply() with a
// call out, reading the API key from an env var here (server-side only,
// never in frontend JS).
export const chatRouter = Router();

// 20/min was too tight: a customer working through a few questions (or a
// shared office/NAT IP) hit it mid-conversation, and express-rate-limit's
// DEFAULT 429 body is PLAIN TEXT — the widget's res.json() then threw and
// showed a generic "trouble connecting" error, which read as the chatbot
// crashing. Raised, and the 429 now returns JSON in the same
// { error } shape as every other response so the widget can display it.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({ error: "You're sending messages a bit quickly — please wait a moment and try again." })
});

const messageSchema = z.object({
  message: z.string().trim().min(1, 'Message is required.').max(500, 'Message is too long.')
});

const RULES = [
  { test: /\b(hi|hello|hey)\b/i,
    reply: "Hi! How can I help you find the right tires or wheels?" },
  { test: /\b(dealer|reseller|become a dealer)\b/i,
    reply: "Interested in becoming a dealer? You can apply directly here: dealer-application/index.html — it takes about 10 minutes." },
  { test: /\b(price|stock|available|availability)\b/i,
    reply: "I can't check live pricing or stock yet — that's coming in a future update. For now, please check the Tires or Mags pages, or reach out to our team directly." },
  { test: /\b(tire|tires|tyre)\b/i,
    reply: "For tires, you can browse our full range on the Tires page, or use the Tire Size Calculator to compare a size against your current one. If you know the size you're after (e.g. 265/65R17), tell me and I'll note it down for our team." },
  { test: /\b(mag|mags|wheel|wheels|rim|rims)\b/i,
    reply: "For mags and wheels, check out the Mags page. If you know the size you need (e.g. 17x8, 5-lug), let me know and I'll pass it along to our team." },
  { test: /\b(4x4|4wd|off.?road)\b/i,
    reply: "We carry a range of 4x4 parts and accessories — take a look at the 4x4 page. Let me know what you're working on and I can point you in the right direction." },
  { test: /\b(thanks|thank you|salamat)\b/i,
    reply: "You're welcome! Let me know if there's anything else I can help with." }
];

// --- Size recognition -------------------------------------------------
// A bare "265/65R17" or "17x8" matched none of the RULES above and fell
// through to the generic fallback, which reads as the bot ignoring the
// question. These patterns let it acknowledge the size it was given.
//
// STILL v1: there is no inventory connection here. These replies echo the
// size back and route the customer — they never state stock, price, or
// availability, because this file has no access to that data.
const SIZE_PATTERNS = [
  // 265/65R17 · 265-65-17 · 265 65 17
  { kind: 'tire', re: /\b(\d{3})\s*[\/\-\s]\s*(\d{2})\s*[\/\-\s]?\s*r?\s*(\d{2})\b/i,
    fmt: m => `${m[1]}/${m[2]}R${m[3]}` },
  // 17x8 · 20x9.5
  { kind: 'wheel', re: /\b(\d{2})\s*[x×]\s*(\d{1,2}(?:\.\d)?)\b/i,
    fmt: m => `${m[1]}x${m[2]}` },
  // 265/65 (width + aspect, no rim yet)
  { kind: 'tire-partial', re: /\b(\d{3})\s*[\/\-]\s*(\d{2})\b/,
    fmt: m => `${m[1]}/${m[2]}` },
  // 15 inch · 15" · 17in
  { kind: 'rim', re: /\b(1[2-9]|2[0-6])\s*(?:inch|in\b|")/i,
    fmt: m => `${m[1]}"` },
  // bare "265" — in range for a tire section width
  { kind: 'tire-width', re: /^\s*(\d{3})\s*$/,
    fmt: m => m[1] },
  // bare "15" / "17" — in range for a rim diameter
  { kind: 'rim', re: /^\s*(1[2-9]|2[0-6])\s*$/,
    fmt: m => `${m[1]}"` },
  // rim number alongside a wheel/tire word: "15 mags", "17 rims".
  // The keyword requirement keeps stray numbers ("20 pieces") out.
  { kind: 'rim', re: /\b(1[2-9]|2[0-6])\b(?=[\s\S]{0,20}\b(?:mag|mags|wheel|wheels|rim|rims|tire|tires|tyre)\b)/i,
    fmt: m => `${m[1]}"` },
  // width inside a sentence: "Do you have 265?" — guarded to the
  // plausible section-width range so ordinary numbers don't trigger it.
  { kind: 'tire-width', re: /\b(\d{3})\b/,
    guard: m => Number(m[1]) >= 155 && Number(m[1]) <= 395,
    fmt: m => m[1] }
];

const SIZE_REPLIES = {
  tire: s => `Got it — ${s}. I can't check live stock or pricing yet, but you can browse our full range on the Tires page, and the Tire Size Calculator will compare ${s} against your current size. For availability and a quote, message our team and mention ${s}.`,
  'tire-partial': s => `Got it — ${s}. What rim size are you running (e.g. ${s}R17)? In the meantime the Tires page lists our full range, and the Tire Size Calculator can compare sizes for you.`,
  'tire-width': s => `Got it — a ${s} width. What aspect ratio and rim size do you need (e.g. ${s}/65R17)? You can also browse everything we carry on the Tires page.`,
  wheel: s => `Got it — ${s}. I can't check live stock or pricing yet, but our full mag and wheel range is on the Mags page. For availability and a quote — and to confirm the bolt pattern that fits your vehicle — message our team and mention ${s}.`,
  rim: s => `Got it — ${s}. You'll find our ${s} mags on the Mags page, and ${s} tires on the Tires page. Let me know whether you're after wheels or tires and I can point you to the right one.`
};

function matchSize(message) {
  for (const p of SIZE_PATTERNS) {
    const m = message.match(p.re);
    if (m && (!p.guard || p.guard(m))) return SIZE_REPLIES[p.kind](p.fmt(m));
  }
  return null;
}

function buildReply(message) {
  // Size first: "How much is 265/65R17?" is better served by naming the
  // size than by the generic price rule.
  const size = matchSize(message);
  if (size) return size;

  const hit = RULES.find(r => r.test.test(message));
  if (hit) return hit.reply;
  return "Got it, thanks! A member of our team can help with the specifics — in the meantime, feel free to browse Tires, Mags, or 4x4, or use the Tire Size Calculator.";
}

chatRouter.post('/message', chatLimiter, asyncHandler(async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const reply = buildReply(parsed.data.message);
  res.json({ reply });
}));
