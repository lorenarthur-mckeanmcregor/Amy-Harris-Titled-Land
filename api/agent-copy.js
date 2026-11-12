// Listing copy for the two column rows: /api/agent-copy?a=EMAIL&n=1 draws the 1st listing's price, address, beds, baths, cars, land,
// UNDER CONTRACT where it applies, and VIEW THE LISTING underneath (n=1 to 6). 520 wide, shown at 260; the height fits the text.
// Optional &tags=titled_land uses only the agent's listings with that website tag.
// Empty slot, unknown email, or n above 6: a 1 pixel transparent image, so the email shows nothing there.
import { ImageResponse } from '@vercel/og';
import { getAgentListings } from '../lib/agentlistings.js';
import { MAX_SHOWN } from '../lib/agentcard.js';
import { rowCopyElement, rowCopyHeight, ROW_COPY_WIDTH } from '../lib/agentrow.js';
import { cardFonts } from '../lib/assets.js';

export const config = { runtime: 'edge' };

const BLANK = 'iVBORw0KGgoAAAANSUhEUgAABBAAAAABCAYAAABnoF3dAAAAG0lEQVR42u3BgQAAAADDoPlTH+ECVQEAAAAcAxBBAAFEa7aUAAAAAElFTkSuQmCC'; // 1040 wide, 1 pixel tall, transparent: shown at 520 wide it is half a pixel tall, so the slot collapses
const CACHE = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

function blank() {
  const bin = atob(BLANK);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Response(bytes, { headers: { 'content-type': 'image/png', 'cache-control': CACHE } });
}

export default async function handler(req) {
  const q = new URL(req.url).searchParams;
  const n = parseInt(q.get('n') || '1', 10);
  if (!(n >= 1 && n <= MAX_SHOWN)) return blank();
  let item = null;
  try { const r = await getAgentListings(q.get('a'), q.get('tags')); item = r ? r.items[n - 1] || null : null; } catch (_) { item = null; }
  if (!item) return blank();
  const height = rowCopyHeight(item);
  return new ImageResponse(rowCopyElement(item, height), {
    width: ROW_COPY_WIDTH, height, fonts: await cardFonts(),
    headers: { 'cache-control': CACHE },
  });
}
