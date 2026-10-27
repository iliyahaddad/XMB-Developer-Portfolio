/* XMB-style developer portfolio — main application.
   Plain JavaScript, no framework, no build step. */
(() => {
  'use strict';

  const C = window.PORTFOLIO_CONFIG;
  const API = 'https://api.github.com';
  const VERSION = '2.0.0';
  const PREFIX = 'xmb:v2:';

  /* ------------------------------------------------------------------ utils */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(PREFIX + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(PREFIX + k, v); } catch { /* storage unavailable */ } }
  };
  const L = obj => (obj && typeof obj === 'object') ? (obj[S.lang] ?? obj.en ?? '') : (obj ?? '');
  const safeUrl = u => /^https?:\/\//i.test(u || '') ? u : '';

  /* ------------------------------------------------------------------ icons */
  const ICONS = {
    home: 'M3 11l9-8 9 8|M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10',
    box: 'M12 2l9 5v10l-9 5-9-5V7z|M3 7l9 5 9-5|M12 12v10',
    layers: 'M12 2l10 5-10 5L2 7z|M2 12l10 5 10-5|M2 17l10 5 10-5',
    pulse: 'M3 12h4l3-8 4 16 3-8h4',
    user: 'M20 21a8 8 0 0 0-16 0|M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10',
    link: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1|M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
    sliders: 'M4 6h9|M17 6h3|M4 12h3|M11 12h9|M4 18h11|M19 18h1|M13 4v4|M7 10v4|M15 16v4',
    star: 'M12 2l3 6.5 7 .9-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.9z',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16|M21 21l-4.3-4.3',
    repo: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20|M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2',
    fork: 'M6 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3|M12 12v9',
    globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M2 12h20|M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20',
    volume: 'M11 5L6 9H2v6h4l5 4z|M15.5 8.5a5 5 0 0 1 0 7',
    zap: 'M13 2L3 14h9l-1 8 10-12h-9z',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M12 6v6l4 2',
    mail: 'M3 5h18v14H3z|M3 7l9 6 9-6',
    ext: 'M7 17L17 7|M8 7h9v9',
    copy: 'M9 9h11v11H9z|M5 15H4V4h11v1',
    cpu: 'M6 6h12v12H6z|M9 9h6v6H9z|M9 2v4|M15 2v4|M9 18v4|M15 18v4|M2 9h4|M2 15h4|M18 9h4|M18 15h4',
    terminal: 'M4 17l6-6-6-6|M12 19h8',
    pad: 'M6 12h4|M8 10v4|M15 13h.01|M18 11h.01|M17.3 5H6.7a4 4 0 0 0-3.9 3.2L1.5 15a3 3 0 0 0 5.2 2.4L8 16h8l1.3 1.4A3 3 0 0 0 22.5 15l-1.3-6.8A4 4 0 0 0 17.3 5z',
    help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4|M12 17h.01',
    refresh: 'M21 12a9 9 0 1 1-3-6.7|M21 3v6h-6',
    expand: 'M4 9V4h5|M20 9V4h-5|M4 15v5h5|M20 15v5h-5',
    share: 'M12 3v12|M7 8l5-5 5 5|M5 14v6h14v-6',
    hash: 'M5 9h14|M5 15h14|M10 3L8 21|M16 3l-2 18',
    github: 'M9 19c-4.3 1.4-4.3-2.5-6-3|M15 22v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-7A5.4 5.4 0 0 0 19 4.8 5 5 0 0 0 18.9 1S17.7.6 15 2.5a13.4 13.4 0 0 0-7 0C5.3.6 4.1 1 4.1 1A5 5 0 0 0 4 4.8 5.4 5.4 0 0 0 2.5 8.5c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 0 0-.9 2.6V22',
    palette: 'M12 22a10 10 0 1 1 10-10c0 3-2.5 3-4 3h-2a2 2 0 0 0-1.4 3.4c.5.6.4 1.6-.3 2.1A10 10 0 0 1 12 22z|M7.5 11h.01|M10 7h.01|M15 7h.01',
    check: 'M5 12l5 5 9-10',
    fork2: 'M7 3v12|M17 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6|M7 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6|M17 9c0 5-10 3-10 6',
    issue: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M12 8v5|M12 16h.01',
    tag: 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z|M7 7h.01'
  };
  const icon = (name, cls = '') =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(ICONS[name] || '').split('|').map(d => `<path d="${d}"/>`).join('')}</svg>`;

  /* ------------------------------------------------------------------ state */
  const THEMES = { auto: null, ocean: [205, 80], violet: [265, 68], emerald: [152, 64], amber: [36, 88], rose: [340, 72], mono: [212, 9] };
  const MONTH_HUES = [205, 186, 152, 124, 96, 56, 32, 12, 346, 286, 256, 226];
  const savedLang = store.get('lang');
  const prefersReduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const S = {
    lang: savedLang || ((navigator.language || 'en').toLowerCase().startsWith('fa') ? 'fa' : 'en'),
    theme: THEMES[store.get('theme')] !== undefined ? store.get('theme') : 'auto',
    motion: store.get('motion') != null ? store.get('motion') === '1' : !prefersReduced,
    sound: store.get('sound') === '1',
    forks: store.get('forks') === '1',
    sort: ['updated', 'stars', 'name'].includes(store.get('sort')) ? store.get('sort') : 'updated',
    langFilter: '',
    cat: 'home',
    sel: 0,
    items: [],
    profile: null,
    repos: [],
    events: null,
    status: 'loading',
    resetAt: null,
    usedStale: false,
    token: 0
  };
  const isRTL = () => S.lang === 'fa';
  const locale = () => (S.lang === 'fa' ? 'fa-IR' : 'en');
  const t = (k, v) => {
    let s = (I18N[S.lang] && I18N[S.lang][k]) ?? I18N.en[k] ?? k;
    if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  };
  const nf = n => Number.isFinite(n) ? new Intl.NumberFormat(locale()).format(n) : '—';

  function ago(date) {
    const s = (new Date(date) - Date.now()) / 1000;
    if (!Number.isFinite(s)) return '—';
    const rtf = new Intl.RelativeTimeFormat(S.lang === 'fa' ? 'fa' : 'en', { numeric: 'auto' });
    for (const [u, n] of [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]]) {
      if (Math.abs(s) >= n) return rtf.format(Math.round(s / n), u);
    }
    return rtf.format(Math.round(s), 'second');
  }
  const monthYear = d => new Intl.DateTimeFormat(locale(), { year: 'numeric', month: 'long' }).format(new Date(d));

  const LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572a5', C: '#8a8f98', 'C++': '#f34b7d', 'C#': '#33a02c',
    Assembly: '#c9893f', HTML: '#e34c26', CSS: '#7a5bd0', Java: '#b07219', Kotlin: '#a97bff', Shell: '#89e051',
    PowerShell: '#3d7ab8', Batchfile: '#c1f12e', Pascal: '#e3f171', Go: '#00add8', Rust: '#dea584', Lua: '#6a7fd0',
    Makefile: '#6aa84f', 'Objective-C': '#438eff', 'Visual Basic .NET': '#945db7', Delphi: '#c9e171', Dart: '#00b4ab', PHP: '#4f5d95'
  };
  function langColor(name) {
    if (LANG_COLORS[name]) return LANG_COLORS[name];
    let h = 0; for (const ch of String(name)) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return `hsl(${h} 55% 62%)`;
  }

  /* ------------------------------------------------------------ audio (opt-in) */
  let audio;
  function blip(freq = 640, dur = 0.07, vol = 0.035) {
    if (!S.sound) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
      o.connect(g); g.connect(audio.destination);
      o.start(); o.stop(audio.currentTime + dur);
    } catch { /* audio unavailable */ }
  }

  /* ------------------------------------------------------------- GitHub data */
  const ttl = () => (C.cacheMinutes || 30) * 60 * 1000;
  function cacheGet(path) {
    try {
      const raw = store.get('c:' + path);
      if (!raw) return null;
      const { t: at, d } = JSON.parse(raw);
      return { data: d, stale: Date.now() - at > ttl() };
    } catch { return null; }
  }
  const cacheSet = (path, d) => store.set('c:' + path, JSON.stringify({ t: Date.now(), d }));

  async function gh(path, { raw = false, fresh = false } = {}) {
    const key = path + (raw ? '#raw' : '');
    const hit = cacheGet(key);
    if (hit && !hit.stale && !fresh) return hit.data;
    try {
      const res = await fetch(API + path, { headers: { Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json' } });
      if (res.status === 403 || res.status === 429) {
        const e = new Error('rate-limit'); e.rate = true;
        const reset = Number(res.headers.get('x-ratelimit-reset'));
        e.reset = reset ? reset * 1000 : null; throw e;
      }
      if (!res.ok) { const e = new Error('http-' + res.status); e.status = res.status; throw e; }
      const data = raw ? await res.text() : await res.json();
      cacheSet(key, data);
      return data;
    } catch (e) {
      if (hit) { S.usedStale = true; return hit.data; }
      throw e;
    }
  }

  async function loadAll(fresh = false) {
    S.status = 'loading'; S.usedStale = false; renderStatus(); refreshCurrent();
    const u = C.username;
    try {
      const [profile, repos] = await Promise.all([
        gh(`/users/${u}`, { fresh }),
        gh(`/users/${u}/repos?per_page=100&sort=pushed`, { fresh })
      ]);
      S.profile = profile;
      S.repos = Array.isArray(repos) ? repos : [];
      S.status = S.usedStale ? 'cached' : 'connected';
    } catch (e) {
      S.status = e.rate ? 'limited' : 'offline';
      S.resetAt = e.reset || null;
      if (!S.repos.length) {
        S.repos = (C.fallbackRepos || []).map(r => ({
          name: r.name, description: r.description, language: r.language, fallback: true,
          html_url: `https://github.com/${u}?tab=repositories&q=${encodeURIComponent(r.name)}`,
          stargazers_count: 0, forks_count: 0, topics: [], pushed_at: null, fork: false
        }));
      }
    }
    renderStatus();
    rebuildAll();
    // The activity feed is optional; never block the UI on it.
    gh(`/users/${u}/events/public?per_page=30`, { fresh }).then(ev => { S.events = Array.isArray(ev) ? ev : []; refreshCurrent(); }).catch(() => { S.events = []; refreshCurrent(); });
  }

  /* --------------------------------------------------------------- selectors */
  const pushedOf = r => new Date(r.pushed_at || r.updated_at || 0).getTime();
  const sorters = {
    updated: (a, b) => pushedOf(b) - pushedOf(a),
    stars: (a, b) => (b.stargazers_count - a.stargazers_count) || (pushedOf(b) - pushedOf(a)),
    name: (a, b) => a.name.localeCompare(b.name)
  };
  const baseRepos = () => S.repos.filter(r => S.forks || !r.fork);
  const visibleRepos = () => {
    let r = baseRepos();
    if (S.langFilter) r = r.filter(x => x.language === S.langFilter);
    return r.sort(sorters[S.sort]).slice(0, C.maxRepos || 60);
  };
  function languageCounts() {
    const m = {};
    baseRepos().forEach(r => { if (r.language) m[r.language] = (m[r.language] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }
  function featuredRepos() {
    const pool = baseRepos();
    const picked = [];
    (C.pinned || []).forEach(n => { const r = pool.find(x => x.name.toLowerCase() === n.toLowerCase()); if (r) picked.push(r); });
    [...pool].sort(sorters.stars).forEach(r => { if (picked.length < 3 && !picked.includes(r)) picked.push(r); });
    return picked.slice(0, 3);
  }
  const totalStars = () => S.repos.reduce((n, r) => n + (r.stargazers_count || 0), 0);
  const totalForks = () => S.repos.reduce((n, r) => n + (r.forks_count || 0), 0);
  const repoDesc = r => L(r.description) || t('repo.noDesc');
  const ghUser = () => `https://github.com/${C.username}`;

  /* ---------------------------------------------------------- shared markup */
  const skeleton = (n = 3) => `<div class="skel-list" aria-hidden="true">${Array.from({ length: n }, () => '<div class="skel"></div>').join('')}</div>`;
  const btn = (label, attrs = '', cls = '') => `<button type="button" class="btn ${cls}" ${attrs}>${label}</button>`;
  const link = (label, url, cls = '', ic = 'ext') => `<a class="btn ${cls}" href="${esc(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${esc(label)}${ic ? icon(ic) : ''}</a>`;
  const stat = (n, label, extra = '') => `<div class="stat"><strong ${Number.isFinite(n) ? `data-count="${n}"` : ''}>${Number.isFinite(n) ? nf(0) : '—'}</strong><span>${esc(label)}</span>${extra}</div>`;
  const notice = () => {
    if (S.status === 'limited') return `<div class="notice warn">${icon('issue')}<div><b>${esc(t('err.limited'))}</b><p>${esc(S.resetAt ? t('err.limitedAt', { time: new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit' }).format(new Date(S.resetAt)) }) : t('err.limitedHint'))}</p>${btn(esc(t('btn.retry')), 'data-act="retry"', 'small')}</div></div>`;
    if (S.status === 'offline') return `<div class="notice warn">${icon('issue')}<div><b>${esc(t('err.offline'))}</b><p>${esc(t('err.offlineHint'))}</p>${btn(esc(t('btn.retry')), 'data-act="retry"', 'small')}</div></div>`;
    return '';
  };
  const langBar = (map) => {
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return `<div class="langbar" role="img" aria-label="${esc(entries.map(([n, v]) => `${n} ${Math.round(v / total * 100)}%`).join(', '))}">${entries.map(([n, v]) => `<i style="flex:${v};background:${langColor(n)}"></i>`).join('')}</div>
    <ul class="legend">${entries.slice(0, 6).map(([n, v]) => `<li><i style="background:${langColor(n)}"></i>${esc(n)} <span>${nf(Math.round(v / total * 1000) / 10)}%</span></li>`).join('')}</ul>`;
  };
  const repoCard = r => `<button type="button" class="card" data-act="goto" data-cat="projects" data-id="repo:${esc(r.name)}">
      <b>${esc(r.name)}</b><p>${esc(repoDesc(r))}</p>
      <span class="meta">${r.language ? `<em><i style="background:${langColor(r.language)}"></i>${esc(r.language)}</em>` : ''}<em>${icon('star')}${nf(r.stargazers_count || 0)}</em>${r.pushed_at ? `<em>${esc(ago(r.pushed_at))}</em>` : ''}</span></button>`;

  /* ----------------------------------------------------- categories & items */
  const go = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  function homeItems() {
    const p = S.profile || {};
    return [
      {
        id: 'welcome', icon: 'home', title: t('home.welcome'), sub: t('home.welcome.sub'),
        render: () => `<div class="hero">
          <div class="hero-id"><img class="avatar" src="${esc(safeUrl(p.avatar_url) || 'assets/avatar-placeholder.svg')}" alt="" width="52" height="52" decoding="async"><div><b>${esc(p.name || L(C.name))}</b><span>${esc(p.bio || t('home.bioFallback'))}</span></div></div>
          <h2 class="hero-title">${esc(L(C.tagline))}</h2>
          <p class="lead">${esc(L(C.intro))}</p>
          <div class="stats">${stat(S.profile ? p.public_repos : NaN, t('stat.repos'))}${stat(S.profile ? p.followers : NaN, t('stat.followers'))}${stat(S.profile ? totalStars() : NaN, t('stat.stars'))}</div>
          ${notice()}
          <div class="actions">${btn(esc(t('btn.browse')) + icon('box'), 'data-act="goto" data-cat="projects"', 'primary')}${link(t('btn.github'), ghUser(), '', 'github')}</div>
        </div>`,
        enter: () => goTo('projects')
      },
      {
        id: 'featured', icon: 'star', title: t('home.featured'), sub: t('home.featured.sub'),
        render: () => `<div class="kicker">${esc(t('home.featured'))}</div><h2>${esc(t('home.featured.title'))}</h2><p class="lead">${esc(t('home.featured.text'))}</p>
          ${S.status === 'loading' && !S.repos.length ? skeleton(3) : `<div class="cards">${featuredRepos().map(repoCard).join('') || `<p class="empty">${esc(t('empty.repos'))}</p>`}</div>`}`
      },
      {
        id: 'focus', icon: 'cpu', title: t('home.focus'), sub: t('home.focus.sub'),
        render: () => `<div class="kicker">${esc(t('home.focus'))}</div><h2>${esc(t('home.focus.title'))}</h2>
          <ul class="rows">${(C.focus || []).map(f => `<li class="row"><span class="row-ic">${icon(f.icon || 'cpu')}</span><div><b>${esc(L(f.title))}</b><p>${esc(L(f.text))}</p></div></li>`).join('')}</ul>`
      },
      {
        id: 'guide', icon: 'pad', title: t('home.guide'), sub: t('home.guide.sub'),
        render: () => `<div class="kicker">${esc(t('home.guide'))}</div><h2>${esc(t('home.guide.title'))}</h2><p class="lead">${esc(t('home.guide.text'))}</p>${shortcutsHtml()}`
      }
    ];
  }

  function shortcutsHtml() {
    const rows = [
      ['← →', t('key.cat')], ['↑ ↓', t('key.item')], ['Enter', t('key.open')], ['Esc', t('key.back')],
      ['/  or  Ctrl K', t('key.search')], ['1 – 7', t('key.jump')], ['L', t('key.lang')], ['T', t('key.theme')], ['?', t('key.help')]
    ];
    return `<dl class="keys">${rows.map(([k, d]) => `<div><dt>${k.split(/\s{2}or\s{2}/).map(x => `<kbd>${esc(x)}</kbd>`).join(` ${esc(t('word.or'))} `)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>`;
  }

  /* ---- Projects */
  function projectsItems() {
    const list = visibleRepos();
    const items = [{
      id: 'all', icon: 'box', title: t('proj.all'), sub: t('proj.count', { n: nf(list.length) }),
      render: () => {
        const langs = languageCounts();
        return `<div class="kicker">${esc(t('proj.all'))}</div><h2>${esc(t('proj.title'))}</h2>
          <div class="filters"><span class="flabel">${esc(t('proj.sort'))}</span>${['updated', 'stars', 'name'].map(k => `<button type="button" class="chip ${S.sort === k ? 'on' : ''}" data-act="sort" data-v="${k}" aria-pressed="${S.sort === k}">${esc(t('sort.' + k))}</button>`).join('')}</div>
          ${langs.length ? `<div class="filters"><span class="flabel">${esc(t('proj.lang'))}</span><button type="button" class="chip ${S.langFilter ? '' : 'on'}" data-act="lf" data-v="" aria-pressed="${!S.langFilter}">${esc(t('proj.allLangs'))}</button>${langs.slice(0, 8).map(([n, c]) => `<button type="button" class="chip ${S.langFilter === n ? 'on' : ''}" data-act="lf" data-v="${esc(n)}" aria-pressed="${S.langFilter === n}"><i style="background:${langColor(n)}"></i>${esc(n)} <span>${nf(c)}</span></button>`).join('')}</div>` : ''}
          ${notice()}
          ${S.status === 'loading' && !S.repos.length ? skeleton(4) : `<div class="cards">${list.slice(0, 12).map(repoCard).join('') || `<p class="empty">${esc(t('empty.repos'))}</p>`}</div>`}
          ${list.length > 12 ? `<p class="hint">${esc(t('proj.more', { n: nf(list.length - 12) }))}</p>` : ''}`;
      }
    }];
    list.forEach(r => items.push({
      id: 'repo:' + r.name, icon: 'repo', title: r.name,
      sub: [r.language, r.stargazers_count ? `★ ${nf(r.stargazers_count)}` : ''].filter(Boolean).join('   ') || (r.fork ? t('repo.fork') : t('repo.noLang')),
      repo: r, render: () => repoDetail(r), after: p => loadRepoExtras(r, p), enter: () => go(r.html_url)
    }));
    return items;
  }

  function repoDetail(r) {
    const cloneCmd = `git clone https://github.com/${C.username}/${r.name}.git`;
    const lic = r.license && r.license.spdx_id && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : '';
    return `<div class="kicker">${r.language ? `<i class="dot" style="background:${langColor(r.language)}"></i>${esc(r.language)}` : esc(t('repo.noLang'))}${r.fork ? ` — ${esc(t('repo.fork'))}` : ''}</div>
      <h2 class="repo-name">${esc(r.name)}</h2>
      <p class="lead">${esc(repoDesc(r))}</p>
      <ul class="facts">
        <li>${icon('star')}<b>${nf(r.stargazers_count || 0)}</b> ${esc(t('repo.stars'))}</li>
        <li>${icon('fork2')}<b>${nf(r.forks_count || 0)}</b> ${esc(t('repo.forks'))}</li>
        <li>${icon('issue')}<b>${nf(r.open_issues_count || 0)}</b> ${esc(t('repo.issues'))}</li>
        ${r.pushed_at ? `<li>${icon('clock')}${esc(t('repo.updated'))} <b>${esc(ago(r.pushed_at))}</b></li>` : ''}
        ${lic ? `<li>${icon('tag')}${esc(lic)}</li>` : ''}
      </ul>
      ${r.fallback ? '' : `<div class="block"><h3>${esc(t('repo.languages'))}</h3><div data-slot="langs">${skeleton(1)}</div></div>`}
      ${(r.topics || []).length ? `<div class="chips">${r.topics.map(x => `<a class="chip" href="${ghUser()}?tab=repositories&q=topic%3A${encodeURIComponent(x)}" target="_blank" rel="noopener noreferrer">${esc(x)}</a>`).join('')}</div>` : ''}
      ${r.fallback ? '' : `<div class="block"><h3>${esc(t('repo.readme'))}</h3><div class="readme" data-slot="readme">${skeleton(2)}</div></div>`}
      <div class="actions">${link(t('btn.openRepo'), r.html_url, 'primary', 'github')}${safeUrl(r.homepage) ? link(t('btn.liveSite'), r.homepage, '', 'globe') : ''}${r.fallback ? '' : btn(esc(t('btn.copyClone')) + icon('copy'), `data-act="copy" data-text="${esc(cloneCmd)}"`)}</div>`;
  }

  function readmeExcerpt(md, name) {
    const lines = String(md)
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/[*_`>|]/g, '')
      .split(/\r?\n/).map(s => s.trim()).filter(s => s && !/^[-=]{3,}$/.test(s) && s.toLowerCase() !== name.toLowerCase());
    let out = '', n = 0;
    for (const ln of lines) { if (out.length + ln.length > 460 || n >= 5) break; out += (out ? '\n' : '') + ln; n++; }
    return out || lines[0]?.slice(0, 300) || '';
  }

  function loadRepoExtras(r, panel) {
    if (r.fallback) return;
    const token = S.token;
    const slot = n => (token === S.token ? $(`[data-slot="${n}"]`, panel) : null);
    gh(`/repos/${C.username}/${encodeURIComponent(r.name)}/languages`).then(map => {
      const el = slot('langs'); if (!el) return;
      el.innerHTML = Object.keys(map).length ? langBar(map) : `<p class="empty">${esc(t('repo.noLangData'))}</p>`;
    }).catch(() => { const el = slot('langs'); if (el) el.innerHTML = `<p class="empty">${esc(t('err.section'))}</p>`; });
    gh(`/repos/${C.username}/${encodeURIComponent(r.name)}/readme`, { raw: true }).then(md => {
      const el = slot('readme'); if (!el) return;
      const ex = readmeExcerpt(md, r.name);
      el.innerHTML = ex ? ex.split('\n').map(l => `<p>${esc(l)}</p>`).join('') : `<p class="empty">${esc(t('repo.noReadme'))}</p>`;
    }).catch(e => { const el = slot('readme'); if (el) el.innerHTML = `<p class="empty">${esc(e.status === 404 ? t('repo.noReadme') : t('err.section'))}</p>`; });
  }

  /* ---- Stack */
  function stackItems() {
    const langs = languageCounts();
    const items = [{
      id: 'overview', icon: 'layers', title: t('stack.overview'), sub: t('stack.count', { n: nf(langs.length) }),
      render: () => {
        const map = Object.fromEntries(langs);
        return `<div class="kicker">${esc(t('stack.overview'))}</div><h2>${esc(t('stack.title'))}</h2><p class="lead">${esc(t('stack.text'))}</p>
          ${langs.length ? langBar(map) : (S.status === 'loading' ? skeleton(2) : `<p class="empty">${esc(t('empty.langs'))}</p>`)}`;
      }
    }];
    langs.slice(0, 8).forEach(([name, count]) => items.push({
      id: 'lang:' + name, icon: 'terminal', title: name, sub: t('stack.repos', { n: nf(count) }),
      render: () => {
        const rs = baseRepos().filter(r => r.language === name).sort(sorters.updated);
        return `<div class="kicker"><i class="dot" style="background:${langColor(name)}"></i>${esc(t('stack.language'))}</div><h2>${esc(name)}</h2><p class="lead">${esc(t('stack.repos', { n: nf(count) }))}</p><div class="cards">${rs.map(repoCard).join('')}</div>`;
      }
    }));
    items.push({
      id: 'topics', icon: 'hash', title: t('stack.topics'), sub: '',
      render: () => {
        const tp = {};
        baseRepos().forEach(r => (r.topics || []).forEach(x => { tp[x] = (tp[x] || 0) + 1; }));
        const ents = Object.entries(tp).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 40);
        return `<div class="kicker">${esc(t('stack.topics'))}</div><h2>${esc(t('stack.topics.title'))}</h2>
          <div class="chips">${ents.map(([x, n]) => `<a class="chip" href="${ghUser()}?tab=repositories&q=topic%3A${encodeURIComponent(x)}" target="_blank" rel="noopener noreferrer">${esc(x)} <span>${nf(n)}</span></a>`).join('') || `<p class="empty">${esc(t('empty.topics'))}</p>`}</div>
          ${ents.length ? '' : `<p class="hint">${esc(t('stack.topics.hint'))}</p>`}`;
      }
    });
    return items;
  }

  /* ---- Activity */
  function eventLine(e) {
    const repo = (e.repo && e.repo.name || '').replace(`${C.username}/`, '');
    const p = e.payload || {};
    switch (e.type) {
      case 'PushEvent': { const n = p.size ?? (p.commits || []).length ?? 0; return { ic: 'pulse', text: t('ev.push', { n: nf(n), repo }), url: `https://github.com/${e.repo.name}` }; }
      case 'CreateEvent': return { ic: 'box', text: t('ev.create', { what: p.ref_type === 'repository' ? t('ev.repository') : `${p.ref_type} ${p.ref || ''}`.trim(), repo }), url: `https://github.com/${e.repo.name}` };
      case 'WatchEvent': return { ic: 'star', text: t('ev.star', { repo }), url: `https://github.com/${e.repo.name}` };
      case 'ForkEvent': return { ic: 'fork2', text: t('ev.fork', { repo }), url: `https://github.com/${e.repo.name}` };
      case 'ReleaseEvent': return { ic: 'tag', text: t('ev.release', { repo }), url: `https://github.com/${e.repo.name}` };
      case 'IssuesEvent': return { ic: 'issue', text: t('ev.issue', { repo }), url: `https://github.com/${e.repo.name}` };
      case 'PullRequestEvent': return { ic: 'fork2', text: t('ev.pr', { repo }), url: `https://github.com/${e.repo.name}` };
      case 'PublicEvent': return { ic: 'globe', text: t('ev.public', { repo }), url: `https://github.com/${e.repo.name}` };
      default: return { ic: 'pulse', text: t('ev.other', { repo }), url: `https://github.com/${e.repo.name}` };
    }
  }
  function activityItems() {
    return [
      {
        id: 'feed', icon: 'pulse', title: t('act.feed'), sub: t('act.feed.sub'),
        render: () => {
          let body;
          if (S.events === null) body = skeleton(4);
          else if (!S.events.length) body = `<p class="empty">${esc(t('act.empty'))}</p>`;
          else body = `<ul class="feed">${S.events.slice(0, 12).map(e => { const l = eventLine(e); return `<li><span class="row-ic">${icon(l.ic)}</span><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.text)}</a><time>${esc(ago(e.created_at))}</time></li>`; }).join('')}</ul>`;
          return `<div class="kicker">${esc(t('act.feed'))}</div><h2>${esc(t('act.feed.title'))}</h2>${body}`;
        }
      },
      {
        id: 'timeline', icon: 'clock', title: t('act.timeline'), sub: t('act.timeline.sub'),
        render: () => {
          const rs = baseRepos().filter(r => r.pushed_at).sort(sorters.updated).slice(0, 8);
          return `<div class="kicker">${esc(t('act.timeline'))}</div><h2>${esc(t('act.timeline.title'))}</h2>
            ${rs.length ? `<ol class="timeline">${rs.map(r => `<li><time>${esc(ago(r.pushed_at))}</time><button type="button" class="linklike" data-act="goto" data-cat="projects" data-id="repo:${esc(r.name)}">${esc(r.name)}</button><span>${esc(repoDesc(r))}</span></li>`).join('')}</ol>` : (S.status === 'loading' ? skeleton(4) : `<p class="empty">${esc(t('empty.repos'))}</p>`)}`;
        }
      },
      {
        id: 'numbers', icon: 'layers', title: t('act.numbers'), sub: t('act.numbers.sub'),
        render: () => {
          const rs = baseRepos();
          const top = languageCounts()[0];
          const last = [...rs].sort(sorters.updated)[0];
          return `<div class="kicker">${esc(t('act.numbers'))}</div><h2>${esc(t('act.numbers.title'))}</h2>
            <div class="stats wrap">${stat(S.profile ? S.profile.public_repos : NaN, t('stat.repos'))}${stat(S.profile ? totalStars() : NaN, t('stat.stars'))}${stat(S.profile ? totalForks() : NaN, t('stat.forks'))}${stat(S.profile ? languageCounts().length : NaN, t('stat.languages'))}</div>
            <ul class="facts col">
              ${S.profile && S.profile.created_at ? `<li>${icon('user')}${esc(t('act.since'))} <b>${esc(monthYear(S.profile.created_at))}</b></li>` : ''}
              ${top ? `<li>${icon('terminal')}${esc(t('act.topLang'))} <b>${esc(top[0])}</b></li>` : ''}
              ${last && last.pushed_at ? `<li>${icon('clock')}${esc(t('act.lastPush'))} <b>${esc(last.name)}</b>, ${esc(ago(last.pushed_at))}</li>` : ''}
            </ul>`;
        }
      }
    ];
  }

  /* ---- About */
  function aboutItems() {
    return [
      {
        id: 'profile', icon: 'user', title: t('about.profile'), sub: t('about.profile.sub'),
        render: () => {
          const p = S.profile || {};
          const row = (ic, label, val) => val ? `<li>${icon(ic)}<span>${esc(label)}</span><b>${val}</b></li>` : '';
          const site = safeUrl(p.blog && !/^https?:\/\//i.test(p.blog) ? 'https://' + p.blog : p.blog);
          return `<div class="hero-id big"><img class="avatar" src="${esc(safeUrl(p.avatar_url) || 'assets/avatar-placeholder.svg')}" alt="" width="72" height="72" decoding="async"><div><h2>${esc(p.name || L(C.name))}</h2><span>@${esc(C.username)}</span></div></div>
            <p class="lead">${esc(p.bio || t('home.bioFallback'))}</p>
            <ul class="facts col spaced">
              ${row('globe', t('about.location'), esc(p.location))}
              ${row('user', t('about.company'), esc(p.company))}
              ${row('link', t('about.website'), site ? `<a href="${esc(site)}" target="_blank" rel="noopener noreferrer">${esc(site.replace(/^https?:\/\//, ''))}</a>` : '')}
              ${row('clock', t('about.joined'), p.created_at ? esc(monthYear(p.created_at)) : '')}
            </ul>
            <div class="actions">${link(t('btn.github'), ghUser(), 'primary', 'github')}</div>`;
        }
      },
      {
        id: 'approach', icon: 'zap', title: t('about.approach'), sub: t('about.approach.sub'),
        render: () => `<div class="kicker">${esc(t('about.approach'))}</div><h2>${esc(L(C.approach.title))}</h2><p class="lead big">${esc(L(C.approach.text))}</p>`
      }
    ];
  }

  /* ---- Connect */
  function connectItems() {
    const items = [
      { id: 'github', icon: 'github', title: t('con.github'), sub: `@${C.username}`, url: ghUser() },
      { id: 'repos', icon: 'repo', title: t('con.repos'), sub: t('con.repos.sub'), url: `${ghUser()}?tab=repositories` },
      { id: 'readme', icon: 'user', title: t('con.readme'), sub: t('con.readme.sub'), url: `${ghUser()}/${C.username}` }
    ];
    const site = safeUrl(C.contact.website || (S.profile && S.profile.blog && (/^https?:\/\//i.test(S.profile.blog) ? S.profile.blog : 'https://' + S.profile.blog)) || '');
    if (site) items.push({ id: 'website', icon: 'globe', title: t('con.website'), sub: site.replace(/^https?:\/\//, ''), url: site });
    if (C.contact.email) items.push({ id: 'email', icon: 'mail', title: t('con.email'), sub: C.contact.email, url: `mailto:${C.contact.email}`, mail: true });
    const out = items.map(it => ({
      ...it,
      render: () => `<div class="kicker">${esc(t('con.kicker'))}</div><h2>${esc(it.title)}</h2><p class="lead">${esc(t('con.text'))}</p>
        <a class="linkcard" href="${esc(it.url)}" ${it.mail ? '' : 'target="_blank" rel="noopener noreferrer"'}><span>${esc(it.sub)}</span>${icon(it.mail ? 'mail' : 'ext')}</a>`,
      enter: () => (it.mail ? (location.href = it.url) : go(it.url))
    }));
    out.push({
      id: 'share', icon: 'share', title: t('con.share'), sub: t('con.share.sub'),
      render: () => `<div class="kicker">${esc(t('con.share'))}</div><h2>${esc(t('con.share.title'))}</h2><p class="lead">${esc(t('con.share.text'))}</p>
        <div class="actions">${btn(esc(t('btn.share')) + icon('share'), 'data-act="share"', 'primary')}${btn(esc(t('btn.copyLink')) + icon('copy'), 'data-act="copy-page"')}</div>`,
      enter: () => sharePage()
    });
    return out;
  }
  async function sharePage() {
    const data = { title: document.title, url: location.href.split('#')[0] };
    try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    copyText(data.url);
  }

  /* ---- Settings */
  const THEME_LABELS = { auto: 'theme.auto', ocean: 'theme.ocean', violet: 'theme.violet', emerald: 'theme.emerald', amber: 'theme.amber', rose: 'theme.rose', mono: 'theme.mono' };
  function themeHue(name) {
    if (name === 'auto') return [MONTH_HUES[new Date().getMonth()], 78];
    return THEMES[name];
  }
  function toggleOptions(key, val) {
    return `<div class="filters">${[[true, t('opt.on')], [false, t('opt.off')]].map(([v, l]) => `<button type="button" class="chip ${val === v ? 'on' : ''}" data-act="set" data-k="${key}" data-v="${v ? '1' : '0'}" aria-pressed="${val === v}">${esc(l)}</button>`).join('')}</div>`;
  }
  function settingsItems() {
    return [
      {
        id: 'language', icon: 'globe', title: t('set.language'), sub: S.lang === 'fa' ? 'فارسی' : 'English',
        render: () => `<div class="kicker">${esc(t('set.language'))}</div><h2>${esc(t('set.language.title'))}</h2><p class="lead">${esc(t('set.language.text'))}</p>
          <div class="filters">${[['en', 'English'], ['fa', 'فارسی']].map(([v, l]) => `<button type="button" class="chip big ${S.lang === v ? 'on' : ''}" data-act="set" data-k="lang" data-v="${v}" aria-pressed="${S.lang === v}">${l}</button>`).join('')}</div>`,
        enter: () => setSetting('lang', S.lang === 'en' ? 'fa' : 'en')
      },
      {
        id: 'theme', icon: 'palette', title: t('set.theme'), sub: t(THEME_LABELS[S.theme]),
        render: () => `<div class="kicker">${esc(t('set.theme'))}</div><h2>${esc(t('set.theme.title'))}</h2><p class="lead">${esc(t('set.theme.text'))}</p>
          <div class="swatches" role="group" aria-label="${esc(t('set.theme'))}">${Object.keys(THEMES).map(k => { const [h, s] = themeHue(k); return `<button type="button" class="swatch ${S.theme === k ? 'on' : ''}" data-act="set" data-k="theme" data-v="${k}" aria-pressed="${S.theme === k}"><i style="background:linear-gradient(135deg,hsl(${h} ${s}% 62%),hsl(${h + 30} ${s}% 28%))"></i><span>${esc(t(THEME_LABELS[k]))}</span></button>`; }).join('')}</div>`,
        enter: () => { const k = Object.keys(THEMES); setSetting('theme', k[(k.indexOf(S.theme) + 1) % k.length]); }
      },
      {
        id: 'motion', icon: 'zap', title: t('set.motion'), sub: S.motion ? t('opt.on') : t('opt.off'),
        render: () => `<div class="kicker">${esc(t('set.motion'))}</div><h2>${esc(t('set.motion.title'))}</h2><p class="lead">${esc(t('set.motion.text'))}</p>${toggleOptions('motion', S.motion)}`,
        enter: () => setSetting('motion', S.motion ? '0' : '1')
      },
      {
        id: 'sound', icon: 'volume', title: t('set.sound'), sub: S.sound ? t('opt.on') : t('opt.off'),
        render: () => `<div class="kicker">${esc(t('set.sound'))}</div><h2>${esc(t('set.sound.title'))}</h2><p class="lead">${esc(t('set.sound.text'))}</p>${toggleOptions('sound', S.sound)}`,
        enter: () => setSetting('sound', S.sound ? '0' : '1')
      },
      {
        id: 'forks', icon: 'fork2', title: t('set.forks'), sub: S.forks ? t('opt.on') : t('opt.off'),
        render: () => `<div class="kicker">${esc(t('set.forks'))}</div><h2>${esc(t('set.forks.title'))}</h2><p class="lead">${esc(t('set.forks.text'))}</p>${toggleOptions('forks', S.forks)}`,
        enter: () => setSetting('forks', S.forks ? '0' : '1')
      },
      {
        id: 'about', icon: 'help', title: t('set.about'), sub: `v${VERSION}`,
        render: () => `<div class="kicker">${esc(t('set.about'))}</div><h2>${esc(t('set.about.title'))}</h2><p class="lead">${esc(t('set.about.text'))}</p>
          <ul class="facts col"><li>${icon('tag')}${esc(t('set.about.version'))} <b>${VERSION}</b></li><li>${icon('globe')}${esc(t('set.about.data'))}</li><li>${icon('check')}${esc(t('set.about.privacy'))}</li></ul>
          <p class="hint">${esc(t('foot.disc'))}</p>`
      }
    ];
  }

  const CATS = [
    { id: 'home', icon: 'home', items: homeItems },
    { id: 'projects', icon: 'box', items: projectsItems },
    { id: 'stack', icon: 'layers', items: stackItems },
    { id: 'activity', icon: 'pulse', items: activityItems },
    { id: 'about', icon: 'user', items: aboutItems },
    { id: 'connect', icon: 'link', items: connectItems },
    { id: 'settings', icon: 'sliders', items: settingsItems }
  ];
  const catIndex = () => CATS.findIndex(c => c.id === S.cat);

  /* --------------------------------------------------------------- settings */
  function setSetting(k, v) {
    if (k === 'lang') { S.lang = v; store.set('lang', v); applyLang(); }
    else if (k === 'theme') { if (THEMES[v] === undefined) return; S.theme = v; store.set('theme', v); applyTheme(); }
    else if (k === 'motion') { S.motion = v === '1'; store.set('motion', v); applyMotion(); }
    else if (k === 'sound') { S.sound = v === '1'; store.set('sound', v); if (S.sound) blip(760); }
    else if (k === 'forks') { S.forks = v === '1'; store.set('forks', v); }
    rebuildAll();
  }
  function applyTheme() {
    const [h, s] = themeHue(S.theme);
    const root = document.documentElement;
    root.style.setProperty('--h', h); root.style.setProperty('--s', s + '%');
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = `hsl(${h} ${Math.round(s * .7)}% 8%)`;
    if (window.XMBWave) XMBWave.setColor(h, s);
  }
  function applyMotion() {
    document.body.classList.toggle('no-motion', !S.motion);
    if (window.XMBWave) XMBWave.setMotion(S.motion);
  }
  function applyLang() {
    const root = document.documentElement;
    root.lang = S.lang; root.dir = isRTL() ? 'rtl' : 'ltr';
    root.style.setProperty('--dir', isRTL() ? -1 : 1);
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nLabel)); el.title = t(el.dataset.i18nLabel); });
    const ph = $('#palette-input'); if (ph) ph.placeholder = t('pal.placeholder');
    document.title = `${L(C.name)} — ${t('app.title')}`;
    $('#btn-lang-text').textContent = S.lang === 'fa' ? 'EN' : 'فا';
    renderHelp();
  }

  /* ---------------------------------------------------------------- render */
  const els = {};
  function renderStatus() {
    const map = { loading: 'status.loading', connected: 'status.connected', cached: 'status.cached', limited: 'status.limited', offline: 'status.offline' };
    els.status.dataset.state = S.status;
    $('#status-text').textContent = t(map[S.status]);
  }

  function renderRail() {
    els.rail.innerHTML = CATS.map((c, i) => `<button type="button" class="cat" role="tab" id="cat-${c.id}" data-cat="${c.id}" aria-selected="false" tabindex="-1">${icon(c.icon)}<span>${esc(t('cat.' + c.id))}</span></button>`).join('');
    updateRail();
  }
  function updateRail() {
    const ci = catIndex();
    els.xmb.style.setProperty('--ci', ci);
    $$('.cat', els.rail).forEach((b, i) => {
      const on = i === ci;
      b.classList.toggle('active', on); b.classList.toggle('before', i < ci);
      b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
    });
    const active = $('.cat.active', els.rail);
    if (active && window.matchMedia('(max-width: 859px)').matches && active.scrollIntoView) {
      active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: S.motion ? 'smooth' : 'auto' });
    }
  }

  function renderMenu() {
    const cat = CATS[catIndex()];
    S.items = cat.items();
    if (S.sel >= S.items.length) S.sel = Math.max(0, S.items.length - 1);
    els.items.innerHTML = S.items.map((it, i) => `<button type="button" class="item" role="option" id="item-${i}" data-i="${i}" aria-selected="false" tabindex="-1">
      <span class="item-ic">${icon(it.icon)}</span><span class="item-tx"><b>${esc(it.title)}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span></button>`).join('');
    els.items.setAttribute('aria-label', t('cat.' + cat.id));
    updateSelection();
  }
  function updateSelection() {
    els.xmb.style.setProperty('--sel', S.sel);
    $$('.item', els.items).forEach((b, i) => {
      const on = i === S.sel;
      b.style.setProperty('--d', Math.abs(i - S.sel));
      b.classList.toggle('selected', on); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
    });
    els.items.setAttribute('aria-activedescendant', 'item-' + S.sel);
    const cur = $('.item.selected', els.items);
    if (cur && window.matchMedia('(max-width: 859px)').matches && cur.scrollIntoView && els.items.scrollIntoView) { /* list is static on mobile */ }
    $('#item-count').textContent = `${nf(S.sel + 1)} / ${nf(S.items.length)}`;
  }

  function renderDetail(animate = true) {
    const item = S.items[S.sel];
    if (!item) { els.detail.innerHTML = ''; return; }
    S.token++;
    els.detail.innerHTML = `<div class="panel ${animate && S.motion ? 'enter' : ''}">${item.render()}</div>`;
    els.detail.scrollTop = 0;
    animateCounts(els.detail);
    if (item.after) item.after(els.detail);
    $('#sr').textContent = item.title;
    try { history.replaceState(null, '', `#${S.cat}/${encodeURIComponent(item.id)}`); } catch { /* ignore */ }
  }
  function animateCounts(root) {
    $$('[data-count]', root).forEach(el => {
      const to = Number(el.dataset.count);
      if (!S.motion || to < 2) { el.textContent = nf(to); return; }
      const start = performance.now(), dur = 900;
      const step = now => {
        const k = Math.min(1, (now - start) / dur);
        el.textContent = nf(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1 && el.isConnected) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /** Rebuild the rail, the item list and the detail (after language / data / filter changes). */
  function rebuildAll() {
    const keep = S.items[S.sel] && S.items[S.sel].id;
    renderRail();
    const cat = CATS[catIndex()];
    const idx = keep ? cat.items().findIndex(i => i.id === keep) : -1;
    if (idx >= 0) S.sel = idx;
    renderMenu(); renderDetail(false);
    $('#foot-hint').textContent = t('foot.hint');
    $('#foot-disc').textContent = t('foot.disc');
    renderStatus();
  }
  /** Refresh only the detail panel (used when async data arrives). */
  function refreshCurrent() { if (S.items.length) { renderMenu(); renderDetail(false); } }

  /* ------------------------------------------------------------ navigation */
  function selectCategory(id, sel = 0) {
    if (!CATS.some(c => c.id === id)) return;
    S.cat = id; S.sel = sel;
    updateRail(); renderMenu(); renderDetail(true);
    blip(520);
  }
  function goTo(catId, itemId) {
    S.cat = catId;
    const items = CATS[catIndex()].items();
    const i = itemId ? items.findIndex(x => x.id === itemId) : 0;
    selectCategory(catId, Math.max(0, i));
  }
  const moveCat = d => { const n = CATS.length; const i = catIndex(); const j = Math.max(0, Math.min(n - 1, i + d)); if (j !== i) selectCategory(CATS[j].id, 0); };
  const moveItem = d => { const j = Math.max(0, Math.min(S.items.length - 1, S.sel + d)); if (j !== S.sel) { S.sel = j; updateSelection(); renderDetail(true); blip(700, .05); } };
  function enter() { const it = S.items[S.sel]; if (it && it.enter) it.enter(); else toast(t('toast.nothing')); }
  function back() { if (S.sel > 0) { S.sel = 0; updateSelection(); renderDetail(true); } else if (S.cat !== 'home') selectCategory('home'); }

  function parseHash() {
    const m = decodeURIComponent(location.hash.replace(/^#/, '')).split('/');
    const cat = m[0], id = m.slice(1).join('/');
    if (CATS.some(c => c.id === cat)) {
      S.cat = cat;
      const items = CATS[catIndex()].items();
      let i = id ? items.findIndex(x => x.id === id) : 0;
      if (i < 0 && id) i = items.findIndex(x => x.id === 'repo:' + id); // short links like #projects/QuickCD
      S.sel = Math.max(0, i); return true;
    }
    return false;
  }

  /* ----------------------------------------------------------------- utils */
  let toastTimer;
  function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200); }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); toast(t('toast.copied')); }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'sr-only'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(t('toast.copied')); } catch { toast(text); }
      ta.remove();
    }
  }

  /* --------------------------------------------------- overlays (search/help) */
  let palette = { open: false, results: [], sel: 0 };
  function allEntries() {
    return CATS.flatMap(c => c.items().map(it => ({ cat: c.id, id: it.id, icon: it.icon, title: it.title, sub: t('cat.' + c.id), hay: `${it.title} ${it.sub || ''} ${(it.repo && L(it.repo.description)) || ''} ${t('cat.' + c.id)}`.toLowerCase() })));
  }
  function openPalette() {
    palette.open = true; $('#palette').hidden = false; document.body.classList.add('modal');
    const inp = $('#palette-input'); inp.value = ''; renderPalette(''); inp.focus();
  }
  function closePalette() { palette.open = false; $('#palette').hidden = true; document.body.classList.remove('modal'); }
  function renderPalette(q) {
    const all = allEntries();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    palette.results = (terms.length ? all.filter(e => terms.every(x => e.hay.includes(x))) : all).slice(0, 40);
    palette.sel = 0; paintPalette();
  }
  function paintPalette() {
    const ul = $('#palette-list');
    ul.innerHTML = palette.results.map((e, i) => `<li role="option" id="pal-${i}" class="${i === palette.sel ? 'on' : ''}" aria-selected="${i === palette.sel}" data-i="${i}">${icon(e.icon)}<b>${esc(e.title)}</b><span>${esc(e.sub)}</span></li>`).join('') || `<li class="none">${esc(t('pal.none'))}</li>`;
    $('#palette-input').setAttribute('aria-activedescendant', palette.results.length ? 'pal-' + palette.sel : '');
    const on = $('.on', ul); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
  }
  function pickPalette(i) { const e = palette.results[i]; if (!e) return; closePalette(); goTo(e.cat, e.id); }
  function renderHelp() { const b = $('#help-body'); if (b) b.innerHTML = shortcutsHtml(); }
  const openHelp = () => { $('#help').hidden = false; document.body.classList.add('modal'); $('#help-close').focus(); };
  const closeHelp = () => { $('#help').hidden = true; document.body.classList.remove('modal'); };

  /* --------------------------------------------------------------- input */
  function onKey(e) {
    if (e.defaultPrevented) return;
    if (palette.open) {
      if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); palette.sel = Math.min(palette.results.length - 1, palette.sel + 1); paintPalette(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); palette.sel = Math.max(0, palette.sel - 1); paintPalette(); }
      else if (e.key === 'Enter') { e.preventDefault(); pickPalette(palette.sel); }
      else if (e.key === 'Tab') e.preventDefault();
      return;
    }
    if (!$('#help').hidden) { if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); closeHelp(); } return; }
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openPalette(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    const dir = isRTL() ? -1 : 1;
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); moveCat(dir); break;
      case 'ArrowLeft': e.preventDefault(); moveCat(-dir); break;
      case 'ArrowDown': e.preventDefault(); moveItem(1); break;
      case 'ArrowUp': e.preventDefault(); moveItem(-1); break;
      case 'PageDown': e.preventDefault(); moveItem(5); break;
      case 'PageUp': e.preventDefault(); moveItem(-5); break;
      case 'Home': e.preventDefault(); moveItem(-999); break;
      case 'End': e.preventDefault(); moveItem(999); break;
      case 'Enter': if (tag === 'BUTTON' || tag === 'A') return; e.preventDefault(); enter(); break;
      case 'Escape': case 'Backspace': if (tag === 'BUTTON' && e.key === 'Backspace') return; e.preventDefault(); back(); break;
      case '/': e.preventDefault(); openPalette(); break;
      case '?': e.preventDefault(); openHelp(); break;
      case 'l': case 'L': setSetting('lang', S.lang === 'en' ? 'fa' : 'en'); break;
      case 't': case 'T': { const k = Object.keys(THEMES); setSetting('theme', k[(k.indexOf(S.theme) + 1) % k.length]); toast(t('toast.theme', { name: t(THEME_LABELS[S.theme]) })); break; }
      default:
        if (/^[1-7]$/.test(e.key)) selectCategory(CATS[Number(e.key) - 1].id, 0);
    }
  }

  function onClick(e) {
    const catBtn = e.target.closest('.cat');
    if (catBtn) { selectCategory(catBtn.dataset.cat, 0); return; }
    const itemBtn = e.target.closest('.item');
    if (itemBtn) { const i = Number(itemBtn.dataset.i); if (i === S.sel && itemBtn.dataset.again) { enter(); return; } S.sel = i; updateSelection(); renderDetail(true); blip(700, .05); return; }
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const act = a.dataset.act;
    if (act === 'goto') goTo(a.dataset.cat, a.dataset.id);
    else if (act === 'copy') copyText(a.dataset.text);
    else if (act === 'copy-page') copyText(location.href.split('#')[0]);
    else if (act === 'share') sharePage();
    else if (act === 'retry') loadAll(true);
    else if (act === 'sort') { S.sort = a.dataset.v; store.set('sort', S.sort); rebuildAll(); }
    else if (act === 'lf') { S.langFilter = a.dataset.v; rebuildAll(); }
    else if (act === 'set') setSetting(a.dataset.k, a.dataset.v);
  }

  function bindInput() {
    document.addEventListener('keydown', onKey);
    $('#xmb').addEventListener('click', onClick);

    // Wheel moves the selection on desktop; mobile keeps normal page scrolling.
    let wheelAcc = 0;
    els.items.addEventListener('wheel', e => {
      if (window.matchMedia('(max-width: 859px)').matches) return;
      wheelAcc += e.deltaY;
      if (Math.abs(wheelAcc) > 48) {
        const d = wheelAcc > 0 ? 1 : -1; wheelAcc = 0;
        const next = S.sel + d;
        if (next >= 0 && next < S.items.length) { e.preventDefault(); moveItem(d); }
      } else e.preventDefault();
    }, { passive: false });

    // Horizontal swipe changes category.
    let sx = 0, sy = 0, st = 0;
    els.xmb.addEventListener('touchstart', e => { const p = e.changedTouches[0]; sx = p.clientX; sy = p.clientY; st = Date.now(); }, { passive: true });
    els.xmb.addEventListener('touchend', e => {
      const p = e.changedTouches[0]; const dx = p.clientX - sx, dy = p.clientY - sy;
      if (Date.now() - st < 600 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8 && !e.target.closest('.rail, .filters, .swatches')) moveCat(dx < 0 ? (isRTL() ? -1 : 1) : (isRTL() ? 1 : -1));
    }, { passive: true });

    $('#btn-search').addEventListener('click', openPalette);
    $('#btn-help').addEventListener('click', openHelp);
    $('#help-close').addEventListener('click', closeHelp);
    $('#help').addEventListener('click', e => { if (e.target.id === 'help') closeHelp(); });
    $('#btn-lang').addEventListener('click', () => setSetting('lang', S.lang === 'en' ? 'fa' : 'en'));
    $('#btn-refresh').addEventListener('click', () => { toast(t('toast.refreshing')); loadAll(true); });
    $('#btn-full').addEventListener('click', () => {
      try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch { toast(t('toast.nofs')); }
    });
    $('#palette').addEventListener('click', e => { if (e.target.id === 'palette') closePalette(); const li = e.target.closest('li[data-i]'); if (li) pickPalette(Number(li.dataset.i)); });
    $('#palette-input').addEventListener('input', e => renderPalette(e.target.value));
    window.addEventListener('hashchange', () => { if (parseHash()) { updateRail(); renderMenu(); renderDetail(true); } });

    // Gamepad: D-pad / left stick to move, A to open, B to go back.
    let prev = {}, padOn = false;
    const poll = () => {
      const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
      const p = [...pads].find(Boolean);
      if (p) {
        const b = i => !!(p.buttons[i] && p.buttons[i].pressed);
        const ax = p.axes || [];
        const cur = { up: b(12) || ax[1] < -0.6, down: b(13) || ax[1] > 0.6, left: b(14) || ax[0] < -0.6, right: b(15) || ax[0] > 0.6, a: b(0), b: b(1), lb: b(4), rb: b(5) };
        if (!palette.open && $('#help').hidden) {
          const dir = isRTL() ? -1 : 1;
          if (cur.up && !prev.up) moveItem(-1);
          if (cur.down && !prev.down) moveItem(1);
          if ((cur.right && !prev.right) || (cur.rb && !prev.rb)) moveCat(dir);
          if ((cur.left && !prev.left) || (cur.lb && !prev.lb)) moveCat(-dir);
          if (cur.a && !prev.a) enter();
          if (cur.b && !prev.b) back();
        }
        prev = cur;
      }
      if (padOn) requestAnimationFrame(poll);
    };
    window.addEventListener('gamepadconnected', () => { if (!padOn) { padOn = true; toast(t('toast.pad')); requestAnimationFrame(poll); } });
    window.addEventListener('gamepaddisconnected', () => { padOn = false; });
  }

  /* ---------------------------------------------------------------- boot */
  function updateClock() { $('#clock').textContent = new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit' }).format(new Date()); }

  function bootSplash() {
    const el = $('#boot');
    let seen = false;
    try { seen = sessionStorage.getItem('xmb:booted') === '1'; } catch { /* ignore */ }
    if (seen || !S.motion) { el.remove(); return; }
    document.body.classList.add('booting');
    const done = () => { document.body.classList.remove('booting'); el.classList.add('out'); setTimeout(() => el.remove(), 600); document.removeEventListener('keydown', done); document.removeEventListener('pointerdown', done); };
    try { sessionStorage.setItem('xmb:booted', '1'); } catch { /* ignore */ }
    setTimeout(done, 1500);
    document.addEventListener('keydown', done, { once: true });
    document.addEventListener('pointerdown', done, { once: true });
  }

  function init() {
    els.xmb = $('#xmb'); els.rail = $('#rail'); els.items = $('#items'); els.detail = $('#detail'); els.status = $('#status');
    $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
    applyLang(); applyTheme(); applyMotion();
    parseHash();
    renderRail(); renderMenu(); renderDetail(false); renderStatus();
    $('#foot-hint').textContent = t('foot.hint'); $('#foot-disc').textContent = t('foot.disc');
    $('#version').textContent = `v${VERSION}`;
    bindInput();
    updateClock(); setInterval(updateClock, 30000);
    bootSplash();
    loadAll(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
