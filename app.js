/**
 * Nuptials Wedding Website Script
 * Matches nuptials-blue template behavior
 * Couple: Gokul Krishnan & Niroshma Manoharan
 * Date: Sunday, December 6, 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initThemeToggle();
  initCountdownTimer();
  initWishes();
});

/* ==========================================================================
   1. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbarScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. LIGHT / DARK THEME TOGGLE (Sun/Moon icon in screenshot)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('wedding_theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon(true);
  } else {
    document.body.classList.remove('light-theme');
    updateThemeIcon(false);
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('wedding_theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });

  function updateThemeIcon(isLight) {
    if (isLight) {
      // Moon icon
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    } else {
      // Sun icon (matching screenshots)
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    }
  }
}

/* ==========================================================================
   3. COUNTDOWN TIMER
   Target: Sunday, December 6, 2026, 18:00:00 IST
   ========================================================================== */
function initCountdownTimer() {
  const targetDate = new Date('2026-12-06T18:00:00+05:30').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = String(hours);
    if (minsEl) minsEl.textContent = String(minutes);
    if (secsEl) secsEl.textContent = String(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. WISHES / GUESTBOOK
   ========================================================================== */
function initWishes() {
  const form = document.getElementById('wishes-form');
  const list = document.getElementById('wishes-list');
  const storageKey = 'nuptials_gokul_niroshma_wishes_v2';

  const defaultWishes = [
    {
      name: 'Meenakshi Gopinath',
      message: 'So happy for Gokul and Niroshma! Wishing both of you a wonderful married life filled with laughter and immense joy.'
    }
  ];

  function getWishes() {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.filter(item => !item.name.includes('Suresh'));
      }
    } catch (_) {}
    return defaultWishes;
  }

  function render() {
    if (!list) return;
    const items = getWishes();
    list.innerHTML = '';
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'wish-single-box';
      el.innerHTML = `
        <h4 class="wish-author-name">${escapeHtml(item.name)}</h4>
        <p class="wish-body">“${escapeHtml(item.message)}”</p>
      `;
      list.appendChild(el);
    });
  }

  render();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('guest-name');
      const messageInput = document.getElementById('guest-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) return;

      const items = getWishes();
      items.unshift({ name, message });
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch (_) {}

      render();

      if (nameInput) nameInput.value = '';
      if (messageInput) messageInput.value = '';

      alert('Thank you for your blessings! ✨');
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
