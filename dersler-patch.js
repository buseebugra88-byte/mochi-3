// ═══════════════════════════════════════════
// DERSLER PATCH — üstü çizme + sil + arşiv
// index.html'deki mevcut addDers, renderDersler, togDers, delDers
// fonksiyonlarını BU DOSYA EZER.
// </script> kapanış etiketinden ÖNCE ekle:
// <script src="dersler-patch.js"></script>
// ═══════════════════════════════════════════

function addDers() {
  const v = $('dI').value.trim();
  if (!v) return;
  S.dersler.push({ id: Date.now(), name: v, note: $('dN').value.trim(), done: false });
  sv('dersler', S.dersler);
  $('dI').value = ''; $('dN').value = '';
  renderDersler(); updateStats();
}

function renderDersler() {
  const el = $('dersList');
  const aktif = S.dersler.filter(d => !d.done);
  const arsiv = S.dersler.filter(d => d.done);

  if (!S.dersler.length) {
    el.innerHTML = '<div class="empty"><div class="ei">📚</div>henüz ders yok</div>';
    return;
  }

  let html = '';

  if (aktif.length) {
    html += aktif.map(d => `
      <div class="li">
        <button class="chk" onclick="togDers(${d.id})"></button>
        <div class="li-main">
          <div class="li-t">${d.name}</div>
          ${d.note ? `<div class="li-s">${d.note}</div>` : ''}
        </div>
        <button class="xbtn" onclick="delDers(${d.id})">×</button>
      </div>`).join('');
  } else {
    html += '<div class="empty" style="padding:8px 0"><div class="ei">📚</div>aktif ders yok</div>';
  }

  if (arsiv.length) {
    html += `
      <div style="margin-top:14px">
        <div class="ct" style="display:flex;align-items:center;justify-content:space-between">
          <span>✅ Tamamlananlar (${arsiv.length})</span>
          <button onclick="clearDersArsiv()" style="background:none;border:none;color:var(--tx4);font-size:11px;cursor:pointer;font-weight:700">hepsini sil</button>
        </div>
        ${arsiv.map(d => `
          <div class="li" style="opacity:.5">
            <button class="chk ok" onclick="togDers(${d.id})"></button>
            <div class="li-main">
              <div class="li-t" style="text-decoration:line-through">${d.name}</div>
              ${d.note ? `<div class="li-s">${d.note}</div>` : ''}
            </div>
            <button class="xbtn" onclick="delDers(${d.id})">×</button>
          </div>`).join('')}
      </div>`;
  }

  el.innerHTML = html;
}

function togDers(id) {
  const d = S.dersler.find(x => x.id === id);
  if (d) { d.done = !d.done; sv('dersler', S.dersler); renderDersler(); updateStats(); }
}

function delDers(id) {
  S.dersler = S.dersler.filter(x => x.id !== id);
  sv('dersler', S.dersler); renderDersler(); updateStats();
}

function clearDersArsiv() {
  S.dersler = S.dersler.filter(d => !d.done);
  sv('dersler', S.dersler); renderDersler(); updateStats();
}

renderDersler();
