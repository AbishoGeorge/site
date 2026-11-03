export type LeadKind = 'demo' | 'event' | 'top-accounts';
export type LeadResult = { status: 'sent' } | { status: 'error'; message?: string };

/** Name of the hidden honeypot input; must match HONEYPOT in worker/index.ts. */
export const HONEYPOT_FIELD = 'company_fax';

/**
 * Send a form to the site's Worker at /api/contact, which checks it and emails it through Resend. Returns the
 * Worker's own error message when it has one (for example "Enter a valid email address."), so the form can show it.
 */
export async function submitLead(kind: LeadKind, data: Record<string, string>): Promise<LeadResult> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ type: kind, ...data }),
    });
    if (res.ok) return { status: 'sent' };
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    return { status: 'error', message: body?.error };
  } catch {
    return { status: 'error' };
  }
}
