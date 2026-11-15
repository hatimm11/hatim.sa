/* Kashida justification for Arabic long copy.
 *
 * Browsers cannot justify Arabic with kashida, so this script does it the way
 * Word's «ضبط» does: every line except the last is filled by inserting tatweel
 * (U+0640) at one joining point per word, chosen by the classical priorities
 * (after seen/sad, before final ة/ه/د, before final alef/lam/kaf, …), at most
 * two per word. The remainder (under one tatweel) goes to the spaces through
 * text-align: justify. Line breaks are frozen first, so text-wrap: pretty keeps
 * its choices. Everything is recomputed when the width changes, undone for
 * printing, and stripped from copied text.
 */
(() => {
  'use strict';
  const SELECTOR = [
    '.atext p', '.project-copy>p', '.project-summary .d', '.card p', '.training-delivered p',
    '.diss .ds', '.cred .cm', '.train>p', '.project-details dd', '.lede', '.note',
    '.skills p', '.item li', '.edu .x'
  ].map(s => ':lang(ar) ' + s).join(',');
  const MAX_PER_WORD = 2;
  const MARGIN = 1;
  const K = 'ـ';

  const DUAL = new Set('بتثجحخسشصضطظعغفقكلمنهيئ'.split(''));
  const MARK = /[ً-ٰٟ]/;
  const LETTER = /[آ-غف-ي]/;
  const FOREIGN = /[0-9A-Za-z٠-٩۰-۹ـ]/;
  const ALEFS = new Set(['ا', 'أ', 'إ', 'آ']);
  const SEEN = new Set('سشصض'.split(''));
  const HA_DAL = new Set('ةهدذ'.split(''));
  const ALEF_ETC = new Set('اأإآطظلك'.split(''));
  const BA_FAM = new Set('بتثنيئ'.split(''));
  const RA_YA = new Set('رزيى'.split(''));
  const WAW_ETC = new Set('وؤعغقف'.split(''));

  // Best kashida site of a word: { at: index to insert before, pr: priority (lower is better) }.
  function bestSite(word) {
    if (FOREIGN.test(word)) return null;
    const L = [];
    for (let i = 0; i < word.length; i++) {
      if (LETTER.test(word[i])) L.push(i);
      else if (MARK.test(word[i]) && L.length) continue;
      else if (L.length && i < word.length - 1 && LETTER.test(word[i + 1])) return null;
    }
    if (L.length < 3) return null;
    let best = null;
    for (let t = 0; t + 1 < L.length; t++) {
      const a = word[L[t]], b = word[L[t + 1]];
      if (!DUAL.has(a)) continue;
      if (a === 'ل' && ALEFS.has(b)) continue;
      if (t === 0 && ALEFS.has(b)) continue;
      let clean = true;
      for (let j = L[t] + 1; j < L[t + 1]; j++) if (!MARK.test(word[j])) { clean = false; break; }
      if (!clean) return best;
      const last = t + 1 === L.length - 1;
      let pr = 8;
      if (SEEN.has(a)) pr = 2;
      else if (last && HA_DAL.has(b)) pr = 3;
      else if (last && ALEF_ETC.has(b)) pr = 4;
      else if (t + 2 === L.length - 1 && BA_FAM.has(b) && RA_YA.has(word[L[t + 2]])) pr = 5;
      else if (last && WAW_ETC.has(b)) pr = 6;
      else if (last) pr = 7;
      if (!best || pr <= best.pr) best = { at: L[t + 1], pr };
    }
    return best;
  }

  const originals = new Map();
  const centerY = w => { const r = w.getClientRects()[0]; return (r.top + r.bottom) / 2; };

  function wrapWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const t of nodes) {
      if (!t.nodeValue.trim()) continue;
      const frag = document.createDocumentFragment();
      for (const part of t.nodeValue.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
        const s = document.createElement('span');
        s.className = 'kw';
        s.textContent = part;
        frag.appendChild(s);
      }
      t.parentNode.replaceChild(frag, t);
    }
    return [...el.querySelectorAll('span.kw')];
  }

  function tatweelWidth(el) {
    const a = document.createElement('span'), b = document.createElement('span');
    a.textContent = 'ب' + K.repeat(20) + 'ب';
    b.textContent = 'بب';
    a.style.whiteSpace = b.style.whiteSpace = 'nowrap';
    el.append(a, b);
    const w = (a.getBoundingClientRect().width - b.getBoundingClientRect().width) / 20;
    a.remove(); b.remove();
    return w;
  }

  function groupLines(words, tol) {
    const lines = [];
    for (const w of words) {
      if (!w.getClientRects().length) continue;
      const y = centerY(w);
      let line = lines.find(l => Math.abs(l.y - y) < tol);
      if (!line) { line = { y, words: [] }; lines.push(line); }
      line.words.push(w);
    }
    return lines.sort((a, b) => a.y - b.y);
  }
  const signature = lines => lines.map(l => l.words.length).join(',');

  // Spaces inside a line become no-break spaces, so only line-end spaces can break.
  function freeze(el, lines) {
    const lineOf = new Map();
    lines.forEach((l, i) => l.words.forEach(w => lineOf.set(w, i)));
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let prev = null, pending = [];
    while (walker.nextNode()) {
      const t = walker.currentNode, p = t.parentNode;
      if (p.classList && p.classList.contains('kw')) {
        if (prev && lineOf.get(prev) === lineOf.get(p)) pending.forEach((n, i) => { n.nodeValue = i ? '' : ' '; });
        pending = []; prev = p;
      } else if (!t.nodeValue.trim()) pending.push(t);
    }
  }

  function setAlign(el, align) {
    el.style.setProperty('text-align', align, 'important');
    el.style.setProperty('text-align-last', 'start', 'important');
  }

  function restore(el) {
    if (!originals.has(el)) return;
    el.innerHTML = originals.get(el);
    el.style.removeProperty('text-align');
    el.style.removeProperty('text-align-last');
    el.style.removeProperty('text-wrap');
    delete el.dataset.kashida;
  }

  function justify(el) {
    if (!originals.has(el)) originals.set(el, el.innerHTML);
    else restore(el);
    if (!el.getClientRects().length) return;
    const cs = getComputedStyle(el);
    if (cs.textAlign === 'center' || cs.direction !== 'rtl') return;
    setAlign(el, 'start');
    const words = wrapWords(el);
    if (words.length < 3) { setAlign(el, 'justify'); return; }
    const box = el.getBoundingClientRect();
    const left = box.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;
    const tol = lh / 2.5;
    const k = tatweelWidth(el);
    let lines = groupLines(words, tol);
    if (lines.length < 2 || !(k > 0.5)) { setAlign(el, 'justify'); return; }
    const sig = signature(lines);
    freeze(el, lines);
    lines = groupLines(words, tol);
    if (signature(lines) !== sig) {
      // The frozen breaks did not hold; fall back to greedy breaking.
      restore(el); originals.set(el, el.innerHTML);
      el.style.setProperty('text-wrap', 'wrap', 'important');
      setAlign(el, 'justify');
      return;
    }
    const skip = new Set();
    let quoted = false;
    for (const w of words) {
      const t = w.textContent;
      if (t.includes('«')) quoted = true;
      if (quoted || w.closest('a,b,strong,bdi,code,kbd')) skip.add(w);
      if (t.includes('»')) quoted = false;
    }
    const free = ws => Math.min(...ws.map(w => w.getBoundingClientRect().left)) - left;
    const sameLine = (ws, y) => ws.every(w => Math.abs(centerY(w) - y) < tol);
    for (let li = 0; li < lines.length - 1; li++) {
      const ws = lines[li].words;
      let next = ws[ws.length - 1].nextSibling;
      while (next && next.nodeType === 3 && !next.nodeValue.trim()) next = next.nextSibling;
      if (next && next.nodeName === 'BR') continue;
      const room = free(ws) - MARGIN;
      let n = Math.floor(room / k);
      if (n <= 0) continue;
      const cands = ws
        .map(w => ({ w, text: w.textContent, s: skip.has(w) ? null : bestSite(w.textContent), count: 0 }))
        .filter(c => c.s)
        .sort((a, b) => a.s.pr - b.s.pr || b.text.length - a.text.length);
      if (!cands.length) continue;
      for (let r = 0; r < MAX_PER_WORD && n > 0; r++) {
        for (const c of cands) { if (n <= 0) break; c.count++; n--; }
      }
      const paint = c => { c.w.textContent = c.text.slice(0, c.s.at) + K.repeat(c.count) + c.text.slice(c.s.at); };
      cands.forEach(c => c.count && paint(c));
      // Shaping can make a tatweel slightly wider than measured: take back until the line fits.
      const order = cands.slice().reverse();
      let guard = 0;
      while ((free(ws) < 0 || !sameLine(ws, lines[li].y)) && guard++ < 40) {
        const c = order.find(x => x.count > 0);
        if (!c) break;
        c.count--; paint(c);
      }
    }
    setAlign(el, 'justify');
    el.dataset.kashida = '1';
  }

  const targets = () => [...document.querySelectorAll(SELECTOR)].filter(el =>
    /[؀-ۿ]/.test(el.textContent) && el.textContent.trim().length > 30);

  let running = false;
  function run(scope) {
    if (running) return;
    running = true;
    try {
      targets().forEach(el => { if (!scope || scope.contains(el)) justify(el); });
    } finally { running = false; }
  }
  function restoreAll() { originals.forEach((_, el) => restore(el)); }

  let lastWidth = window.innerWidth, timer = 0;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    restoreAll();
    clearTimeout(timer);
    timer = setTimeout(() => run(), 250);
  });
  document.addEventListener('toggle', e => { if (e.target.open) run(e.target); }, true);
  window.addEventListener('beforeprint', restoreAll);
  window.addEventListener('afterprint', () => run());

  // Copied text leaves out the inserted tatweel (a word-final «هـ» is kept).
  document.addEventListener('copy', e => {
    const sel = String(window.getSelection());
    if (!sel.includes(K)) return;
    const clean = sel.replace(/([ؠ-ي][ً-ٰٟ]*)ـ+(?=[ؠ-ي])/g, '$1');
    if (clean === sel || !e.clipboardData) return;
    e.clipboardData.setData('text/plain', clean);
    e.preventDefault();
  });

  const start = () => requestAnimationFrame(() => run());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  window.addEventListener('load', () => { lastWidth = window.innerWidth; run(); });
})();
