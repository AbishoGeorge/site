import { brand } from '../../brand';

export type LeadKind = 'demo' | 'event' | 'top-accounts';
export type LeadResult = 'sent' | 'email' | 'error';

const subjects: Record<LeadKind, string> = {
  demo: 'Demo request',
  event: 'Event intelligence request',
  'top-accounts': 'Top accounts request',
};

/**
 * Send a form to `brand.formEndpoint` as JSON. With no endpoint configured, open the visitor's email app
 * addressed to `brand.email` with the details filled in, and report that so the page can say so.
 */
export async function submitLead(kind: LeadKind, data: Record<string, string>): Promise<LeadResult> {
  if (!brand.formEndpoint) {
    const body = Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    const subject = `${subjects[kind]}${data.Website ? `: ${data.Website}` : ''}`;
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return 'email';
  }
  try {
    const res = await fetch(brand.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ type: kind, ...data }),
    });
    return res.ok ? 'sent' : 'error';
  } catch {
    return 'error';
  }
}
