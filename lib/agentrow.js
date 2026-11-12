// Two column listing rows (v5, titled land email): photo on the left, copy on the right with VIEW THE LISTING under it.
// Each listing is two images so the email can show them side by side and stack them on phones.
// Drawn at twice the email size so they stay sharp: photo 480 x 340 shown at 240 x 170; copy 520 wide shown at 260, its height fits the text.
// The space under each row is a third image (agent-photo with s=gap), so an empty slot (1 pixel images) leaves no gap.

const C = { black: '#000000', text: '#1A1A1A', text2: '#333333', yellow: '#f5a623', gold: '#FAA41A', dark: '#282829', white: '#ffffff' };
export const ROW_PHOTO_WIDTH = 480;
export const ROW_PHOTO_HEIGHT = 340;
export const ROW_COPY_WIDTH = 520;
export const ROW_GAP_PNG = 'iVBORw0KGgoAAAANSUhEUgAABBAAAAAwCAYAAACohonVAAAA2ElEQVR42u3BgQAAAADDoPlTH+ECVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADANwxdAAGCNM8/AAAAAElFTkSuQmCC'; // 1040 x 48 transparent, shown at 520 x 24

// Height of the copy image for one listing: fits its lines, so a phone shows no empty space under the text.
// Line counts are estimated on the safe side (fewer characters per line than the font really fits).
export function rowCopyHeight(item) {
  const lines = (s, perLine) => Math.max(1, Math.ceil(String(s || '').length / perLine));
  const specs = (item.specs || []).concat(item.land ? [item.land] : []).join('    ');
  let hgt = 16;                                    // top space
  if (item.underContract) hgt += 34;               // UNDER CONTRACT
  if (item.price) hgt += 38 * lines(item.price, 26); // price
  hgt += 8 + 39 * lines(item.address, 24);         // address
  if (specs) hgt += 12 + 33 * lines(specs, 34);    // beds, baths, cars, land
  hgt += 20 + 37 + 12;                             // VIEW THE LISTING and space under it
  return Math.min(Math.max(hgt, 200), 600);
}

const h = (type, style, children) => ({ type, props: { style, children } });

export function rowPhotoElement(photoDataUrl) {
  const W = ROW_PHOTO_WIDTH, H = ROW_PHOTO_HEIGHT;
  if (photoDataUrl) {
    return h('div', { display: 'flex', width: W, height: H, background: '#F3F2F2' }, [
      { type: 'img', props: { src: photoDataUrl, width: W, height: H, style: { width: W, height: H, objectFit: 'cover' } } },
    ]);
  }
  return h('div', { display: 'flex', width: W, height: H, background: '#F3F2F2' }, []);
}

export function rowCopyElement(item, height) {
  const text = [];
  if (item.underContract) {
    text.push(h('div', { display: 'flex', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 20, letterSpacing: 2, color: C.yellow, marginBottom: 10 }, 'UNDER CONTRACT'));
  }
  if (item.price) text.push(h('div', { display: 'flex', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 30, lineHeight: 1.25, color: C.black }, item.price));
  text.push(h('div', { display: 'flex', marginTop: 8, fontFamily: 'Montserrat', fontWeight: 400, fontSize: 30, lineHeight: 1.3, color: C.text }, item.address));
  const specs = (item.specs || []).concat(item.land ? [item.land] : []);
  if (specs.length) {
    text.push(h('div', { display: 'flex', flexWrap: 'wrap', marginTop: 12, fontFamily: 'Open Sans', fontSize: 24, color: C.text2 },
      specs.map((s) => h('span', { marginRight: 24 }, s))));
  }
  text.push(h('div', { display: 'flex', marginTop: 20 }, [
    h('div', { display: 'flex', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 22, letterSpacing: 2, color: C.dark, paddingBottom: 6, borderBottom: '3px solid ' + C.gold }, 'VIEW THE LISTING'),
  ]));
  return h('div', { display: 'flex', flexDirection: 'column', width: ROW_COPY_WIDTH, height: height || rowCopyHeight(item), paddingTop: 16, overflow: 'hidden', background: C.white }, text);
}
