// Listing photo for the two column rows: /api/agent-photo?a=EMAIL&n=1 draws the 1st listing's photo (n=1 to 6), 480 x 340, shown at 240 x 170.
// s=gap returns the space under that row (1040 x 48 transparent, shown at 520 x 24) when the listing exists.
// Optional &tags=titled_land uses only the agent's listings with that website tag.
// Empty slot, unknown email, or n above 6: a 1 pixel transparent image, so the email shows nothing there.
import { ImageResponse } from '@vercel/og';
import { getAgentListings } from '../lib/agentlistings.js';
import { MAX_SHOWN } from '../lib/agentcard.js';
import { rowPhotoElement, ROW_PHOTO_WIDTH, ROW_PHOTO_HEIGHT, ROW_GAP_PNG } from '../lib/agentrow.js';
import { photoDataUrl } from '../lib/assets.js';

export const config = { runtime: 'edge' };

const BLANK = 'iVBORw0KGgoAAAANSUhEUgAABBAAAAABCAYAAABnoF3dAAAAG0lEQVR42u3BgQAAAADDoPlTH+ECVQEAAAAcAxBBAAFEa7aUAAAAAElFTkSuQmCC'; // 1040 wide, 1 pixel tall, transparent: shown at 520 wide it is half a pixel tall, so the slot collapses
const CACHE = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

function blank(b64 = BLANK) {
  const bin = atob(b64);
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
  if (q.get('s') === 'gap') return blank(ROW_GAP_PNG);
  const photo = await photoDataUrl(item.img);
  return new ImageResponse(rowPhotoElement(photo), {
    width: ROW_PHOTO_WIDTH, height: ROW_PHOTO_HEIGHT,
    headers: { 'cache-control': CACHE },
  });
}
