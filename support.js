/* support.js — DCLogic runtime for Article One.dc.html */
(function () {
  'use strict';

  // SVG camelCase attribute → hyphenated form
  const SVG_ATTR = {
    strokewidth: 'stroke-width', vectoreffect: 'vector-effect',
    strokelinejoin: 'stroke-linejoin', strokelinecap: 'stroke-linecap',
    fillopacity: 'fill-opacity', strokeopacity: 'stroke-opacity',
    textanchor: 'text-anchor', dominantbaseline: 'dominant-baseline',
    preserveaspectratio: 'preserveAspectRatio',
  };

  // ── Helpers ────────────────────────────────────────────────────────

  function safeGet(obj, path) {
    if (!path || obj == null) return undefined;
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    const parts = path.split('.');
    let v = obj;
    for (const p of parts) { if (v == null) return undefined; v = v[p]; }
    return v;
  }

  function getExpr(val) {
    const m = val && val.match(/^\{\{\s*(.+?)\s*\}\}$/);
    return m ? m[1] : null;
  }

  function interpolateStr(str, vals) {
    if (!str || !str.includes('{{')) return str;
    return str.replace(/\{\{\s*(.+?)\s*\}\}/g, (_, expr) => {
      const v = safeGet(vals, expr);
      if (v == null || typeof v === 'function') return '';
      return String(v);
    });
  }

  // ── DOM template engine ────────────────────────────────────────────

  function processElement(el, vals) {
    const children = [...el.childNodes];
    for (const node of children) {
      if (!node.parentNode) continue;
      if (node.nodeType === 3) {
        const s = interpolateStr(node.textContent, vals);
        if (s !== node.textContent) node.textContent = s;
      } else if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'sc-for') expandScFor(node, vals);
        else if (tag === 'sc-if') expandScIf(node, vals);
        else { processAttrs(node, vals); processElement(node, vals); }
      }
    }
  }

  function cloneChildren(src, dest) {
    for (const child of src.childNodes) dest.appendChild(child.cloneNode(true));
  }

  function expandScFor(node, vals) {
    const listExpr = getExpr(node.getAttribute('list') || '');
    const alias = node.getAttribute('as');
    const parent = node.parentNode;
    if (!parent) return;
    const list = listExpr ? safeGet(vals, listExpr) : null;
    if (Array.isArray(list) && alias) {
      const frag = document.createDocumentFragment();
      for (const item of list) {
        const iv = Object.create(vals);
        iv[alias] = item;
        const w = node.cloneNode(false);
        cloneChildren(node, w);
        processElement(w, iv);
        while (w.firstChild) frag.appendChild(w.firstChild);
      }
      parent.replaceChild(frag, node);
    } else {
      parent.removeChild(node);
    }
  }

  function expandScIf(node, vals) {
    const expr = getExpr(node.getAttribute('value') || '');
    const parent = node.parentNode;
    if (!parent) return;
    const ok = expr ? safeGet(vals, expr) : false;
    if (ok) {
      const w = node.cloneNode(false);
      cloneChildren(node, w);
      processElement(w, vals);
      const frag = document.createDocumentFragment();
      while (w.firstChild) frag.appendChild(w.firstChild);
      parent.replaceChild(frag, node);
    } else {
      parent.removeChild(node);
    }
  }

  function processAttrs(node, vals) {
    const rm = [], set = [];
    for (const attr of [...node.attributes]) {
      const name = attr.name, lower = name.toLowerCase(), value = attr.value;

      // Event handlers
      if (/^on[a-z]+$/i.test(name)) {
        const expr = getExpr(value);
        if (expr) {
          const fn = safeGet(vals, expr);
          if (typeof fn === 'function') {
            let evt = lower.slice(2);
            // React onChange → input event; onClick on SVG paths works via click
            if (evt === 'change') evt = 'input';
            node.addEventListener(evt, fn);
          }
        }
        rm.push(name);
        continue;
      }

      // ref
      if (lower === 'ref') {
        const expr = getExpr(value);
        if (expr) {
          const ref = safeGet(vals, expr);
          if (ref && typeof ref === 'object' && 'current' in ref) ref.current = node;
        }
        rm.push(name);
        continue;
      }

      // style-hover
      if (lower === 'style-hover') {
        const hStyle = interpolateStr(value, vals);
        // Capture the base style lazily on enter (by then the `style`
        // attribute's {{ }} placeholders are interpolated); restore it on
        // leave. Capturing up front would memoize the raw template string.
        let base = null;
        node.addEventListener('mouseenter', () => {
          base = node.getAttribute('style') || '';
          node.setAttribute('style', base + ';' + hStyle);
        });
        node.addEventListener('mouseleave', () => {
          if (base !== null) node.setAttribute('style', base);
        });
        rm.push(name);
        continue;
      }

      // Design-tool hints — drop silently
      if (lower.startsWith('hint-')) { rm.push(name); continue; }

      // Regular attribute — interpolate and fix SVG camelCase
      if (value.includes('{{')) {
        const newVal = interpolateStr(value, vals);
        const mapped = SVG_ATTR[lower];
        if (mapped) { rm.push(name); set.push([mapped, newVal]); }
        else set.push([name, newVal]);
        // Sync .value property for controlled inputs
        if (lower === 'value' && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
          node.value = newVal;
        }
      } else {
        const mapped = SVG_ATTR[lower];
        if (mapped) { rm.push(name); set.push([mapped, value]); }
      }
    }
    rm.forEach(n => node.removeAttribute(n));
    set.forEach(([n, v]) => node.setAttribute(n, v));
  }

  // ── Component lifecycle ────────────────────────────────────────────

  let _inst = null, _cont = null, _tpl = '';
  let _rafPending = false;

  class DCLogic {
    constructor(props) { this.props = props || {}; }
    setState(updates) {
      Object.assign(this.state, updates);
      if (!_rafPending) {
        _rafPending = true;
        requestAnimationFrame(() => { _rafPending = false; _render(); });
      }
    }
  }

  window.DCLogic = DCLogic;

  // Stable-ish signature for a focusable field, used to re-find it after a
  // full-DOM rebuild so we can restore focus + caret.
  function _fieldSig(el) {
    return el.tagName + '|' + (el.getAttribute('placeholder') || '') +
      '|' + (el.getAttribute('name') || '') + '|' + (el.type || '');
  }

  function _render() {
    if (!_inst || !_cont) return;

    // Capture focus + caret before the rebuild blows the live input away.
    const active = document.activeElement;
    let focusInfo = null;
    if (active && _cont.contains(active) &&
        (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      const sig = _fieldSig(active);
      const peers = [..._cont.querySelectorAll('input, textarea')].filter(e => _fieldSig(e) === sig);
      focusInfo = { sig, index: peers.indexOf(active) };
      try { focusInfo.start = active.selectionStart; focusInfo.end = active.selectionEnd; } catch (e) {}
    }

    const vals = _inst.renderVals();
    const tmp = document.createElement('div');
    tmp.innerHTML = _tpl;
    processElement(tmp, vals);
    // Move nodes into container (preserves attached event listeners)
    _cont.innerHTML = '';
    while (tmp.firstChild) _cont.appendChild(tmp.firstChild);

    // Restore focus + caret to the matching field in the freshly built DOM.
    if (focusInfo && focusInfo.index >= 0) {
      const peers = [..._cont.querySelectorAll('input, textarea')].filter(e => _fieldSig(e) === focusInfo.sig);
      const next = peers[focusInfo.index];
      if (next) {
        next.focus();
        if (focusInfo.start != null && next.setSelectionRange) {
          try { next.setSelectionRange(focusInfo.start, focusInfo.end); } catch (e) {}
        }
      }
    }
  }

  // ── Bootstrap ─────────────────────────────────────────────────────

  function _boot() {
    const xdc = document.querySelector('x-dc');
    if (!xdc) return;

    // Apply <helmet> to <head>
    const helmet = xdc.querySelector('helmet');
    if (helmet) {
      [...helmet.children].forEach(ch => {
        if (/^(link|style)$/i.test(ch.tagName)) document.head.appendChild(ch.cloneNode(true));
        if (ch.tagName === 'SCRIPT' && !ch.src) {
          const s = document.createElement('script'); s.textContent = ch.textContent;
          document.head.appendChild(s);
        }
      });
      helmet.remove();
    }

    // Snapshot template HTML
    _tpl = xdc.innerHTML;

    // Create mount container
    _cont = document.createElement('div');
    _cont.id = '_dc_root';
    xdc.replaceWith(_cont);

    // Find and evaluate component script
    const compScript = document.querySelector('script[type="text/x-dc"][data-dc-script]');
    if (!compScript) { console.error('support.js: no component script'); return; }

    let propsSchema = {};
    try { propsSchema = JSON.parse(compScript.getAttribute('data-props') || '{}'); } catch (e) {}
    const props = {};
    for (const [k, v] of Object.entries(propsSchema)) {
      if (v && v.default !== undefined) props[k] = v.default;
    }

    // React stub (only createRef is needed)
    const React = { createRef: () => ({ current: null }) };

    // Evaluate component class
    let ComponentClass;
    try {
      ComponentClass = new Function('DCLogic', 'React',
        compScript.textContent + '\nreturn Component;'
      )(DCLogic, React);
    } catch (e) { console.error('support.js: component eval failed', e); return; }

    _inst = new ComponentClass(props);
    _render();
  }

  function _waitForData() {
    const ready = () =>
      window.MEMBERS && window.__dcPathsReady &&
      window.COMMITTEES && window.STAFF && window.FINANCE;

    if (ready()) { _boot(); return; }

    document.addEventListener('dc:paths-ready', () => { if (ready()) _boot(); });
    let n = 0;
    const t = setInterval(() => {
      if (ready()) { clearInterval(t); _boot(); }
      if (++n > 80) clearInterval(t);
    }, 100);
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', _waitForData);
  else
    _waitForData();

})();
