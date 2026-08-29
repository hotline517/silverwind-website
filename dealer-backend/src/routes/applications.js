import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { withTransaction } from '../lib/db.js';
import { submitSchema, ALLOWED_DOCUMENT_TYPES, sniffMimeType, MAX_FILE_BYTES } from '../lib/validation.js';
import { asyncHandler } from '../lib/asyncHandler.js';

export const applicationsRouter = Router();

const STORAGE_DIR = path.resolve(process.cwd(), 'storage', 'documents');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 12 }
});

const submitLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

// multipart: JSON fields under `payload`, files under `documents`
// (each file's field name doubles as its document_type, validated below).
applicationsRouter.post('/submit', submitLimiter, upload.any(), asyncHandler(async (req, res) => {
  let payload;
  try {
    payload = JSON.parse(req.body.payload ?? '{}');
  } catch {
    return res.status(400).json({ error: 'Malformed submission.' });
  }

  const parsed = submitSchema.safeParse(payload);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Please fix the highlighted fields.',
      issues: parsed.data ? [] : parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
    });
  }

  const files = req.files ?? [];
  for (const f of files) {
    if (!ALLOWED_DOCUMENT_TYPES.includes(f.fieldname)) {
      return res.status(400).json({ error: `Unknown document type: ${f.fieldname}` });
    }
    const sniffed = sniffMimeType(f.buffer);
    if (!sniffed) {
      return res.status(400).json({ error: `${f.originalname} is not a supported file type (PDF, JPG, or PNG only).` });
    }
    f.sniffedMime = sniffed;
  }

  const { business, property, references, declaration_accepted } = parsed.data;
  const savedPaths = [];

  try {
    const result = await withTransaction(async (client) => {
      const { rows: [{ next_application_reference: reference }] } =
        await client.query('select next_application_reference()');

      const { rows: [app] } = await client.query(
        `insert into dealer_applications
          (application_reference, business_name, business_type, contact_person, contact_position,
           business_address, city, province, postal_code, contact_number, email, website, facebook_page,
           years_in_business, store_address, property_status, store_size, operation_info, location_notes,
           declaration_accepted, declaration_accepted_at, declaration_text_version)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,now(),'PENDING')
         returning id, application_reference`,
        [reference, business.business_name, business.business_type || null, business.contact_person,
         business.contact_position || null, business.business_address, business.city, business.province,
         business.postal_code || null, business.contact_number, business.email, business.website || null,
         business.facebook_page || null, business.years_in_business || null, property.store_address || null,
         property.property_status || null, property.store_size || null, property.operation_info || null,
         property.location_notes || null, declaration_accepted]
      );

      for (const [i, r] of references.entries()) {
        await client.query(
          `insert into application_references
            (application_id, position, reference_name, company, contact_number, email, relationship, years_known, notes)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [app.id, i + 1, r.reference_name, r.company || null, r.contact_number || null, r.email || null,
           r.relationship || null, r.years_known || null, r.notes || null]
        );
      }

      await client.query(
        `insert into application_status_history (application_id, to_status) values ($1, 'NEW')`,
        [app.id]
      );

      for (const f of files) {
        const storedFilename = `${randomUUID()}${path.extname(f.originalname).toLowerCase().slice(0, 10)}`;
        const appDir = path.join(STORAGE_DIR, app.id);
        await fs.mkdir(appDir, { recursive: true });
        const fullPath = path.join(appDir, storedFilename);
        await fs.writeFile(fullPath, f.buffer);
        savedPaths.push(fullPath);

        await client.query(
          `insert into application_documents
            (application_id, document_type, original_filename, stored_filename, mime_type, file_size)
           values ($1,$2,$3,$4,$5,$6)`,
          [app.id, f.fieldname, f.originalname.slice(0, 255), storedFilename, f.sniffedMime, f.size]
        );
      }

      return app;
    });

    res.status(201).json({ ok: true, applicationReference: result.application_reference });
  } catch (err) {
    // Roll back any files already written to disk — the DB transaction
    // above already rolled itself back, but the filesystem writes are not
    // part of that transaction.
    await Promise.all(savedPaths.map(p => fs.unlink(p).catch(() => {})));
    console.error('submitApplication failed:', err);
    res.status(500).json({ error: "We couldn't submit your application right now. Please try again." });
  }
}));
