import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { query } from '../lib/db.js';
import { requireAgent, requireAdmin } from '../middleware/requireAgent.js';
import { asyncHandler } from '../lib/asyncHandler.js';

export const adminRouter = Router();
adminRouter.use(requireAgent); // every route below requires a valid, active agent session

const STORAGE_DIR = path.resolve(process.cwd(), 'storage', 'documents');
const STATUSES = ['NEW', 'UNDER_REVIEW', 'CONTACTED', 'QUALIFIED', 'APPROVED', 'REJECTED'];

adminRouter.get('/applications', asyncHandler(async (req, res) => {
  const { status, assigned_agent_id, q } = req.query;
  const clauses = [];
  const params = [];
  if (status && STATUSES.includes(status)) { params.push(status); clauses.push(`a.status = $${params.length}`); }
  if (assigned_agent_id) { params.push(assigned_agent_id); clauses.push(`a.assigned_agent_id = $${params.length}`); }
  if (q) { params.push(`%${q}%`); clauses.push(`(a.business_name ilike $${params.length} or a.contact_person ilike $${params.length})`); }
  const where = clauses.length ? `where ${clauses.join(' and ')}` : '';

  const { rows } = await query(
    `select a.id, a.application_reference, a.business_name, a.contact_person, a.city, a.province,
            a.status, a.submitted_at, ag.full_name as assigned_agent_name
     from dealer_applications a
     left join agents ag on ag.id = a.assigned_agent_id
     ${where}
     order by a.submitted_at desc
     limit 200`,
    params
  );
  res.json({ applications: rows });
}));

adminRouter.get('/applications/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rows: [app] } = await query(
    `select a.*, ag.full_name as assigned_agent_name
     from dealer_applications a left join agents ag on ag.id = a.assigned_agent_id
     where a.id = $1`, [id]);
  if (!app) return res.status(404).json({ error: 'Application not found.' });

  const [{ rows: documents }, { rows: references }, { rows: notes }, { rows: history }] = await Promise.all([
    query('select id, document_type, original_filename, mime_type, file_size, uploaded_at from application_documents where application_id = $1 order by uploaded_at', [id]),
    query('select * from application_references where application_id = $1 order by position', [id]),
    query(`select n.id, n.body, n.created_at, ag.full_name as agent_name
           from application_notes n join agents ag on ag.id = n.agent_id
           where n.application_id = $1 order by n.created_at desc`, [id]),
    query(`select h.from_status, h.to_status, h.created_at, ag.full_name as agent_name
           from application_status_history h left join agents ag on ag.id = h.agent_id
           where h.application_id = $1 order by h.created_at`, [id])
  ]);

  res.json({ application: app, documents, references, notes, history });
}));

adminRouter.patch('/applications/:id/status', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body ?? {};
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

  const { rows: [current] } = await query('select status from dealer_applications where id = $1', [id]);
  if (!current) return res.status(404).json({ error: 'Application not found.' });

  await query('update dealer_applications set status = $1, updated_at = now() where id = $2', [status, id]);
  await query(
    'insert into application_status_history (application_id, agent_id, from_status, to_status) values ($1,$2,$3,$4)',
    [id, req.agent.id, current.status, status]
  );
  res.json({ ok: true, status });
}));

adminRouter.post('/applications/:id/notes', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = String(req.body?.body ?? '').trim();
  if (!body) return res.status(400).json({ error: 'Note cannot be empty.' });

  const { rows: [exists] } = await query('select id from dealer_applications where id = $1', [id]);
  if (!exists) return res.status(404).json({ error: 'Application not found.' });

  const { rows: [note] } = await query(
    `insert into application_notes (application_id, agent_id, body) values ($1,$2,$3)
     returning id, body, created_at`,
    [id, req.agent.id, body]
  );
  res.status(201).json({ ok: true, note: { ...note, agent_name: req.agent.full_name } });
}));

adminRouter.patch('/applications/:id/assign', requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { agent_id } = req.body ?? {};
  if (agent_id) {
    const { rows: [target] } = await query('select id from agents where id = $1 and active', [agent_id]);
    if (!target) return res.status(400).json({ error: 'Unknown or inactive agent.' });
  }
  const { rowCount } = await query('update dealer_applications set assigned_agent_id = $1, updated_at = now() where id = $2', [agent_id || null, id]);
  if (!rowCount) return res.status(404).json({ error: 'Application not found.' });
  res.json({ ok: true });
}));

// Agent accounts themselves are managed by agentsRouter (mounted at
// /api/admin/agents in server.js) — kept out of this file so the two
// don't drift: one file owns "what an agent account is," this one owns
// "what an agent (of either role) can do with applications."

// Protected document download — never served as a static path. The
// application_id in the URL must match the document's own row, so one
// agent session can't be used to probe arbitrary document ids across
// applications without the pairing lining up.
adminRouter.get('/applications/:appId/documents/:docId/download', asyncHandler(async (req, res) => {
  const { appId, docId } = req.params;
  const { rows: [doc] } = await query(
    'select * from application_documents where id = $1 and application_id = $2',
    [docId, appId]
  );
  if (!doc) return res.status(404).json({ error: 'Document not found.' });

  const filePath = path.join(STORAGE_DIR, appId, doc.stored_filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on disk.' });

  res.setHeader('Content-Type', doc.mime_type);
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.original_filename)}"`);
  fs.createReadStream(filePath).pipe(res);
}));
