// This repository serves one agent only: Amy Harris.
// Sender's Rex email -> the agent's filter slug on the McKean McGregor listings page.
// An email that is not listed here shows nothing and links to the main listings page.

export const AGENTS = {
  'amy.arthur@mckeanmcgregor.com.au': 'amy-harris-arthur',
};

export function slugForEmail(email) {
  return AGENTS[String(email || '').trim().toLowerCase()] || '';
}

// Staff page slug for each email: https://mckeanmcgregor.com.au/staff/<slug> (used for the live job title).
export const STAFF = {
  'amy.arthur@mckeanmcgregor.com.au': 'amyharris-arthur',
};

export function staffSlugForEmail(email) {
  return STAFF[String(email || '').trim().toLowerCase()] || '';
}
