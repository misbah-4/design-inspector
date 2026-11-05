(() => {
  // Second injection = toggle off.
  if (window.__designInspector) { window.__designInspector.destroy(); return; }

  /* ---------- styles (isolated in a shadow root so the site can't affect them) ---------- */
  const CSS = `
  :host{all:initial}
  [hidden]{display:none!important}
  *{box-sizing:border-box;margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;}
  .layer{position:fixed;inset:0;pointer-events:none}
  .box{position:fixed;pointer-events:none;border-style:solid;border-color:transparent}
  .m{border-color:rgba(246,178,107,.45)}
  .p{border-color:rgba(150,196,128,.65)}
  .hatch{background:repeating-linear-gradient(135deg,rgba(150,128,232,.5) 0 7px,rgba(124,92,224,.8) 7px 8.5px)}
  .tint{background:rgba(150,128,232,.22)}
  .kid{background:rgba(129,177,228,.75);outline:1px dashed rgba(124,92,224,.9);outline-offset:-1px}
  .outline{outline:1.5px dashed #7C5CE0;outline-offset:-1px}
  .sel{outline:1.5px solid #7C5CE0;outline-offset:-1px}

  .pill{position:fixed;top:16px;right:16px;pointer-events:auto;display:flex;align-items:center;gap:10px;background:#F4F4F3;border-radius:16px;padding:8px 8px 8px 14px;box-shadow:0 1px 2px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.08);font-size:14px;color:#2B2B2B}
  .pill .hint{color:#8A8A8A;font-size:12px;min-width:150px}
  .sw{width:12px;height:12px;border-radius:3px;background:#A99BE6;flex:none}
  .icon-btn{all:unset;cursor:pointer;width:28px;height:28px;display:grid;place-items:center;border-radius:8px;color:#2B2B2B}
  .icon-btn:hover{background:rgba(0,0,0,.06)}

  .tip{position:fixed;left:0;top:0;background:#fff;border-radius:20px;padding:18px 20px;width:300px;box-shadow:0 1px 2px rgba(0,0,0,.05),0 12px 32px rgba(0,0,0,.12);font-size:13px;color:#2B2B2B;pointer-events:none}
  .tip.locked{pointer-events:auto}
  .name{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;margin-bottom:10px;min-width:0}
  .name b{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .name .tag{color:#A3A3A3;font-weight:400;font-size:12px;margin-left:auto;flex:none}
  .row{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:4px 0}
  .k{color:#8A8A8A;flex:none}
  .v{display:flex;align-items:center;gap:6px;text-align:right;font-variant-numeric:tabular-nums;min-width:0;overflow-wrap:anywhere}
  .v small{color:#A3A3A3;font-size:11px}
  .copy{cursor:pointer;border-radius:6px;padding:1px 5px;margin-right:-5px}
  .locked .copy:hover,.panel .copy:hover{background:#F1EEFC}
  .dot{width:12px;height:12px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
  .actions{display:flex;gap:6px;margin-top:12px}
  .btn{all:unset;cursor:pointer;font-size:12px;padding:6px 10px;border-radius:9px;background:#F4F4F3;color:#2B2B2B}
  .btn:hover{background:#EAE8F6}
  .btn.primary{background:#2B2B2B;color:#fff}
  .btn[disabled]{opacity:.35;pointer-events:none}
  .hintline{color:#A3A3A3;font-size:11px;margin-top:10px}
  .note{font-size:12px;color:#A15C00;margin-top:8px}
  .stale{color:#8A8A8A;line-height:1.5}

  .panel{position:fixed;pointer-events:auto;background:#F4F4F3;border-radius:28px;padding:14px 18px 16px;box-shadow:0 24px 64px rgba(0,0,0,.18);resize:both;overflow:auto;min-width:380px;min-height:320px;display:flex;flex-direction:column;color:#2B2B2B;font-size:13px}
  .ph{display:flex;align-items:center;gap:8px;cursor:grab;padding:2px 0 12px;user-select:none}
  .ph:active{cursor:grabbing}
  .crumbs{display:flex;gap:2px;flex-wrap:wrap;font-size:12px;color:#8A8A8A;flex:1;min-width:0}
  .crumb{all:unset;cursor:pointer;padding:3px 7px;border-radius:7px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .crumb:hover{background:#fff}.crumb.cur{color:#2B2B2B;background:#fff}
  .pb{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;flex:1;min-height:0}
  .card{background:#fff;border-radius:22px;padding:22px;min-height:0}
  .props{overflow:auto}
  .preview{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px}
  .stage{position:relative;flex:none}
  .stage>div{position:absolute;border-style:solid;border-color:transparent}
  .plabel{position:absolute;font-size:10px;color:#3F5F30;transform:translate(-50%,-50%);white-space:nowrap}
  .legend{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;font-size:12px}
  .legend span{display:flex;align-items:center;gap:6px}
  .lg{width:12px;height:12px;border-radius:3px}
  .sec{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#A3A3A3;margin:16px 0 4px}
  .sec:first-of-type{margin-top:8px}
  .foot{color:#A3A3A3;font-size:12px;text-align:center;margin-top:12px}

  .settings{position:fixed;top:68px;right:16px;width:280px;pointer-events:auto;background:#fff;border-radius:20px;padding:18px 20px;box-shadow:0 1px 2px rgba(0,0,0,.05),0 12px 32px rgba(0,0,0,.14);font-size:13px;color:#2B2B2B}
  .settings h4{font-size:14px;font-weight:500;margin-bottom:12px}
  .srow{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:6px 0}
  .seg{display:flex;background:#F4F4F3;border-radius:9px;padding:2px}
  .seg button{all:unset;cursor:pointer;font-size:12px;padding:4px 9px;border-radius:7px;color:#8A8A8A}
  .seg button.on{background:#fff;color:#2B2B2B;box-shadow:0 1px 2px rgba(0,0,0,.08)}
  .switch{all:unset;cursor:pointer;width:32px;height:18px;border-radius:9px;background:#DADADA;position:relative;transition:background .15s}
  .switch::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .15s}
  .switch.on{background:#7C5CE0}.switch.on::after{transform:translateX(14px)}
  .sfoot{color:#A3A3A3;font-size:11px;margin-top:12px;line-height:1.5}
  .icon-btn.on{background:rgba(0,0,0,.06)}
  .toast{position:fixed;bottom:24px;left:50%;transform:translate(-50%,8px);background:#2B2B2B;color:#fff;font-size:12px;padding:8px 12px;border-radius:10px;opacity:0;transition:opacity .15s,transform .15s;pointer-events:none}
  .toast.show{opacity:1;transform:translate(-50%,0)}
  `;
  const GEAR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  const X = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>';

  /* ---------- mount ---------- */
  const host = document.createElement('div');
  host.setAttribute('data-design-inspector', '');
  host.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${CSS}</style>
    <div class="layer" id="hl"></div>
    <div class="pill"><span class="sw"></span><span>Inspect</span><span class="hint" id="hint"></span>
      <button class="icon-btn" data-act="settings" id="gear" title="Settings">${GEAR}</button>
      <button class="icon-btn" data-act="quit" title="Turn off (Esc)">${X}</button></div>
    <div class="tip" id="tip" hidden></div>
    <div class="panel" id="panel" hidden></div>
    <div class="settings" id="settings" hidden></div>
    <div class="toast" id="toast"></div>`;
  document.documentElement.appendChild(host);
  const $ = (s) => root.querySelector(s);
  const hl = $('#hl'), tip = $('#tip'), panel = $('#panel'), hint = $('#hint'), toastEl = $('#toast');

  let hovered = null, selected = null, panelOpen = false, raf = 0, tipSig = '', panelSig = '';

  /* ---------- settings (saved in chrome.storage.sync) ---------- */
  const DEFAULTS = { colorFormat: 'hex', unit: 'px', decimals: 2, showMargin: true, showChildren: true };
  let S = { ...DEFAULTS };
  const settingsEl = $('#settings'), gear = $('#gear');
  try {
    chrome.storage.sync.get(DEFAULTS, (v) => { S = { ...DEFAULTS, ...v }; tipSig = panelSig = ''; schedule(); });
  } catch {}
  function setSetting(key, val) {
    S[key] = val;
    try { chrome.storage.sync.set({ [key]: val }); } catch {}
    tipSig = panelSig = '';
    renderSettings();
    schedule();
  }
  function renderSettings() {
    const seg = (key, opts) => `<div class="seg">${opts.map(([v, l]) =>
      `<button class="${S[key] === v ? 'on' : ''}" data-set="${key}" data-val="${v}">${l}</button>`).join('')}</div>`;
    const sw = (key) => `<button class="switch ${S[key] ? 'on' : ''}" data-set="${key}" data-val="${!S[key]}" aria-pressed="${S[key]}"></button>`;
    settingsEl.innerHTML = `<h4>Settings</h4>
      <div class="srow"><span class="k">Color format</span>${seg('colorFormat', [['hex', 'HEX'], ['rgb', 'RGB'], ['hsl', 'HSL']])}</div>
      <div class="srow"><span class="k">Units</span>${seg('unit', [['px', 'px'], ['rem', 'rem']])}</div>
      <div class="srow"><span class="k">Decimals</span>${seg('decimals', [[0, '0'], [1, '1'], [2, '2']])}</div>
      <div class="srow"><span class="k">Show margin</span>${sw('showMargin')}</div>
      <div class="srow"><span class="k">Show children</span>${sw('showChildren')}</div>
      <div class="sfoot">Shortcut: Alt+Shift+I. Change it at chrome://extensions/shortcuts</div>`;
  }
  function toggleSettings(force) {
    const open = force ?? settingsEl.hidden;
    if (open) renderSettings();
    settingsEl.hidden = !open;
    gear.classList.toggle('on', open);
  }

  /* ---------- formatting ---------- */
  const rootPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const round = (n, d) => { const f = 10 ** d; return String(Math.round(n * f) / f); };
  const r2 = (n) => round(n, S.decimals);
  // rem values are small (1.5rem), so whole-number rounding would destroy them: keep at least 2 decimals.
  const num = (n) => (S.unit === 'rem' ? round(n / rootPx(), Math.max(S.decimals, 2)) : r2(n));
  const px = (n) => num(n) + S.unit;
  const fmtLen = (s) => s.replace(/-?[\d.]+px/g, (m) => px(parseFloat(m)));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const quad = (t, r, b, l) => {
    const [T, R, B, L] = [t, r, b, l].map(px);
    if (T === R && R === B && B === L) return T;
    if (T === B && R === L) return `${T} ${R}`;
    return `${T} ${R} ${B} ${L}`;
  };
  const sides = (cs, prop, suffix = '') =>
    ['Top', 'Right', 'Bottom', 'Left'].map((s) => parseFloat(cs[prop + s + suffix]) || 0);

  function color(c) {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return { hex: c, a: 1, css: c };
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    let a = p.length > 3 ? p[3] : 1;
    if (a > 1) a /= 100;
    const [r, g, b] = p.map(Math.round);
    const h = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
    const A = Math.round(a * 100) / 100;
    let out;
    if (S.colorFormat === 'rgb') out = a < 1 ? `rgba(${r}, ${g}, ${b}, ${A})` : `rgb(${r}, ${g}, ${b})`;
    else if (S.colorFormat === 'hsl') {
      const [H, S_, L] = toHsl(r, g, b);
      out = a < 1 ? `hsla(${H}, ${S_}%, ${L}%, ${A})` : `hsl(${H}, ${S_}%, ${L}%)`;
    } else out = h;
    const label = S.colorFormat === 'hex' && a < 1 ? `${h} · ${Math.round(a * 100)}%` : out;
    return { hex: out, label, a, css: c };
  }
  function toHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
    let h = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h = (h * 60 + 360) % 360;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  }
  const parentOf = (el) => el.parentElement || el.getRootNode()?.host || null;

  // The color you actually SEE behind an element: walk up until something is painted.
  function effectiveBg(el) {
    for (let e = el; e && e.nodeType === 1; e = parentOf(e)) {
      const c = color(getComputedStyle(e).backgroundColor);
      if (c.a > 0) return { ...c, inherited: e !== el };
    }
    return { hex: '#FFFFFF', label: '#FFFFFF', a: 1, css: '#fff', inherited: true };
  }

  const nameOf = (el) => [...el.classList].find((c) => c.length < 40) || (el.id ? '#' + el.id : el.tagName.toLowerCase());

  function kids(el) {
    return [...el.children].filter((c) => {
      if (c === host) return false;
      const r = c.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(c).display !== 'none';
    }).slice(0, 80);
  }

  /* ---------- design properties ---------- */
  // Distinguishes a real CSS gap from spacing we measured between children.
  function gapInfo(cs, list) {
    const isFlex = cs.display.includes('flex'), isGrid = cs.display.includes('grid');
    if ((isFlex || isGrid) && parseFloat(cs.rowGap) + parseFloat(cs.columnGap) > 0) {
      const rg = cs.rowGap === 'normal' ? '0px' : cs.rowGap, cg = cs.columnGap === 'normal' ? '0px' : cs.columnGap;
      return { text: rg === cg ? fmtLen(cg) : fmtLen(`${rg} ${cg}`), measured: false };
    }
    // Only measure real layout boxes; inline word/span children would give meaningless "gaps".
    const flow = list.filter((k) => { const s = getComputedStyle(k); return !/absolute|fixed/.test(s.position) && s.display !== 'inline'; });
    if (flow.length < 2) return null;
    const horiz = isFlex && cs.flexDirection.startsWith('row');
    const rs = flow.map((k) => k.getBoundingClientRect()).sort((a, b) => (horiz ? a.left - b.left : a.top - b.top));
    const ds = [];
    for (let i = 1; i < rs.length; i++) {
      const d = horiz ? rs[i].left - rs[i - 1].right : rs[i].top - rs[i - 1].bottom;
      if (d >= 0) ds.push(d);
    }
    if (!ds.length) return null;
    const min = Math.min(...ds), max = Math.max(...ds);
    const val = max - min < 1 ? `~${px(min)}` : `${px(min)} – ${px(max)}`;
    const auto = isFlex && /space-(between|around|evenly)/.test(cs.justifyContent);
    return { text: auto ? `Auto (${val})` : val, measured: true };
  }

  function layoutOf(cs) {
    const d = cs.display;
    if (d.includes('flex')) return `Flex · ${cs.flexDirection.startsWith('column') ? 'Vertical' : 'Horizontal'}${cs.flexWrap === 'wrap' ? ' · Wrap' : ''}`;
    if (d.includes('grid')) {
      const cols = cs.gridTemplateColumns === 'none' ? 0 : cs.gridTemplateColumns.trim().split(/\s+/).length;
      return cols ? `Grid · ${cols} column${cols > 1 ? 's' : ''}` : 'Grid';
    }
    return d.charAt(0).toUpperCase() + d.slice(1);
  }

  // Each row: [label, display value, {copy, swatch, sub}]
  function inspect(el) {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(), list = kids(el);
    const P = sides(cs, 'padding'), M = sides(cs, 'margin'), B = sides(cs, 'border', 'Width');
    const gap = gapInfo(cs, list), bg = effectiveBg(el), fg = color(cs.color);
    const isFlex = cs.display.includes('flex');

    const layout = [
      ['Size', `${num(r.width)} × ${num(r.height)}${S.unit === 'rem' ? ' rem' : ''}`],
      ['Width', px(r.width)],
      ['Height', px(r.height)],
      ['Padding', quad(...P)],
      ['Margin', quad(...M)],
      gap && ['Gap', gap.text, { sub: gap.measured ? 'measured' : '' }],
      ['Layout', layoutOf(cs)],
      isFlex && ['Alignment', `${cs.alignItems} / ${cs.justifyContent}`],
    ];
    const colors = [
      ['Background', bg.label, { swatch: bg.css, copy: bg.hex, sub: bg.inherited ? 'from parent' : '' }],
      cs.backgroundImage !== 'none' && ['Fill', cs.backgroundImage.startsWith('url') ? 'Image' : 'Gradient', { copy: cs.backgroundImage }],
      ['Text color', fg.label, { swatch: fg.css, copy: fg.hex }],
    ];
    const lh = cs.lineHeight === 'normal' ? 'Normal' : `${px(parseFloat(cs.lineHeight))} (${Math.round(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) * 100) / 100})`;
    const type = [
      ['Font', cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), { copy: cs.fontFamily }],
      ['Size', px(parseFloat(cs.fontSize))],
      ['Weight', cs.fontWeight],
      ['Line height', lh],
      cs.letterSpacing !== 'normal' && parseFloat(cs.letterSpacing) !== 0 && ['Letter spacing', fmtLen(cs.letterSpacing)],
      cs.textTransform !== 'none' && ['Transform', cs.textTransform],
    ];
    const radius = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map((c) => parseFloat(cs[`border${c}Radius`]) || 0);
    const bc = color(cs.borderTopColor);
    const uniformBorder = B.every((b) => b === B[0]);
    const look = [
      radius.some(Boolean) && ['Radius', quad(...radius)],
      B.some(Boolean) && ['Border', uniformBorder ? `${px(B[0])} ${cs.borderTopStyle} ${bc.label}` : `Mixed (${quad(...B)})`, uniformBorder ? { swatch: bc.css } : {}],
      cs.boxShadow !== 'none' && ['Shadow', cs.boxShadow.length > 34 ? cs.boxShadow.slice(0, 34) + '…' : cs.boxShadow, { copy: cs.boxShadow }],
      parseFloat(cs.opacity) < 1 && ['Opacity', Math.round(parseFloat(cs.opacity) * 100) + '%'],
    ];
    const clean = (a) => a.filter(Boolean);
    return {
      name: nameOf(el), tag: el.tagName.toLowerCase(), r, cs, P, M, B, list, gap,
      sections: [['Layout', clean(layout)], ['Colors', clean(colors)], ['Typography', clean(type)], ['Appearance', clean(look)]]
        .filter(([, rows]) => rows.length),
      frame: el.tagName === 'IFRAME',
      quick: clean([layout[0], layout[3], gap && layout[5], colors[0]]),
    };
  }

  /* ---------- HTML builders ---------- */
  const rowHTML = ([k, v, o = {}]) => `<div class="row"><span class="k">${esc(k)}</span>
    <span class="v copy" data-copy="${esc(o.copy ?? v)}">${o.sub ? `<small>${esc(o.sub)}</small>` : ''}${o.swatch ? `<span class="dot" style="background:${esc(o.swatch)}"></span>` : ''}${esc(v)}</span></div>`;
  const nameHTML = (d) => `<div class="name"><span class="sw"></span><b title="${esc(d.name)}">${esc(d.name)}</b><span class="tag">${d.tag}</span></div>`;
  const frameNote = '<div class="note">Content inside embedded frames can’t be inspected.</div>';

  function boxesHTML(el, cls = '') {
    const d = inspect(el), { r, P, M, B } = d;
    const box = (x, y, w, h, c, bw = '') =>
      `<div class="box ${c}" style="left:${x}px;top:${y}px;width:${Math.max(0, w)}px;height:${Math.max(0, h)}px;${bw ? 'border-width:' + bw : ''}"></div>`;
    const m = M.map((v) => Math.max(0, v));
    let h = S.showMargin ? box(r.left - m[3], r.top - m[0], r.width + m[1] + m[3], r.height + m[0] + m[2], 'm', m.map((v) => v + 'px').join(' ')) : '';
    const px0 = r.left + B[3], py0 = r.top + B[0], pw = r.width - B[1] - B[3], ph = r.height - B[0] - B[2];
    h += box(px0, py0, pw, ph, 'p', P.map((v) => v + 'px').join(' '));
    const cw = pw - P[1] - P[3], chh = ph - P[0] - P[2];
    h += box(px0 + P[3], py0 + P[0], cw, chh, d.list.length > 1 ? 'hatch' : 'tint');
    if (S.showChildren) for (const k of d.list) { const kr = k.getBoundingClientRect(); h += box(kr.left, kr.top, kr.width, kr.height, 'kid'); }
    h += box(r.left, r.top, r.width, r.height, cls);
    return h;
  }

  function previewHTML(d) {
    const { r, P, M, B, list } = d, m = M.map((v) => Math.max(0, v));
    const ow = r.width + m[1] + m[3], oh = r.height + m[0] + m[2];
    const s = Math.min(300 / (ow || 1), 220 / (oh || 1), 4);
    const pos = (x, y, w, h) => `left:${x * s}px;top:${y * s}px;width:${Math.max(0, w * s)}px;height:${Math.max(0, h * s)}px;`;
    const bw = (a) => 'border-width:' + a.map((v) => v * s + 'px').join(' ') + ';';
    const bx = m[3] + B[3], by = m[0] + B[0], bwid = r.width - B[1] - B[3], bht = r.height - B[0] - B[2];
    let h = `<div class="stage" style="width:${ow * s}px;height:${oh * s}px">`;
    if (m.some(Boolean)) h += `<div style="${pos(0, 0, ow, oh)}${bw(m)}border-color:rgba(246,178,107,.45)"></div>`;
    h += `<div style="${pos(m[3], m[0], r.width, r.height)}outline:1px solid rgba(0,0,0,.12)"></div>`;
    h += `<div style="${pos(bx, by, bwid, bht)}${bw(P)}border-color:rgba(150,196,128,.65)"></div>`;
    h += `<div class="${list.length > 1 ? 'hatch' : 'tint'}" style="${pos(bx + P[3], by + P[0], bwid - P[1] - P[3], bht - P[0] - P[2])}"></div>`;
    for (const k of list) {
      const kr = k.getBoundingClientRect();
      const x = Math.max(0, kr.left - r.left + m[3]), y = Math.max(0, kr.top - r.top + m[0]);
      h += `<div class="kid" style="${pos(x, y, Math.min(kr.width, ow - x), Math.min(kr.height, oh - y))}"></div>`;
    }
    // padding labels where there's room
    const lab = (v, x, y) => (v * s >= 12 ? `<span class="plabel" style="left:${x * s}px;top:${y * s}px">${num(v)}</span>` : '');
    h += lab(P[0], bx + bwid / 2, by + P[0] / 2) + lab(P[2], bx + bwid / 2, by + bht - P[2] / 2)
      + lab(P[3], bx + P[3] / 2, by + bht / 2) + lab(P[1], bx + bwid - P[1] / 2, by + bht / 2);
    h += '</div><div class="legend">'
      + (m.some(Boolean) ? '<span><i class="lg" style="background:rgba(246,178,107,.6)"></i>Margin</span>' : '')
      + '<span><i class="lg" style="background:rgba(150,196,128,.8)"></i>Padding</span>'
      + `<span><i class="lg ${list.length > 1 ? 'hatch' : 'tint'}"></i>${list.length > 1 ? 'Gap' : 'Content'}</span>`
      + (list.length ? '<span><i class="lg kid"></i>Children</span>' : '')
      + '</div>';
    return h;
  }

  /* ---------- placement ---------- */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));
  // Try below, above, right, left of the element; if nothing fits, dock bottom-right.
  function place(node, r) {
    const vw = innerWidth, vh = innerHeight, g = 10, w = node.offsetWidth, h = node.offsetHeight;
    const cands = [
      [clamp(r.left, g, vw - w - g), r.bottom + g],
      [clamp(r.left, g, vw - w - g), r.top - h - g],
      [r.right + g, clamp(r.top, g, vh - h - g)],
      [r.left - w - g, clamp(r.top, g, vh - h - g)],
    ];
    const fit = cands.find(([x, y]) => x >= g && y >= g && x + w <= vw - g && y + h <= vh - g);
    const [x, y] = fit || [vw - w - 16, vh - h - 16];
    node.style.left = x + 'px';
    node.style.top = y + 'px';
  }

  /* ---------- render loop ---------- */
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };

  function render() {
    raf = 0;
    if (selected && !selected.isConnected) return renderStale();
    const target = selected || hovered;
    hint.textContent = selected ? 'Locked · Esc to release' : hovered ? 'Click to lock' : 'Hover any element';
    if (!target) { hl.innerHTML = ''; tip.hidden = true; return; }

    hl.innerHTML = boxesHTML(target, selected ? 'sel' : '')
      + (selected && hovered && hovered !== selected ? (() => { const r = hovered.getBoundingClientRect(); return `<div class="box outline" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px"></div>`; })() : '');

    const d = inspect(target);
    if (panelOpen && selected) {
      tip.hidden = true;
      const sig = JSON.stringify([d.sections, d.name, Math.round(d.r.width), Math.round(d.r.height), d.list.length]);
      if (sig !== panelSig) { panelSig = sig; panel.innerHTML = panelHTML(d); }
      return;
    }
    const sig = JSON.stringify([d.quick, d.name, !!selected]);
    if (sig !== tipSig) {
      tipSig = sig;
      tip.classList.toggle('locked', !!selected);
      tip.innerHTML = nameHTML(d) + d.quick.map(rowHTML).join('') + (d.frame ? frameNote : '')
        + (selected ? `<div class="actions">
            <button class="btn" data-act="parent" ${parentOf(selected) && selected !== document.documentElement ? '' : 'disabled'}>↑ Parent</button>
            <button class="btn" data-act="child" ${d.list.length ? '' : 'disabled'}>↓ Child</button>
            <button class="btn primary" data-act="details" style="margin-left:auto">Details</button></div>
            <div class="hintline">Click a value to copy · Arrow keys to move</div>` : '');
    }
    tip.hidden = false;
    place(tip, d.r);
  }

  function panelHTML(d) {
    const chain = [];
    for (let e = selected; e && chain.length < 5; e = parentOf(e)) { chain.unshift(e); if (e === document.body) break; }
    crumbEls = chain;
    return `<div class="ph" data-drag>
        <button class="btn" data-act="parent" title="Parent (↑)">↑</button>
        <button class="btn" data-act="child" title="First child (↓)" ${d.list.length ? '' : 'disabled'}>↓</button>
        <div class="crumbs">${chain.map((e, i) => `<button class="crumb ${e === selected ? 'cur' : ''}" data-act="crumb" data-i="${i}">${esc(nameOf(e))}</button>`).join('<span>›</span>')}</div>
        <button class="icon-btn" data-act="close" title="Close (Esc)">${X}</button></div>
      <div class="pb">
        <div class="card preview">${previewHTML(d)}</div>
        <div class="card props">${nameHTML(d)}${d.frame ? frameNote : ''}
          ${d.sections.map(([t, rows]) => `<div class="sec">${t}</div>${rows.map(rowHTML).join('')}`).join('')}</div>
      </div>
      <div class="foot">Click any value to copy · Drag the top bar to move · Drag the corner to resize</div>`;
  }
  let crumbEls = [];

  // Never show stale numbers: if the element left the page, say so.
  function renderStale() {
    hl.innerHTML = '';
    hint.textContent = 'Element removed';
    const msg = `<div class="name"><span class="sw"></span><b>Element unavailable</b></div>
      <p class="stale">This element is no longer on the page, so its values were cleared. Pick another element.</p>
      <div class="actions"><button class="btn primary" data-act="release">Pick another</button></div>`;
    if (panelOpen) { panel.innerHTML = `<div class="ph" data-drag><div class="crumbs"></div><button class="icon-btn" data-act="release">${X}</button></div><div class="card">${msg}</div>`; panelSig = 'stale'; }
    else { tip.innerHTML = msg; tip.classList.add('locked'); tip.hidden = false; tipSig = 'stale'; }
  }

  /* ---------- actions ---------- */
  const visibleSibling = (el, dir) => {
    for (let s = el[dir]; s; s = s[dir]) if (s !== host && s.getBoundingClientRect().width > 0) return s;
    return null;
  };
  function select(el) { if (!el) return; selected = el; tipSig = panelSig = ''; schedule(); }

  function openPanel() {
    if (!selected) return;
    panelOpen = true; panelSig = '';
    const vw = innerWidth, vh = innerHeight, w = Math.min(780, vw - 32), h = Math.min(520, vh - 32);
    const r = selected.getBoundingClientRect();
    // Open on the side of the screen away from the element so it stays visible.
    panel.style.width = w + 'px';
    panel.style.height = h + 'px';
    panel.style.left = (r.left + r.width / 2 < vw / 2 ? vw - w - 16 : 16) + 'px';
    panel.style.top = clamp(r.top, 16, vh - h - 16) + 'px';
    panel.hidden = false;
    schedule();
  }
  function closePanel() { panelOpen = false; panel.hidden = true; tipSig = ''; schedule(); }

  function act(a, btn) {
    if (a === 'parent') { const p = parentOf(selected); if (p && selected !== document.documentElement) select(p); }
    else if (a === 'child') select(kids(selected)[0]);
    else if (a === 'prev') select(visibleSibling(selected, 'previousElementSibling'));
    else if (a === 'next') select(visibleSibling(selected, 'nextElementSibling'));
    else if (a === 'details') openPanel();
    else if (a === 'close') closePanel();
    else if (a === 'crumb') select(crumbEls[+btn.dataset.i]);
    else if (a === 'release') { selected = null; closePanel(); }
    else if (a === 'settings') toggleSettings();
    else if (a === 'quit') destroy();
  }

  let toastTimer;
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const t = document.createElement('textarea');
      t.value = text; t.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
    }
    toastEl.textContent = 'Copied ' + (text.length > 48 ? text.slice(0, 48) + '…' : text);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1400);
  }

  /* ---------- events ---------- */
  const fromUI = (e) => e.composedPath().includes(host);

  function deepElementAt(x, y) {
    let el = document.elementFromPoint(x, y);
    while (el && el.shadowRoot && el !== host) {
      const inner = el.shadowRoot.elementFromPoint(x, y);
      if (!inner || inner === el) break;
      el = inner;
    }
    return el;
  }

  let lastX = -1, lastY = -1;
  function hitTest() {
    if (lastX < 0) return;
    const el = deepElementAt(lastX, lastY);
    if (el && el !== host && el !== hovered) hovered = el;
  }
  function onMove(e) {
    lastX = e.clientX; lastY = e.clientY;
    if (dragging || fromUI(e)) return;
    const prev = hovered;
    hitTest();
    if (hovered !== prev) schedule();
  }
  // Scrolling moves content under a still mouse, so re-check what's under the cursor.
  function onScroll() { if (!selected) hitTest(); schedule(); }
  // Swallow page clicks while inspecting so links/buttons don't fire.
  function onBlock(e) {
    if (fromUI(e)) return;
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'click' && !settingsEl.hidden) return toggleSettings(false);
    if (e.type === 'click' && hovered) select(hovered);
  }
  function onUIClick(e) {
    const set = e.target.closest('[data-set]');
    if (set) {
      const raw = set.dataset.val;
      return setSetting(set.dataset.set, raw === 'true' ? true : raw === 'false' ? false : isNaN(raw) ? raw : +raw);
    }
    if (!settingsEl.hidden && !e.target.closest('#settings, #gear')) toggleSettings(false);
    const btn = e.target.closest('[data-act]');
    if (btn) { e.stopPropagation(); return act(btn.dataset.act, btn); }
    const c = e.target.closest('[data-copy]');
    if (c && (selected || panelOpen)) copy(c.dataset.copy);
  }
  function onKey(e) {
    const t = e.target;
    if (t && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return;
    if (e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      if (!settingsEl.hidden) toggleSettings(false); else if (panelOpen) closePanel(); else if (selected) { selected = null; tipSig = ''; schedule(); } else destroy();
      return;
    }
    const map = { ArrowUp: 'parent', ArrowDown: 'child', ArrowLeft: 'prev', ArrowRight: 'next', Enter: 'details' };
    if (selected && map[e.key]) { e.preventDefault(); e.stopPropagation(); act(map[e.key]); }
  }

  // Dragging the detailed panel by its top bar.
  let dragging = null;
  root.addEventListener('mousedown', (e) => {
    const bar = e.target.closest('[data-drag]');
    if (!bar || e.target.closest('button')) return;
    dragging = { dx: e.clientX - panel.offsetLeft, dy: e.clientY - panel.offsetTop };
    e.preventDefault();
  });
  const onDrag = (e) => {
    if (!dragging) return;
    panel.style.left = clamp(e.clientX - dragging.dx, 0, innerWidth - 80) + 'px';
    panel.style.top = clamp(e.clientY - dragging.dy, 0, innerHeight - 40) + 'px';
  };
  const endDrag = () => { dragging = null; };

  const mo = new MutationObserver(schedule);
  mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });

  const listeners = [
    [window, 'mousemove', onMove], [window, 'mousemove', onDrag], [window, 'mouseup', endDrag],
    [window, 'click', onBlock], [window, 'mousedown', onBlock], [window, 'pointerdown', onBlock], [window, 'mouseup', onBlock],
    [window, 'keydown', onKey], [window, 'scroll', onScroll], [window, 'resize', schedule],
  ];
  listeners.forEach(([t, ev, fn]) => t.addEventListener(ev, fn, { capture: true, passive: ev === 'scroll' }));
  root.addEventListener('click', onUIClick);

  function destroy() {
    listeners.forEach(([t, ev, fn]) => t.removeEventListener(ev, fn, { capture: true }));
    mo.disconnect();
    cancelAnimationFrame(raf);
    host.remove();
    window.__designInspector = null;
    try { chrome.runtime.sendMessage({ type: 'di-state', active: false }); } catch {}
  }

  window.__designInspector = { destroy };
  try { chrome.runtime.sendMessage({ type: 'di-state', active: true }); } catch {}
  schedule();
})();
