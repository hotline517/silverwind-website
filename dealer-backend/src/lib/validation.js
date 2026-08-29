import { z } from 'zod';

// Every field the client sends is re-validated here — the client's own
// validation is a UX convenience, never the source of truth.

const req = (msg) => z.string().trim().min(1, msg);
const opt = z.string().trim().optional().or(z.literal(''));

export const businessInfoSchema = z.object({
  business_name: req('Business name is required.'),
  business_type: opt,
  contact_person: req('Contact person is required.'),
  contact_position: opt,
  business_address: req('Business address is required.'),
  city: req('City is required.'),
  province: req('Province is required.'),
  postal_code: opt,
  contact_number: req('Contact number is required.')
    .refine(v => /^(?:\+63|0)9\d{9}$/.test(v.replace(/[\s-]/g, '')), 'Enter a valid PH mobile number.'),
  email: req('Email is required.').refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address.'),
  website: opt,
  facebook_page: opt,
  years_in_business: opt
});

export const propertyInfoSchema = z.object({
  store_address: opt,
  property_status: z.enum(['OWNED', 'RENTED']).optional(),
  store_size: opt,
  operation_info: opt,
  location_notes: opt
});

export const referenceSchema = z.object({
  reference_name: req('Reference name is required.'),
  company: opt,
  contact_number: opt,
  email: z.string().email().optional().or(z.literal('')),
  relationship: opt,
  years_known: opt,
  notes: opt
});

export const referencesSchema = z.array(referenceSchema)
  .min(1, 'At least one reference is required.')
  .max(5, 'At most 5 references.');

export const submitSchema = z.object({
  business: businessInfoSchema,
  property: propertyInfoSchema,
  references: referencesSchema,
  declaration_accepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the declaration to submit.' })
  })
});

export const ALLOWED_DOCUMENT_TYPES = ['BUSINESS_PERMIT', 'VALID_ID', 'STORE_PHOTO', 'OTHER'];

// Magic-byte signatures — the client's declared mimetype/extension is never
// trusted alone; the first bytes of the actual file must match.
const SIGNATURES = [
  { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] },        // %PDF
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] }
];

export function sniffMimeType(buffer) {
  for (const sig of SIGNATURES) {
    if (sig.bytes.every((b, i) => buffer[i] === b)) return sig.mime;
  }
  return null;
}

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
