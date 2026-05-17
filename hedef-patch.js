// ═══════════════════════════════════════════
// HEDEF PATCH — üstü çizme + sil + arşiv
// index.html'deki mevcut renderHedef, togHedef, delHedef, addHedef
// fonksiyonlarını BU DOSYANIN ALTI EZER.
// </script> kapanış etiketinden ÖNCE ekle:
// <script src="hedef-patch.js"></script>
// ═══════════════════════════════════════════

function addHedef() {
  const v = $('hI').value.trim();
  if (!v) return;
  const steps = Math.max(1, Math.min(7, parseInt($('hS').value) || 5));
  S.hedef.push({ id: Date.now(), name: v, steps, done: new Array(steps).fill(false), completed: false });
  sv('hedef', S.hedef);
  $('hI').value = ''; $('hS').value = '';
  renderHedef();
}

function renderHedef() {
  const el = $('hedefList');
  const actif = S.hedef.filter(h => !h.completed);
  const arsiv = S.hedef.filter(h => h.completed);

  if (!S.hedef.length) {
    el.innerHTML = '<div class="empty"><div class="ei">🎯</div>hedef yok</div>';
    return;
  }

  let html = '';

  // Aktif hedefler
  if (actif.length) {
    html += actif.map(h => {
      const dc = h.done.filter(Boolean).length;
      const pct = Math.round(dc / h.steps * 100);
      return `
        <div class="hcard" id="hcard-${h.id}">
          <div class="hcard-h">
            <div class="hcard-n">${h.name}</div>
            <div style="display:flex;gap:6px;align-items:center">
              <span style="font-family:var(--serif);font-size:15px;color:var(--lavd);font-style:italic">${pct}%</span>
              ${pct === 100 ? `<button onclick="completeHedef(${h.id})" style="background:var(--mintl);border:none;border-radius:8px;padding:4px 10px;color:var(--mintd);font-size:11px;font-weight:800;cursor:pointer">✓ Tamamla</button>` : ''}
              <button class="xbtn" onclick="delHedef(${h.id})">×</button>
            </div>
          </div>
          <div class="hprog"><div class="hbar" style="width:${pct}%"></div></div>
          <div class="hsteps">${h.done.map((d, i) => `<button class="hstep ${d ? 'ok' : ''}" onclick="togHedef(${h.id},${i})">${i + 1}</button>`).join('')}</div>
        </div>`;
    }).join('');
  } else {
    html += '<div class="empty" style="padding:10px 0"><div class="ei">🎯</div>aktif hedef yok</div>';
  }

  // Arşiv
  if (arsiv.length) {
    html += `
      <div style="margin-top:14px">
        <div class="ct" style="display:flex;align-items:center;justify-content:space-between">
          <span>✅ Tamamlananlar (${arsiv.length})</span>
          <button onclick="clearHedefArsiv()" style="background:none;border:none;color:var(--tx4);font-size:11px;cursor:pointer;font-weight:700">hepsini sil</button>
        </div>
        ${arsiv.map(h => `
          <div class="hcard" style="opacity:.5">
            <div class="hcard-h">
              <div class="hcard-n" style="text-decoration:line-through">${h.name}</div>
              <div style="display:flex;gap:6px;align-items:center">
                <button onclick="restoreHedef(${h.id})" style="background:var(--lavl);border:none;border-radius:8px;padding:4px 10px;color:var(--lavd);font-size:11px;font-weight:800;cursor:pointer">↩</button>
                <button class="xbtn" onclick="delHedef(${h.id})">×</button>
              </div>
            </div>
          </div>`).join('')}
      </div>`;
  }

  el.innerHTML = html;
}

function togHedef(id, i) {
  const h = S.hedef.find(x => x.id === id);
  if (h) { h.done[i] = !h.done[i]; sv('hedef', S.hedef); renderHedef(); }
}

function completeHedef(id) {
  const h = S.hedef.find(x => x.id === id);
  if (h) { h.completed = true; sv('hedef', S.hedef); renderHedef(); }
}

function restoreHedef(id) {
  const h = S.hedef.find(x => x.id === id);
  if (h) { h.completed = false; sv('hedef', S.hedef); renderHedef(); }
}

function delHedef(id) {
  S.hedef = S.hedef.filter(x => x.id !== id);
  sv('hedef', S.hedef); renderHedef();
}

function clearHedefArsiv() {
  S.hedef = S.hedef.filter(h => !h.completed);
  sv('hedef', S.hedef); renderHedef();
}

renderHedef();
