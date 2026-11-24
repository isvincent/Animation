/* =========================================================
   動畫名稱與動畫效果 — 主程式
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const STYLES = window.STYLES, CATS = window.CATEGORIES, SRC = window.SOURCES;
  const byId = Object.fromEntries(STYLES.map(s => [s.id, s]));
  const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
  const catIcon = { bolt: 'i-bolt', scissors: 'i-scissors', star: 'i-starburst', cube: 'i-cube', pencil: 'i-pencil' };
  const EP = {};
  Object.entries(SRC).forEach(([ai, s]) => s.episodes.forEach(e => { EP[e.code] = { ...e, ai }; }));
  const aiOfCode = c => ({ C: 'claude', X: 'codex', A: 'antigravity' })[c[0]];

  /* ---------- 儲存（失敗時安靜略過） ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('anim-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('anim-' + k, JSON.stringify(v)); } catch (e) { /* 無痕模式 */ } }
  };

  /* ---------- 文字（中／英） ---------- */
  const I18N = {
    zh: {
      brand: '動畫名稱與動畫效果', 'settings.short': '設定',
      'nav.explore': '風格圖鑑', 'nav.quiz': '動畫小測驗', 'nav.prompt': '提示詞工坊', 'nav.sources': '完整影片',
      'hero.t1': '動畫名稱', 'hero.t2': '與動畫效果',
      'hero.lead': '把三種 AI 在 16 支說明影片裡介紹過的動畫風格，整理成一本會動的圖鑑：每個名稱都看得到效果，點一下就能複製，直接貼進你的提示詞。',
      'hero.hint': '點卡片看大圖・每 4 秒換一組',
      'stat.styles': '種動畫風格', 'stat.names': '個名稱與別名', 'stat.videos': '支說明影片', 'stat.ai': '種 AI 製作',
      'cta.explore': '開始探索', 'cta.random': '隨機抽一個', 'cta.quiz': '挑戰小測驗', 'cta.videos': '觀看 16 支完整影片',
      'progress': '已探索 {n} / {t} 種風格', 'progress.done': '全部解鎖！動畫風格大師',
      'explore.title': '風格圖鑑', 'explore.sub': '每張卡片都在播放該風格的動畫效果。點「複製名稱」就能貼進提示詞；點卡片畫面可看大圖與完整說明。',
      'search.ph': '搜尋名稱、別名或標籤…', 'filter.all': '全部', 'filter.fav': '我的收藏', 'filter.shuffle': '打亂順序', 'filter.clear': '清除篩選',
      'result': '顯示 {n} 種風格', 'result.ep': '｜篩選：{ep}', 'empty': '找不到符合的風格，換個關鍵字試試看！',
      'card.copy': '複製名稱', 'card.copied': '已複製！', 'card.open': '看大圖', 'card.alias': '又稱：',
      'm.replay': '重播', 'm.pause': '暫停', 'm.play': '播放', 'm.slow': '慢動作', 'm.copyEn': '複製英文名', 'm.copyPrompt': '複製提示詞',
      'm.effect': '動畫效果', 'm.use': '適用場景', 'm.tags': '關鍵標籤', 'm.aliases': '其他叫法（點一下複製）', 'm.seen': '出現在哪些影片',
      'quiz.title': '動畫小測驗', 'quiz.sub': '看動畫，猜猜它叫什麼名字！答對越多，連勝火焰越旺。',
      'quiz.score': '得分', 'quiz.streak': '連續答對', 'quiz.best': '最佳紀錄', 'quiz.next': '下一題', 'quiz.q': '第 {n} 題',
      'quiz.right': '答對了！這就是「{name}」', 'quiz.wrong': '差一點！正確答案是「{name}」',
      'prompt.title': '提示詞工坊', 'prompt.sub': '選一個動畫名稱、填入教學主題，就能組出可以直接貼給 AI 的提示詞。',
      'prompt.style': '動畫風格', 'prompt.topic': '教學主題', 'prompt.topic.ph': '例如：光合作用', 'prompt.len': '影片長度', 'prompt.ratio': '畫面比例',
      'prompt.out': '產生的提示詞', 'prompt.copy': '複製提示詞', 'prompt.defaultTopic': '光合作用',
      'prompt.tpl': '請用程式碼製作一段約 {len} 秒、畫面比例 {ratio} 的教學說明動畫。\n主題：{topic}\n動畫風格：「{name}」（{en}）\n風格重點：{desc}\n關鍵元素：{tags}\n請輸出單一 HTML 檔，開啟後自動播放並可循環，文字使用繁體中文。',
      'sources.title': '完整影片與來源', 'sources.sub': '三種 AI 各自製作的 16 支說明動畫影片。按「播放」觀看完整影片，或按「篩選」讓圖鑑只顯示該集介紹的風格。',
      'v.play': '播放', 'v.filter': '篩選風格', 'v.playAll': '從第 1 支開始連續播放', 'v.watched': '已看完 {n} / {t} 支影片', 'v.prev': '上一支', 'v.next': '下一支', 'v.auto': '自動播下一支',
      'v.styles': '本集介紹的風格（點一下看動畫效果）', 'v.list': '播放清單', 'v.nextUp': '接著播放：{t}', 'v.err': '找不到影片檔「{f}」。請確認 videos 資料夾與網頁放在一起（本機預覽請用 http 伺服器開啟）。',
      'sources.count': '{n} 種風格・{len}',
      'footer': '內容整理自資料夾中 Claude、Codex、Antigravity 製作的 16 支說明動畫影片；所有動畫示範皆以 CSS／SVG 重新繪製。',
      'tip.search': '搜尋', 'tip.random': '隨機', 'tip.nav': '切換風格', 'tip.close': '關閉',
      'settings.title': '顯示與操作設定', 'settings.reset': '恢復預設', 'settings.install': '安裝到主畫面',
      'set.fullscreen': '全螢幕', 'set.sound': '音效', 'set.device': '裝置', 'set.orient': '版面', 'set.lang': '語言', 'set.font': '字體', 'set.theme': '色系',
      'on': '開啟', 'off': '關閉', 'auto': '自動', 'phone': '手機', 'tablet': '平板', 'desktop': '電腦', 'portrait': '直式', 'landscape': '橫式',
      'sm': '縮小', 'md': '標準', 'lg': '放大', 'system': '跟隨系統', 'light': '亮色', 'dark': '暗色',
      'toast.copied': '已複製「{t}」', 'toast.prompt': '提示詞已複製，可以貼給 AI 了！', 'toast.fsno': '這個瀏覽器不支援全螢幕，請改用「加入主畫面」。',
      'toast.reset': '已恢復預設設定', 'toast.offline': '已可離線使用', 'toast.fav': '已加入收藏', 'toast.unfav': '已移出收藏', 'toast.done': '恭喜！58 種風格全部探索完成！'
    },
    en: {
      brand: 'Animation Names & Effects', 'settings.short': 'Settings',
      'nav.explore': 'Gallery', 'nav.quiz': 'Quiz', 'nav.prompt': 'Prompt Lab', 'nav.sources': 'Videos',
      'hero.t1': 'Animation Names', 'hero.t2': '& Their Effects',
      'hero.lead': 'Every animation style featured in 16 explainer videos made by three AIs — collected into a living gallery. See each effect move, tap to copy its name, and drop it straight into your prompt.',
      'hero.hint': 'Tap a card to enlarge · reshuffles every 4s',
      'stat.styles': 'animation styles', 'stat.names': 'names & aliases', 'stat.videos': 'explainer videos', 'stat.ai': 'AI makers',
      'cta.explore': 'Start exploring', 'cta.random': 'Surprise me', 'cta.quiz': 'Take the quiz', 'cta.videos': 'Watch all 16 videos',
      'progress': 'Explored {n} / {t} styles', 'progress.done': 'All unlocked! Style master',
      'explore.title': 'Style Gallery', 'explore.sub': 'Every card plays its style live. Tap “Copy name” to paste it into a prompt, or tap the preview for the full breakdown.',
      'search.ph': 'Search names, aliases or tags…', 'filter.all': 'All', 'filter.fav': 'Favorites', 'filter.shuffle': 'Shuffle', 'filter.clear': 'Clear filter',
      'result': 'Showing {n} styles', 'result.ep': ' · Filter: {ep}', 'empty': 'No matching styles — try another keyword!',
      'card.copy': 'Copy name', 'card.copied': 'Copied!', 'card.open': 'Enlarge', 'card.alias': 'Also: ',
      'm.replay': 'Replay', 'm.pause': 'Pause', 'm.play': 'Play', 'm.slow': 'Slow-mo', 'm.copyEn': 'Copy English', 'm.copyPrompt': 'Copy prompt',
      'm.effect': 'Effect', 'm.use': 'Best for', 'm.tags': 'Key tags', 'm.aliases': 'Also called (tap to copy)', 'm.seen': 'Featured in',
      'quiz.title': 'Animation Quiz', 'quiz.sub': 'Watch the animation and name the style! Build a streak to stoke the flame.',
      'quiz.score': 'Score', 'quiz.streak': 'Streak', 'quiz.best': 'Best', 'quiz.next': 'Next', 'quiz.q': 'Q{n}',
      'quiz.right': 'Correct! That’s “{name}”', 'quiz.wrong': 'So close! It’s “{name}”',
      'prompt.title': 'Prompt Lab', 'prompt.sub': 'Pick a style, add a topic, and get a ready-to-paste prompt for your AI.',
      'prompt.style': 'Animation style', 'prompt.topic': 'Lesson topic', 'prompt.topic.ph': 'e.g. Photosynthesis', 'prompt.len': 'Length', 'prompt.ratio': 'Aspect ratio',
      'prompt.out': 'Your prompt', 'prompt.copy': 'Copy prompt', 'prompt.defaultTopic': 'Photosynthesis',
      'prompt.tpl': 'Write code for a {len}-second explainer animation in {ratio} aspect ratio.\nTopic: {topic}\nAnimation style: “{en}” ({name})\nStyle notes: {desc}\nKey elements: {tags}\nOutput a single HTML file that autoplays and loops.',
      'sources.title': 'Full Videos & Sources', 'sources.sub': 'All 16 explainer videos made by the three AIs. Press Play to watch a full video, or Filter to show only the styles that episode covers.',
      'v.play': 'Play', 'v.filter': 'Filter styles', 'v.playAll': 'Play all from video 1', 'v.watched': 'Watched {n} / {t} videos', 'v.prev': 'Previous', 'v.next': 'Next', 'v.auto': 'Autoplay next',
      'v.styles': 'Styles in this episode (tap to see the effect)', 'v.list': 'Playlist', 'v.nextUp': 'Up next: {t}', 'v.err': 'Video file “{f}” not found. Keep the videos folder next to the page (use an http server for local preview).',
      'sources.count': '{n} styles · {len}',
      'footer': 'Compiled from 16 explainer videos by Claude, Codex and Antigravity in this folder. Every demo is redrawn with CSS/SVG.',
      'tip.search': 'Search', 'tip.random': 'Random', 'tip.nav': 'Switch style', 'tip.close': 'Close',
      'settings.title': 'Display & Controls', 'settings.reset': 'Reset', 'settings.install': 'Install app',
      'set.fullscreen': 'Fullscreen', 'set.sound': 'Sound', 'set.device': 'Device', 'set.orient': 'Layout', 'set.lang': 'Language', 'set.font': 'Text size', 'set.theme': 'Theme',
      'on': 'On', 'off': 'Off', 'auto': 'Auto', 'phone': 'Phone', 'tablet': 'Tablet', 'desktop': 'Desktop', 'portrait': 'Portrait', 'landscape': 'Landscape',
      'sm': 'Small', 'md': 'Normal', 'lg': 'Large', 'system': 'System', 'light': 'Light', 'dark': 'Dark',
      'toast.copied': 'Copied “{t}”', 'toast.prompt': 'Prompt copied — paste it into your AI!', 'toast.fsno': 'Fullscreen isn’t supported here. Try “Add to Home Screen”.',
      'toast.reset': 'Settings reset', 'toast.offline': 'Ready to work offline', 'toast.fav': 'Added to favorites', 'toast.unfav': 'Removed from favorites', 'toast.done': 'Amazing! You explored all 58 styles!'
    }
  };

  /* ---------- 設定 ---------- */
  const DEFAULTS = { fullscreen: 'off', sound: 'on', device: 'auto', orient: 'auto', lang: 'zh', font: 'md', theme: 'system' };
  const settings = Object.assign({}, DEFAULTS, store.get('settings', {}));
  settings.fullscreen = 'off';
  const L = () => settings.lang === 'en' ? 1 : 0;
  const t = (k, v = {}) => (I18N[settings.lang][k] ?? I18N.zh[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
  const nameOf = s => L() ? s.en : s.zh;
  const subOf = s => L() ? s.zh : s.en;
  const catName = c => L() ? c.en : c.zh;

  /* ---------- 音效（Web Audio 即時合成，不需音檔） ---------- */
  let actx = null;
  function ac() {
    if (!actx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; actx = new A(); }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone({ f = 440, to = null, type = 'sine', d = .12, v = .12, at = 0 }) {
    if (settings.sound !== 'on') return;
    const c = ac(); if (!c) return;
    const t0 = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + d);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + .012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + d + .05);
  }
  function noise(d = .15, v = .08, at = 0) {
    if (settings.sound !== 'on') return;
    const c = ac(); if (!c) return;
    const len = Math.floor(c.sampleRate * d), buf = c.createBuffer(1, len, c.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = c.createBufferSource(), g = c.createGain(); s.buffer = buf; g.gain.value = v;
    s.connect(g).connect(c.destination); s.start(c.currentTime + at);
  }
  const sfx = {
    click: () => tone({ f: 620, type: 'triangle', d: .06, v: .08 }),
    toggle: () => { tone({ f: 520, type: 'square', d: .05, v: .05 }); tone({ f: 780, type: 'square', d: .05, v: .05, at: .05 }); },
    copy: () => [660, 880, 1320].forEach((f, i) => tone({ f, type: 'triangle', d: .14, v: .1, at: i * .06 })),
    open: () => tone({ f: 280, to: 900, type: 'sine', d: .22, v: .1 }),
    close: () => tone({ f: 800, to: 260, type: 'sine', d: .18, v: .08 }),
    star: () => { tone({ f: 990, type: 'sine', d: .1, v: .1 }); tone({ f: 1480, type: 'sine', d: .18, v: .1, at: .08 }); },
    right: () => [523, 659, 784, 1046].forEach((f, i) => tone({ f, type: 'triangle', d: .18, v: .12, at: i * .08 })),
    wrong: () => { tone({ f: 220, to: 110, type: 'sawtooth', d: .3, v: .07 }); },
    shuffle: () => { for (let i = 0; i < 6; i++) tone({ f: 300 + Math.random() * 900, type: 'square', d: .04, v: .04, at: i * .04 }); },
    fanfare: () => [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone({ f, type: 'square', d: .16, v: .06, at: i * .1 })),
    cat: {
      light: () => { tone({ f: 300, to: 1600, type: 'sine', d: .35, v: .08 }); tone({ f: 1600, to: 2400, type: 'sine', d: .15, v: .04, at: .3 }); },
      craft: () => [523, 784, 659].forEach((f, i) => tone({ f, type: 'sine', d: .25, v: .12, at: i * .09 })),
      toon: () => { tone({ f: 180, to: 620, type: 'sine', d: .16, v: .14 }); tone({ f: 620, to: 260, type: 'sine', d: .16, v: .1, at: .14 }); },
      data: () => [880, 660, 990, 1320].forEach((f, i) => tone({ f, type: 'square', d: .06, v: .05, at: i * .07 })),
      teach: () => { noise(.12, .04); tone({ f: 1046, type: 'triangle', d: .3, v: .1, at: .1 }); tone({ f: 1318, type: 'triangle', d: .35, v: .08, at: .2 }); }
    }
  };

  /* ---------- 小工具 ---------- */
  const toastEl = $('#toast'); let toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2200); }
  const PALETTE = ['#ff5a5f', '#ffb703', '#10b49f', '#7b61ff', '#2f9bff', '#ff6fb5'];
  function burst(el) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !el) return;
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 16; i++) {
      const d = document.createElement('i'), a = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 60;
      d.className = 'burst-dot';
      d.style.cssText = `left:${cx}px;top:${cy}px;background:${PALETTE[i % 6]};--bx:${Math.cos(a) * dist}px;--by:${Math.sin(a) * dist - 20}px;--br:${Math.random() * 360}deg`;
      document.body.appendChild(d); setTimeout(() => d.remove(), 850);
    }
  }
  async function copyText(text, el, msg) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch (er) { ok = false; } ta.remove();
    }
    if (ok) { sfx.copy(); burst(el); toast(msg || t('toast.copied', { t: text })); if (el && el.classList.contains('btn')) flashDone(el); }
    else toast(text);
  }
  function flashDone(btn) {
    const span = btn.querySelector('span'); if (!span) return;
    const old = span.textContent; btn.classList.add('is-done'); span.textContent = t('card.copied');
    setTimeout(() => { btn.classList.remove('is-done'); span.textContent = old; }, 1300);
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  function hl(text, q) {
    const e = esc(text); if (!q) return e;
    const i = text.toLowerCase().indexOf(q.toLowerCase()); if (i < 0) return e;
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  const shuffleArr = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  /* 畫面外的動畫自動暫停，省電 */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('paused', !e.isIntersecting)), { rootMargin: '120px' }) : null;
  function mount(el, id, watch = true) { window.mountDemo(el, id); if (watch && io) io.observe(el); }

  /* ---------- 收藏與探索進度 ---------- */
  let favs = new Set(store.get('favs', []));
  let seen = new Set(store.get('seen', []));
  function markSeen(id) {
    if (seen.has(id)) return;
    seen.add(id); store.set('seen', [...seen]); updateProgress();
    const card = $(`.card[data-id="${id}"]`); if (card && !card.querySelector('.seen-mark')) card.insertAdjacentHTML('afterbegin', '<span class="seen-mark" aria-hidden="true"><svg><use href="#i-check"/></svg></span>');
    if (seen.size === STYLES.length) { sfx.fanfare(); toast(t('toast.done')); }
  }
  function updateProgress() {
    const n = [...seen].filter(id => byId[id]).length;
    $('#progressText').textContent = t('progress', { n, t: STYLES.length });
    $('#progressBar').style.width = (n / STYLES.length * 100) + '%';
    $('#progressBadge').hidden = n < STYLES.length;
  }
  function toggleFav(id, btn) {
    if (favs.has(id)) { favs.delete(id); toast(t('toast.unfav')); } else { favs.add(id); sfx.star(); toast(t('toast.fav')); }
    store.set('favs', [...favs]);
    $$(`[data-fav="${id}"]`).forEach(b => setStar(b, favs.has(id)));
    if (btn) setStar(btn, favs.has(id));
    $('#favCount').textContent = favs.size;
    if (state.fav) renderGrid();
  }
  function setStar(b, on) { b.setAttribute('aria-pressed', on); b.querySelector('use').setAttribute('href', on ? '#i-star-fill' : '#i-star'); }

  /* ---------- 圖鑑：篩選與渲染 ---------- */
  const state = { cat: 'all', ai: 'all', q: '', fav: false, ep: null, order: STYLES.map(s => s.id) };
  function filtered() {
    const q = state.q.trim().toLowerCase();
    return state.order.map(id => byId[id]).filter(s => {
      if (state.cat !== 'all' && s.cat !== state.cat) return false;
      if (state.ai !== 'all' && !s.src.some(c => aiOfCode(c) === state.ai)) return false;
      if (state.ep && !s.src.includes(state.ep)) return false;
      if (state.fav && !favs.has(s.id)) return false;
      if (q) {
        const hay = [s.zh, s.en, ...s.alias, ...s.t[0], ...s.t[1], s.d[0], s.d[1], s.u[0], s.u[1]].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }
  function srcDots(s) {
    const set = new Set(s.src.map(aiOfCode));
    return ['claude', 'codex', 'antigravity'].filter(a => set.has(a)).map(a => `<i class="${a[0] === 'a' ? 'a' : a[0] === 'c' && a[1] === 'l' ? 'c' : 'x'}" title="${SRC[a].zh}"></i>`).join('');
  }
  function cardHTML(s, i) {
    const c = catById[s.cat], q = state.q.trim();
    const alias = s.alias.length ? `<p class="alias">${t('card.alias')}${s.alias.map(a => hl(a, q)).join('、')}</p>` : '';
    return `<article class="card" data-id="${s.id}" data-cat="${s.cat}" style="--cc:${c.color};--n:${Math.min(i, 20)}">
      ${seen.has(s.id) ? '<span class="seen-mark" aria-hidden="true"><svg><use href="#i-check"/></svg></span>' : ''}
      <div class="demo" data-open="${s.id}" role="button" tabindex="0" aria-label="${esc(t('card.open') + '：' + nameOf(s))}"></div>
      <span class="open-hint"><svg><use href="#i-expand"/></svg>${t('card.open')}</span>
      <div class="card-body">
        <div class="card-top"><span class="pill"><svg><use href="#${catIcon[c.icon]}"/></svg>${catName(c)}</span><span class="srcdots">${srcDots(s)}</span></div>
        <h3>${hl(nameOf(s), q)}</h3>
        <p class="en">${hl(subOf(s), q)}</p>
        <p class="desc">${esc(s.d[L()])}</p>
        ${alias}
        <div class="card-actions">
          <button class="btn btn-copy" type="button" data-copy="${s.id}"><svg><use href="#i-copy"/></svg><span>${t('card.copy')}</span></button>
          <button class="icon-btn star-btn" type="button" data-fav="${s.id}" aria-pressed="${favs.has(s.id)}" aria-label="收藏 ${esc(s.zh)}"><svg><use href="#${favs.has(s.id) ? 'i-star-fill' : 'i-star'}"/></svg></button>
        </div>
      </div>
    </article>`;
  }
  const grid = $('#grid');
  function renderGrid() {
    const list = filtered();
    grid.innerHTML = list.map(cardHTML).join('');
    $$('.demo[data-open]', grid).forEach(el => mount(el, el.dataset.open));
    $('#empty').hidden = list.length > 0;
    let line = t('result', { n: list.length });
    if (state.ep) line += t('result.ep', { ep: L() ? EP[state.ep].en : EP[state.ep].zh });
    $('#resultCount').textContent = line;
    $('#clearFilter').hidden = !(state.ep || state.cat !== 'all' || state.ai !== 'all' || state.q || state.fav);
    $$('.ep').forEach(b => b.classList.toggle('on', b.dataset.ep === state.ep));
  }
  function renderChips() {
    const counts = {}; STYLES.forEach(s => counts[s.cat] = (counts[s.cat] || 0) + 1);
    const items = [{ id: 'all', name: t('filter.all'), color: 'var(--ink)', icon: 'i-grid', n: STYLES.length },
      ...CATS.map(c => ({ id: c.id, name: catName(c), color: c.color, icon: catIcon[c.icon], n: counts[c.id] }))];
    $('#catChips').innerHTML = items.map(c => `<button class="chip" role="tab" type="button" data-cat="${c.id}" aria-selected="${state.cat === c.id}" style="--cc:${c.color}"><span class="ci"><svg><use href="#${c.icon}"/></svg></span>${c.name}<b>${c.n}</b></button>`).join('');
    const ais = [['all', t('filter.all'), ''], ['claude', 'Claude', 'var(--ai-claude)'], ['codex', 'Codex', 'var(--ai-codex)'], ['antigravity', 'Antigravity', 'var(--ai-anti)']];
    $('#aiSeg').innerHTML = ais.map(a => `<button type="button" role="radio" data-ai="${a[0]}" aria-checked="${state.ai === a[0]}">${a[2] ? `<i class="d" style="background:${a[2]}"></i>` : ''}${a[1]}</button>`).join('');
  }

  $('#catChips').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; sfx.click(); state.cat = b.dataset.cat; renderChips(); renderGrid(); });
  $('#aiSeg').addEventListener('click', e => { const b = e.target.closest('[data-ai]'); if (!b) return; sfx.click(); state.ai = b.dataset.ai; state.ep = null; renderChips(); renderGrid(); });
  $('#favToggle').addEventListener('click', e => { state.fav = !state.fav; e.currentTarget.setAttribute('aria-pressed', state.fav); sfx.toggle(); renderGrid(); });
  $('#shuffleBtn').addEventListener('click', () => { state.order = shuffleArr(state.order); sfx.shuffle(); renderGrid(); });
  $('#clearFilter').addEventListener('click', () => {
    Object.assign(state, { cat: 'all', ai: 'all', q: '', fav: false, ep: null }); $('#search').value = ''; $('#favToggle').setAttribute('aria-pressed', 'false'); sfx.click(); renderChips(); renderGrid();
  });
  let searchT;
  $('#search').addEventListener('input', e => { clearTimeout(searchT); searchT = setTimeout(() => { state.q = e.target.value; renderGrid(); }, 160); });

  grid.addEventListener('click', e => {
    const cp = e.target.closest('[data-copy]'); if (cp) { const s = byId[cp.dataset.copy]; copyText(nameOf(s), cp); return; }
    const fv = e.target.closest('[data-fav]'); if (fv) { toggleFav(fv.dataset.fav, fv); return; }
    const op = e.target.closest('[data-open]'); if (op) openModal(op.dataset.open, filtered().map(s => s.id));
  });
  grid.addEventListener('keydown', e => { const op = e.target.closest('[data-open]'); if (op && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(op.dataset.open, filtered().map(s => s.id)); } });

  /* ---------- 詳細視窗 ---------- */
  const modal = $('#modal'); let mList = [], mIdx = 0, mPaused = false, mSlow = false;
  function openModal(id, list) {
    mList = list && list.length ? list : STYLES.map(s => s.id); mIdx = Math.max(0, mList.indexOf(id));
    if (!modal.open) { modal.showModal(); sfx.open(); }
    fillModal();
  }
  function fillModal() {
    const s = byId[mList[mIdx]], c = catById[s.cat];
    modal.style.setProperty('--cc', c.color);
    $('#mCat').innerHTML = `<span class="pill" style="--cc:${c.color}"><svg><use href="#${catIcon[c.icon]}"/></svg>${catName(c)}</span>`;
    $('#mName').textContent = nameOf(s); $('#mEn').textContent = subOf(s);
    $('#mDesc').textContent = s.d[L()]; $('#mUse').textContent = s.u[L()];
    $('#mTags').innerHTML = s.t[L()].map(x => `<span class="tag">#${esc(x)}</span>`).join('');
    $('#mAliasBlock').hidden = !s.alias.length;
    $('#mAliases').innerHTML = s.alias.map(a => `<button type="button" class="tag" data-copytext="${esc(a)}">${esc(a)}</button>`).join('');
    $('#mSrc').innerHTML = s.src.map(code => { const e = EP[code]; return `<li><button type="button" data-play="${code}" title="${esc(t('v.play'))}"><i style="background:${SRC[e.ai].color}">${SRC[e.ai].en}</i>${L() ? e.en : e.zh}<svg class="pv"><use href="#i-play"/></svg></button></li>`; }).join('');
    setStar($('#mFav'), favs.has(s.id)); $('#mFav').dataset.fav = s.id;
    mount($('#mDemo'), s.id, false);
    mPaused = false; setPauseBtn(); if (mSlow) requestAnimationFrame(() => setRate(.35));
    markSeen(s.id);
    (sfx.cat[s.cat] || sfx.open)();
  }
  const mAnims = () => (typeof $('#mDemo').getAnimations === 'function' ? $('#mDemo').getAnimations({ subtree: true }) : []);
  function setRate(r) { mAnims().forEach(a => { a.playbackRate = r; }); }
  function setPauseBtn() { const b = $('#mPause'); b.querySelector('use').setAttribute('href', mPaused ? '#i-play' : '#i-pause'); b.querySelector('span').textContent = t(mPaused ? 'm.play' : 'm.pause'); }
  function step(d) { mIdx = (mIdx + d + mList.length) % mList.length; sfx.click(); fillModal(); }
  $('#mPrev').addEventListener('click', () => step(-1));
  $('#mNext').addEventListener('click', () => step(1));
  $('#mClose').addEventListener('click', () => modal.close());
  modal.addEventListener('close', () => { sfx.close(); $('#mDemo').innerHTML = ''; });
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  $('#mReplay').addEventListener('click', () => { sfx.click(); const id = mList[mIdx]; mount($('#mDemo'), id, false); mPaused = false; setPauseBtn(); if (mSlow) requestAnimationFrame(() => setRate(.35)); });
  $('#mPause').addEventListener('click', () => { mPaused = !mPaused; sfx.toggle(); mAnims().forEach(a => mPaused ? a.pause() : a.play()); $('#mDemo').classList.toggle('paused', mPaused); setPauseBtn(); });
  $('#mSlow').addEventListener('click', e => { mSlow = !mSlow; e.currentTarget.setAttribute('aria-pressed', mSlow); sfx.toggle(); setRate(mSlow ? .35 : 1); });
  $('#mCopy').addEventListener('click', e => copyText(nameOf(byId[mList[mIdx]]), e.currentTarget));
  $('#mCopyEn').addEventListener('click', e => copyText(byId[mList[mIdx]].en, e.currentTarget));
  $('#mCopyPrompt').addEventListener('click', e => copyText(buildPrompt(byId[mList[mIdx]]), e.currentTarget, t('toast.prompt')));
  $('#mFav').addEventListener('click', e => toggleFav(e.currentTarget.dataset.fav, e.currentTarget));
  $('#mAliases').addEventListener('click', e => { const b = e.target.closest('[data-copytext]'); if (b) copyText(b.dataset.copytext, b); });
  // 手機左右滑動切換
  let tx = null;
  modal.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 70) step(dx < 0 ? 1 : -1); tx = null; });

  function openRandom() { const s = STYLES[Math.floor(Math.random() * STYLES.length)]; sfx.shuffle(); openModal(s.id, STYLES.map(x => x.id)); }
  $('#heroRandom').addEventListener('click', openRandom);

  /* ---------- 主視覺卡片輪播 ---------- */
  const fan = $('#heroFan'); let fanIds = shuffleArr(STYLES.map(s => s.id)), fanPtr = 0, fanTimer;
  function fanCard(id, cls) {
    const s = byId[id], el = document.createElement('div');
    el.className = 'fan-card ' + cls; el.dataset.id = id; el.setAttribute('role', 'button'); el.tabIndex = 0;
    el.innerHTML = `<div class="demo"></div><div class="fan-cap">${esc(nameOf(s))}<small>${esc(subOf(s))}</small></div>`;
    mount(el.querySelector('.demo'), id); return el;
  }
  function buildFan() { fan.innerHTML = ''; ['f0', 'f1', 'f2'].forEach(c => fan.appendChild(fanCard(fanIds[fanPtr++ % fanIds.length], c))); }
  function rotateFan() {
    if (document.hidden || modal.open || $('#vModal').open) return;
    const cards = $$('.fan-card', fan), front = cards.find(c => c.classList.contains('f2')), mid = cards.find(c => c.classList.contains('f1')), back = cards.find(c => c.classList.contains('f0'));
    if (!front) return;
    back.remove();
    mid.classList.replace('f1', 'f2'); front.classList.replace('f2', 'f1');
    const n = fanCard(fanIds[fanPtr++ % fanIds.length], 'f0'); n.style.opacity = '0'; fan.prepend(n); requestAnimationFrame(() => { n.style.opacity = ''; });
  }
  fan.addEventListener('click', e => { const c = e.target.closest('.fan-card'); if (c) openModal(c.dataset.id, STYLES.map(s => s.id)); });
  fan.addEventListener('keydown', e => { const c = e.target.closest('.fan-card'); if (c && e.key === 'Enter') openModal(c.dataset.id, STYLES.map(s => s.id)); });

  /* ---------- 小測驗 ---------- */
  const quiz = { n: 0, score: 0, streak: 0, best: store.get('best', 0), cur: null, recent: [], answered: false };
  function newQuestion() {
    let pool = STYLES.filter(s => !quiz.recent.includes(s.id));
    const s = pool[Math.floor(Math.random() * pool.length)];
    quiz.recent.push(s.id); if (quiz.recent.length > 12) quiz.recent.shift();
    const same = shuffleArr(STYLES.filter(x => x.cat === s.cat && x.id !== s.id)).slice(0, 1);
    const others = shuffleArr(STYLES.filter(x => x.id !== s.id && !same.includes(x))).slice(0, 3 - same.length);
    quiz.cur = s; quiz.opts = shuffleArr([s, ...same, ...others]); quiz.n++; quiz.answered = false;
    mount($('#quizDemo'), s.id);
    renderQuiz();
    $('#quizFeedback').textContent = ''; $('#quizCopy').hidden = true;
  }
  function renderQuiz() {
    $('#quizQ').textContent = t('quiz.q', { n: quiz.n });
    $('#quizOptions').innerHTML = quiz.opts.map((o, i) => `<button class="opt" type="button" data-ans="${o.id}">${esc(nameOf(o))}<small>${i + 1} · ${esc(subOf(o))}</small></button>`).join('');
    $('#quizScore').textContent = quiz.score; $('#quizStreak').textContent = quiz.streak; $('#quizBest').textContent = quiz.best;
    const f = $('#quizFlame'); f.classList.toggle('on', quiz.streak >= 2); f.style.setProperty('--fs', Math.min(1 + quiz.streak * .12, 1.8));
    if (quiz.answered) paintAnswer();
  }
  function paintAnswer() {
    const ok = quiz.chosen === quiz.cur.id;
    $$('.opt', $('#quizOptions')).forEach(b => { b.disabled = true; b.classList.toggle('right', b.dataset.ans === quiz.cur.id); b.classList.toggle('wrong', b.dataset.ans === quiz.chosen && !ok); });
    $('#quizFeedback').textContent = t(ok ? 'quiz.right' : 'quiz.wrong', { name: nameOf(quiz.cur) });
    $('#quizFeedback').style.color = ok ? 'var(--c-teal)' : 'var(--c-coral)';
  }
  function answer(id) {
    if (quiz.answered) return; quiz.answered = true; quiz.chosen = id;
    const ok = id === quiz.cur.id;
    if (ok) { quiz.score += 10 + quiz.streak * 2; quiz.streak++; sfx.right(); }
    else { quiz.streak = 0; sfx.wrong(); }
    if (quiz.score > quiz.best) { quiz.best = quiz.score; store.set('best', quiz.best); }
    renderQuiz();
    if (ok) burst($('.opt.right'));
    $('#quizCopy').hidden = false; markSeen(quiz.cur.id);
  }
  $('#quizOptions').addEventListener('click', e => { const b = e.target.closest('[data-ans]'); if (b) answer(b.dataset.ans); });
  $('#quizNext').addEventListener('click', () => { sfx.click(); newQuestion(); });
  $('#quizCopy').addEventListener('click', e => copyText(nameOf(quiz.cur), e.currentTarget));
  $('#quizDemo').addEventListener('click', () => { if (quiz.answered) openModal(quiz.cur.id, STYLES.map(s => s.id)); });

  /* ---------- 提示詞工坊 ---------- */
  const lab = { style: 'hologram', len: '30', ratio: '9:16' };
  function buildPrompt(s, topic) {
    return t('prompt.tpl', { len: lab.len, ratio: lab.ratio, topic: topic || $('#labTopic').value.trim() || t('prompt.defaultTopic'), name: s.zh, en: s.en, desc: s.d[L()], tags: s.t[L()].join(L() ? ', ' : '、') });
  }
  function renderLabSelect() {
    $('#labStyle').innerHTML = CATS.map(c => `<optgroup label="${catName(c)}">${STYLES.filter(s => s.cat === c.id).map(s => `<option value="${s.id}"${s.id === lab.style ? ' selected' : ''}>${esc(nameOf(s))}　${esc(subOf(s))}</option>`).join('')}</optgroup>`).join('');
  }
  function updateLab(remount) { $('#labText').textContent = buildPrompt(byId[lab.style]); if (remount) mount($('#labDemo'), lab.style); }
  $('#labStyle').addEventListener('change', e => { lab.style = e.target.value; sfx.click(); updateLab(true); });
  $('#labTopic').addEventListener('input', () => updateLab(false));
  ['labLen', 'labRatio'].forEach(id => $('#' + id).addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; $$('button', e.currentTarget).forEach(x => x.classList.toggle('on', x === b));
    lab[id === 'labLen' ? 'len' : 'ratio'] = b.dataset.v; sfx.click(); updateLab(false);
  }));
  $('#labCopy').addEventListener('click', e => copyText($('#labText').textContent, e.currentTarget, t('toast.prompt')));

  /* ---------- 完整影片與來源 ---------- */
  const VIDEOS = Object.values(EP);                 // Claude 1–5 → Codex 1–6 → Antigravity 1–5
  let watched = new Set(store.get('watched', []));
  const vpos = store.get('vpos', {});                // 每支影片上次看到的秒數
  const epTitle = e => L() ? e.en : e.zh;
  const lenSec = e => { const [m, s] = e.len.split(':').map(Number); return m * 60 + s; };

  function renderSources() {
    $('#sourceList').innerHTML = Object.entries(SRC).map(([ai, s]) => `<div class="src-col" style="--ac:${s.color}">
      <div class="src-head"><h3>${s.en}</h3><p>${L() ? s.noteEn : s.noteZh}</p></div>
      <ul class="ep-list">${s.episodes.map(e => {
        const n = STYLES.filter(x => x.src.includes(e.code)).length;
        const pct = vpos[e.code] ? Math.min(100, vpos[e.code] / lenSec(e) * 100) : 0;
        return `<li class="ep${state.ep === e.code ? ' on' : ''}" data-ep="${e.code}">
          <button class="thumb" type="button" data-play="${e.code}" aria-label="${esc(t('v.play') + '：' + epTitle(e))}">
            <img src="${e.thumb}" alt="" loading="lazy" width="72" height="108"><span class="pl"><svg><use href="#i-play"/></svg></span>
            ${watched.has(e.code) ? '<span class="watched"><svg><use href="#i-check"/></svg></span>' : ''}
            ${pct ? `<span class="bar" style="width:${pct}%"></span>` : ''}
          </button>
          <div><b>${esc(epTitle(e))}</b><span>${t('sources.count', { n, len: e.len })}</span><span class="file">${esc(e.file)}</span>
            <div class="ep-actions">
              <button class="play" type="button" data-play="${e.code}"><svg><use href="#i-play"/></svg>${t('v.play')}</button>
              <button type="button" data-filter="${e.code}"><svg><use href="#i-grid"/></svg>${t('v.filter')}</button>
            </div>
          </div></li>`;
      }).join('')}</ul></div>`).join('');
    $('#vWatched').textContent = t('v.watched', { n: watched.size, t: VIDEOS.length });
  }
  $('#sourceList').addEventListener('click', e => {
    const p = e.target.closest('[data-play]'); if (p) { openVideo(p.dataset.play); return; }
    const b = e.target.closest('[data-filter]'); if (!b) return;
    sfx.click(); state.ep = state.ep === b.dataset.filter ? null : b.dataset.filter; state.cat = 'all'; state.ai = 'all'; state.q = ''; state.fav = false; $('#search').value = '';
    renderChips(); renderGrid(); if (state.ep) window.scrollTo({ top: $('#explore').getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
  });

  /* ---------- 影片播放器 ---------- */
  const vModal = $('#vModal'), vid = $('#vPlayer');
  let vIdx = 0, vRate = 1, vAuto = store.get('vauto', true), vSaveT = 0;
  function openVideo(code) {
    vIdx = Math.max(0, VIDEOS.findIndex(v => v.code === code));
    if (modal.open) modal.close();
    if (!vModal.open) { vModal.showModal(); sfx.open(); }
    loadVideo(true);
  }
  function savePos() {
    const v = VIDEOS[vIdx]; if (!v || !vid.currentSrc || !vid.duration) return;
    if (vid.currentTime > 3 && vid.currentTime < vid.duration - 5) vpos[v.code] = Math.round(vid.currentTime); else delete vpos[v.code];
    store.set('vpos', vpos);
  }
  function markWatched(v) { if (watched.has(v.code)) return; watched.add(v.code); store.set('watched', [...watched]); renderVideoList(); }
  function loadVideo(play) {
    const v = VIDEOS[vIdx];
    $('#vErr').hidden = true;
    vid.poster = v.thumb; vid.src = v.video;
    vid.addEventListener('loadedmetadata', () => {
      const p = vpos[v.code]; if (p && p < vid.duration - 5) vid.currentTime = p;
      vid.playbackRate = vRate;
    }, { once: true });
    if (play) vid.play().catch(() => { /* 瀏覽器不允許自動播放時，讓使用者自己按播放 */ });
    fillVideoInfo();
  }
  function fillVideoInfo() {
    const v = VIDEOS[vIdx], src = SRC[v.ai];
    $('#vAi').innerHTML = `<i style="background:${src.color}">${src.en}</i>`;
    $('#vTitle').textContent = epTitle(v);
    $('#vMeta').textContent = `${v.len}　·　${v.file}`;
    $('#vStyles').innerHTML = STYLES.filter(s => s.src.includes(v.code)).map(s => `<button type="button" class="tag" data-style="${s.id}">${esc(nameOf(s))}</button>`).join('');
    renderVideoList();
    $('#vAuto').setAttribute('aria-pressed', vAuto);
    $$('#vSpeed button').forEach(b => b.classList.toggle('on', +b.dataset.r === vRate));
  }
  function renderVideoList() {
    if (!vModal.open) return;
    $('#vList').innerHTML = Object.entries(SRC).map(([ai, s]) => `<h5>${s.en}</h5>` + s.episodes.map(e => {
      const i = VIDEOS.findIndex(v => v.code === e.code);
      return `<button type="button" class="v-item${i === vIdx ? ' on' : ''}" data-vi="${i}"><img src="${e.thumb}" alt="" loading="lazy">
        <span>${esc(epTitle(e))}<br><small>${e.len}</small></span><span class="ck">${watched.has(e.code) ? '<svg><use href="#i-check"/></svg>' : ''}</span></button>`;
    }).join('')).join('');
    const on = $('#vList .v-item.on'); if (on) $('#vList').scrollTop = on.offsetTop - $('#vList').offsetTop - 60;
  }
  function vStep(d) { savePos(); vIdx = (vIdx + d + VIDEOS.length) % VIDEOS.length; sfx.click(); loadVideo(true); }
  vid.addEventListener('timeupdate', () => {
    const v = VIDEOS[vIdx]; if (!vid.duration) return;
    if (vid.currentTime / vid.duration > .9) markWatched(v);
    const now = Date.now(); if (now - vSaveT > 3000) { vSaveT = now; savePos(); }
  });
  vid.addEventListener('ended', () => {
    const v = VIDEOS[vIdx]; markWatched(v); delete vpos[v.code]; store.set('vpos', vpos);
    if (vAuto && vIdx < VIDEOS.length - 1) { vIdx++; loadVideo(true); toast(t('v.nextUp', { t: epTitle(VIDEOS[vIdx]) })); }
  });
  vid.addEventListener('error', () => {
    if (!vid.getAttribute('src')) return;
    const e = $('#vErr'); e.hidden = false; e.textContent = t('v.err', { f: VIDEOS[vIdx].video });
  });
  vModal.addEventListener('close', () => { savePos(); vid.pause(); vid.removeAttribute('src'); vid.load(); sfx.close(); renderSources(); });
  vModal.addEventListener('click', e => { if (e.target === vModal) vModal.close(); });
  $('#vClose').addEventListener('click', () => vModal.close());
  $('#vPrev').addEventListener('click', () => vStep(-1));
  $('#vNext').addEventListener('click', () => vStep(1));
  $('#vSpeed').addEventListener('click', e => {
    const b = e.target.closest('[data-r]'); if (!b) return;
    vRate = +b.dataset.r; vid.playbackRate = vRate; sfx.click();
    $$('#vSpeed button').forEach(x => x.classList.toggle('on', x === b));
  });
  $('#vAuto').addEventListener('click', e => { vAuto = !vAuto; store.set('vauto', vAuto); e.currentTarget.setAttribute('aria-pressed', vAuto); sfx.toggle(); });
  $('#vList').addEventListener('click', e => { const b = e.target.closest('[data-vi]'); if (!b) return; savePos(); vIdx = +b.dataset.vi; sfx.click(); loadVideo(true); });
  $('#vStyles').addEventListener('click', e => {
    const b = e.target.closest('[data-style]'); if (!b) return;
    const code = VIDEOS[vIdx].code; vModal.close();
    openModal(b.dataset.style, STYLES.filter(s => s.src.includes(code)).map(s => s.id));
  });
  $('#mSrc').addEventListener('click', e => { const b = e.target.closest('[data-play]'); if (b) openVideo(b.dataset.play); });
  const firstUnwatched = () => (VIDEOS.find(v => !watched.has(v.code)) || VIDEOS[0]).code;
  $('#heroVideos').addEventListener('click', () => openVideo(firstUnwatched()));
  $('#playAll').addEventListener('click', () => { vAuto = true; store.set('vauto', true); openVideo(VIDEOS[0].code); });

  /* ---------- ⚙️ 顯示與操作設定 ---------- */
  const SET_ROWS = [
    { k: 'fullscreen', ico: '🖥️', opts: ['on', 'off'], c: 'var(--c-coral)' },
    { k: 'sound', ico: '🔊', opts: ['on', 'off'], c: 'var(--c-sun)' },
    { k: 'device', ico: '📱', opts: ['auto', 'phone', 'tablet', 'desktop'], c: 'var(--c-teal)' },
    { k: 'orient', ico: '🧭', opts: ['auto', 'portrait', 'landscape'], c: 'var(--c-sky)' },
    { k: 'lang', ico: '🌐', opts: ['zh', 'en'], c: 'var(--c-violet)', label: { zh: '中文', en: 'English' } },
    { k: 'font', ico: '🔠', opts: ['sm', 'md', 'lg'], c: 'var(--c-pink)' },
    { k: 'theme', ico: '🎨', opts: ['system', 'light', 'dark'], c: 'var(--c-coral)' }
  ];
  function renderSettings() {
    $('#setBody').innerHTML = SET_ROWS.map((r, i) => `<section class="set-row" style="--rc:${r.c}">
      <h3><span class="n">${i + 1}</span><span class="ico" aria-hidden="true">${r.ico}</span>${t('set.' + r.k)}</h3>
      <div class="seg" role="radiogroup" aria-label="${t('set.' + r.k)}">${r.opts.map(o => `<button type="button" role="radio" data-k="${r.k}" data-v="${o}" aria-checked="${settings[r.k] === o}">${r.label ? r.label[o] : t(o)}</button>`).join('')}</div>
    </section>`).join('');
  }
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  function setFullscreen(on) {
    const de = document.documentElement;
    if (on && !fsEl()) {
      const req = de.requestFullscreen || de.webkitRequestFullscreen;
      if (!req) { toast(t('toast.fsno')); settings.fullscreen = 'off'; renderSettings(); return; }
      Promise.resolve(req.call(de)).catch(() => { settings.fullscreen = 'off'; renderSettings(); toast(t('toast.fsno')); });
    } else if (!on && fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
  }
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => { settings.fullscreen = fsEl() ? 'on' : 'off'; renderSettings(); }));

  function applySettings(changed) {
    const h = document.documentElement;
    h.dataset.theme = settings.theme; h.dataset.device = settings.device; h.dataset.orient = settings.orient; h.dataset.font = settings.font; h.dataset.lang = settings.lang;
    h.lang = settings.lang === 'en' ? 'en' : 'zh-Hant-TW';
    $('#quickSound use').setAttribute('href', settings.sound === 'on' ? '#i-volume' : '#i-mute');
    $('#quickSound').setAttribute('aria-pressed', settings.sound === 'off');
    store.set('settings', Object.assign({}, settings, { fullscreen: 'off' }));
    if (!changed || changed === 'lang') applyLang();
  }
  function applyLang() {
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.title = settings.lang === 'en' ? 'Animation Names & Effects | Claude Animation Style Gallery' : '動畫名稱與動畫效果｜Claude 動畫風格互動圖鑑';
    renderChips(); renderGrid(); renderSources(); renderLabSelect(); updateLab(false); updateProgress(); renderSettings();
    if (quiz.cur) renderQuiz();
    $$('.fan-card').forEach(c => { const s = byId[c.dataset.id]; c.querySelector(".fan-cap").innerHTML = `${esc(nameOf(s))}<small>${esc(subOf(s))}</small>`; });
    if (modal.open) fillModal();
    if (vModal.open) fillVideoInfo();
  }

  $('#setBody').addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    const k = b.dataset.k, v = b.dataset.v; if (settings[k] === v) return;
    settings[k] = v;
    if (k === 'fullscreen') setFullscreen(v === 'on');
    applySettings(k); renderSettings(); sfx.toggle();
    $(`[data-k="${k}"][data-v="${v}"]`)?.focus();
  });
  const setPanel = $('#settings'); let lastFocus = null;
  function openSettings() { lastFocus = document.activeElement; setPanel.hidden = false; renderSettings(); sfx.open(); setTimeout(() => $('#setBody button')?.focus(), 60); }
  function closeSettings() { if (setPanel.hidden) return; setPanel.hidden = true; sfx.close(); lastFocus?.focus?.(); }
  $('#openSettings').addEventListener('click', openSettings);
  setPanel.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSettings(); });
  $('#setReset').addEventListener('click', () => { Object.assign(settings, DEFAULTS); setFullscreen(false); applySettings(); toast(t('toast.reset')); sfx.toggle(); });
  $('#quickSound').addEventListener('click', () => { settings.sound = settings.sound === 'on' ? 'off' : 'on'; applySettings('sound'); renderSettings(); sfx.toggle(); });

  /* ---------- 鍵盤快速鍵 ---------- */
  document.addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if (e.key === 'Escape' && !setPanel.hidden) { closeSettings(); return; }
    if (vModal.open) return; // 影片播放時交給播放器原生的鍵盤操作
    if (modal.open) { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '/') { e.preventDefault(); $('#search').focus(); }
    else if (e.key === 'r' || e.key === 'R') openRandom();
    else if (/^[1-4]$/.test(e.key) && quiz.opts && !quiz.answered && $('#quiz').getBoundingClientRect().top < innerHeight * .6 && $('#quiz').getBoundingClientRect().bottom > 0) answer(quiz.opts[+e.key - 1].id);
  });

  /* ---------- PWA ---------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; $('#installBtn').hidden = false; });
  $('#installBtn').addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('#installBtn').hidden = true; });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
  }

  /* ---------- 啟動 ---------- */
  const names = new Set(); STYLES.forEach(s => { names.add(s.zh); s.alias.forEach(a => names.add(a)); });
  $('#statStyles').textContent = STYLES.length; $('#statNames').textContent = names.size;
  $('#favCount').textContent = favs.size;
  applySettings();
  buildFan(); fanTimer = setInterval(rotateFan, 4200);
  newQuestion();
  updateLab(true);
  // 解鎖行動裝置的音訊
  document.addEventListener('pointerdown', () => { if (settings.sound === 'on') ac(); }, { once: true });
})();
