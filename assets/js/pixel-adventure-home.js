(() => {
  'use strict';

  const cards = [...document.querySelectorAll('.lesson-card')];
  const filters = [...document.querySelectorAll('[data-biome]')];
  const search = document.querySelector('#lesson-search');
  const status = document.querySelector('#lesson-results-status');
  const continueLink = document.querySelector('[data-continue-adventure]');
  const keys = Array.isArray(window.ARSHAVIN_PROGRESS_KEYS) ? window.ARSHAVIN_PROGRESS_KEYS : [];

  const biomeMap = {
    'Human Body': 'human-body',
    'AI Science': 'ai-science',
    'Environmental Science': 'environment',
    'Maker Engineering': 'maker-engineering',
    Citizenship: 'citizenship'
  };

  const deriveBiome = card => biomeMap[card.querySelector('.badge')?.textContent.trim()] || 'all';
  const readProgress = key => {
    if (!key) return null;
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
  };
  const isComplete = data => {
    if (!data || typeof data !== 'object') return false;
    if (data.completed === true) return true;
    const gates = Object.entries(data).filter(([name, value]) => /Complete$/.test(name) && typeof value === 'boolean');
    return gates.length > 0 && gates.every(([, value]) => value);
  };

  cards.forEach((card, index) => {
    const biome = deriveBiome(card);
    const data = readProgress(keys[index]);
    card.dataset.biome = biome;
    card.dataset.search = card.textContent.toLocaleLowerCase('th');
    card.dataset.progress = isComplete(data) ? 'complete' : data ? 'started' : 'new';
    const marker = document.createElement('span');
    marker.className = 'quest-status';
    marker.textContent = card.dataset.progress === 'complete' ? 'สำเร็จ ✓' : card.dataset.progress === 'started' ? 'กำลังเรียน' : 'ภารกิจใหม่';
    card.querySelector('h3')?.insertAdjacentElement('afterend', marker);
  });

  let activeBiome = 'all';

  function applyFilters() {
    const term = (search?.value || '').trim().toLocaleLowerCase('th');
    let visible = 0;
    cards.forEach(card => {
      const matchesBiome = activeBiome === 'all' || card.dataset.biome === activeBiome;
      const matchesSearch = !term || card.dataset.search.includes(term);
      card.hidden = !(matchesBiome && matchesSearch);
      if (!card.hidden) visible += 1;
    });
    if (status) status.textContent = `แสดง ${visible} จาก ${cards.length} บทเรียน / Showing ${visible} of ${cards.length} lessons`;
  }

  filters.forEach(button => button.addEventListener('click', () => {
    activeBiome = button.dataset.biome;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    applyFilters();
  }));
  search?.addEventListener('input', applyFilters);

  function findContinueLesson() {
    return cards.find(card => card.dataset.progress === 'started') ||
      cards.find(card => card.dataset.progress === 'new') || cards[0];
  }

  const next = findContinueLesson();
  const nextAnchor = next?.querySelector('a[href]');
  if (continueLink && nextAnchor) {
    continueLink.href = nextAnchor.getAttribute('href');
    continueLink.querySelector('span').textContent = next.querySelector('h3')?.textContent || 'เริ่มภารกิจแรก';
  }

  window.addEventListener('storage', () => location.reload());
  applyFilters();
})();
