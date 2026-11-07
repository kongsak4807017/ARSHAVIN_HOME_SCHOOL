import { load } from 'cheerio';
export function normalizeA4Structure(html) {
  const $ = load(html);
  $('table').each((_, table) => {
    const node = $(table), row = node.find('tr').first();
    if (!node.children('thead').length && row.children('th').length && !row.children('td').length) {
      node.prepend($('<thead></thead>').append(row));
    }
  });
  $('.activity-block ol').each((_, list) => {
    const node = $(list), previous = node.prev();
    if (previous.is('ol')) { previous.append(node.children()); node.remove(); }
  });
  const groups = new Map();
  $('.activity-block[data-split-from]').each((_, element) => {
    const block = $(element), key = block.attr('data-split-from');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(block);
  });
  for (const blocks of groups.values()) blocks.forEach((block, index) => {
    block.children('.continuation-label').remove();
    if (blocks.length > 1) block.children('h1,h2,h3').first().after(`<p class="continuation-label">Part ${index + 1}/${blocks.length} · ส่วน ${index + 1}/${blocks.length}</p>`);
  });
  return $.html();
}
