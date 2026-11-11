// Agent link: /api/agent-go?a=EMAIL&n=1 sends the reader to the agent's 1st listing (n=1 to 6).
// n=all, an empty slot, or anything unexpected goes to the agent's listings page.
// Optional &campaign=NAME sets utm_campaign (letters, numbers, _ and - only); without it utm_campaign is agent-listings.
// Optional &tags=titled_land: card n is the nth listing with that tag, and the listings page is filtered to that tag.
// An email that is not in the agent list goes to the main listings page.
// Every link carries tracking tags so GA4 counts the visit under the Email channel
// (utm_medium=email) and shows which link was clicked (utm_content=card-1 to card-6, see-all-listings).
import { getAgentListings, agentPageUrl, SITE } from '../lib/agentlistings.js';
import { slugForEmail } from '../lib/agents.js';
import { MAX_SHOWN } from '../lib/agentcard.js';

export const config = { runtime: 'edge' };

const TAGS = { utm_source: 'rex', utm_medium: 'email', utm_campaign: 'agent-listings' };

function tagged(target, content, campaign) {
  try {
    const u = new URL(target);
    for (const [k, v] of Object.entries(TAGS)) u.searchParams.set(k, v);
    if (campaign) u.searchParams.set('utm_campaign', campaign);
    u.searchParams.set('utm_content', content);
    return u.toString();
  } catch (_) {
    return target;
  }
}

export default async function handler(req) {
  const q = new URL(req.url).searchParams;
  const slug = slugForEmail(q.get('a'));
  const tags = q.get('tags');
  const campaign = String(q.get('campaign') || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const n = parseInt(q.get('n') || '', 10);
  const isCard = n >= 1 && n <= MAX_SHOWN;
  let target = SITE + '/listings';
  let content = isCard ? 'card-' + n + '-empty' : 'see-all-listings';
  if (slug) {
    target = agentPageUrl(slug, 1, tags);
    if (isCard) {
      try { const r = await getAgentListings(q.get('a'), tags); const item = r && r.items[n - 1]; if (item && item.url) { target = item.url; content = 'card-' + n; } } catch (_) {}
    }
  }
  return new Response(null, { status: 302, headers: { location: tagged(target, content, campaign), 'cache-control': 'no-store' } });
}
