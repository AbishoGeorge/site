/**
 * Worker in front of the static site. POST /api/contact validates a form submission and emails it through Resend;
 * every other request is served from the built site in dist/ exactly as before.
 *
 * Secrets and variables (set in the Cloudflare dashboard, never in code):
 *   RESEND_API_KEY      secret: the Resend API key
 *   CONTACT_TO_EMAIL    where submissions are sent
 *   CONTACT_FROM_EMAIL  the sender, on a domain verified in Resend, e.g. "Databery <abisho@databery.com>"
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

type Kind = 'demo' | 'event' | 'top-accounts';

/** The fields each form sends, in the order they appear in the email. */
interface Field {
  key: string;
  label: string;
  required?: boolean;
  max: number;
  check?: (value: string) => string | null;
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const DOMAIN = /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
const PHONE = /^[+()\d\s.-]{5,40}$/;
const TEAM_SIZES = ['Just me', '2-10', '11-50', '51-200', '200+'];

const email = (v: string) => (EMAIL.test(v) ? null : 'Enter a valid email address.');
const domain = (v: string) => (DOMAIN.test(v) ? null : 'Enter a website like yourcompany.com.');

const FIELDS: Record<Kind, Field[]> = {
  demo: [
    { key: 'name', label: 'Name', required: true, max: 100 },
    { key: 'email', label: 'Email', required: true, max: 254, check: email },
    { key: 'website', label: 'Website', required: true, max: 253, check: domain },
    {
      key: 'teamSize',
      label: 'Sales team size',
      max: 20,
      check: (v) => (TEAM_SIZES.includes(v) ? null : 'Pick a team size from the list.'),
    },
    { key: 'message', label: 'Message', max: 2000 },
  ],
  event: [
    { key: 'name', label: 'Name', required: true, max: 100 },
    { key: 'email', label: 'Email', required: true, max: 254, check: email },
    { key: 'website', label: 'Website', required: true, max: 253, check: domain },
    {
      key: 'teamSize',
      label: 'Sales team size',
      max: 20,
      check: (v) => (TEAM_SIZES.includes(v) ? null : 'Pick a team size from the list.'),
    },
    { key: 'event', label: 'Event', max: 300 },
  ],
  'top-accounts': [
    { key: 'name', label: 'Name', required: true, max: 100 },
    { key: 'email', label: 'Email', required: true, max: 254, check: email },
    { key: 'phone', label: 'Phone', max: 40, check: (v) => (PHONE.test(v) ? null : 'Enter a valid phone number.') },
    { key: 'website', label: 'Website', required: true, max: 253, check: domain },
  ],
};

const SUBJECTS: Record<Kind, string> = {
  demo: 'Demo request',
  event: 'Event intelligence request',
  'top-accounts': 'Top accounts request',
};

// The honeypot input is hidden from people; anything typed into it came from a bot.
const HONEYPOT = 'company_fax';
const MAX_BODY = 16_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) {
    return json({ error: 'Send the form as JSON.' }, 415);
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'That message is too long.' }, 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'The form data could not be read.' }, 400);
  }

  // Quietly accept bot submissions so they don't retry, but send nothing.
  if (typeof body[HONEYPOT] === 'string' && body[HONEYPOT].trim() !== '') return json({ ok: true });

  const kind = body.type as Kind;
  if (!(kind in FIELDS)) return json({ error: 'Unknown form.' }, 400);

  const values: { label: string; value: string }[] = [];
  let replyTo = '';
  let name = '';
  let website = '';
  for (const field of FIELDS[kind]) {
    const rawValue = body[field.key];
    if (rawValue !== undefined && typeof rawValue !== 'string') {
      return json({ error: `${field.label} must be text.`, field: field.key }, 400);
    }
    const value = (rawValue ?? '').trim();
    if (!value) {
      if (field.required) return json({ error: `${field.label} is required.`, field: field.key }, 400);
      continue;
    }
    if (value.length > field.max) {
      return json({ error: `${field.label} must be ${field.max} characters or fewer.`, field: field.key }, 400);
    }
    const problem = field.check?.(value);
    if (problem) return json({ error: problem, field: field.key }, 400);
    values.push({ label: field.label, value });
    if (field.key === 'email') replyTo = value;
    if (field.key === 'name') name = value;
    if (field.key === 'website') website = value;
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    console.error('Contact form is not configured: set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.');
    return json({ error: "We couldn't send your message right now. Please email us instead." }, 503);
  }

  // Names never go into the subject line raw: strip anything that could break the header.
  const subject = `${SUBJECTS[kind]} from ${name.replace(/[\r\n]+/g, ' ')}${website ? ` (${website})` : ''}`;
  const text = values.map(({ label, value }) => `${label}: ${value}`).join('\n');
  const html = `<h2 style="font-family:sans-serif">${escapeHtml(SUBJECTS[kind])}</h2><table style="font-family:sans-serif;border-collapse:collapse">${values
    .map(
      ({ label, value }) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#64748b;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
    )
    .join('')}</table>`;

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: replyTo,
        subject,
        text,
        html,
      }),
    });
  } catch (err) {
    console.error('Resend request failed', err);
    return json({ error: "We couldn't send your message right now. Please try again." }, 502);
  }
  if (!res.ok) {
    console.error('Resend rejected the email', res.status, await res.text());
    return json({ error: "We couldn't send your message right now. Please try again." }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
