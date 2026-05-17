// ═══════════════════════════════════════════
// SINAVLAR PATCH — üstü çizme + sil + arşiv
// index.html'deki mevcut addSinav, renderSinavlar, togSinav, delSinav
// fonksiyonlarını BU DOSYA EZER.
// </script> kapanış etiketinden ÖNCE ekle:
// <script src="sinav-patch.js"></script>
// ═══════════════════════════════════════════

function addSinav() {
  const v = $('sI').value.trim();
  if (!v) return;
  S.sinavlar.push({ id: Date.now(), name: v, date: $('sD').value, type: $('sT').value, done: false });
  sv('sinavlar', S.sinavlar);
  $('sI').value = ''; $('sD').value = '';
  renderSinavlar(); updateStats(); renderCal();
}

function renderSinavlar() {
  const el = $('sinavList');
  const icons = { sınav: '📝', ödev: '📋', teslim: '📦', sunum: '🎤' };
  const aktif = S.sinavlar.filter(s => !s.done).sort((a, b) => (!a.date && !b.date) ? 0 : !a.date ? 1 : !b.date ? -1 : new Date(a.date) - new Date(b.date));
  const arsiv = S.sinavlar.filter(s => s.done).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  if (!S.sinavlar.length) {
    el.innerHTML = '<div class="empty"><div class="ei">📋</div>sınav yok</div>';
    return;
  }

  let html = '';

  if (aktif.length) {
    html += aktif.map(s => `
      <div class="li">
        <button class="chk" onclick="togSinav(${s.id})"></button>
        <div class="li-main">
          <div class="li-t">${icons[s.type] || '📝'} ${s.name}${urgChip(dLeft(s.date))}</div>
          ${s.date ? `<div class="li-s">${new Date(s.date + 'T12:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>` : ''}
        </div>
        <button class="xbtn" onclick="delSinav(${s.id})">×</button>
      </div>`).join('');
  } else {
    html += '<div class="empty" style="padding:8px 0"><div class="ei">📋</div>aktif sınav yok</div>';
  }

  if (arsiv.length) {
    html += `
      <div style="margin-top:14px">
        <div class="ct" style="display:flex;align-items:center;justify-content:space-between">
          <span>✅ Tamamlananlar (${arsiv.length})</span>
          <button onclick="clearSinavArsiv()" style="background:none;border:none;color:var(--tx4);font-size:11px;cursor:pointer;font-weight:700">hepsini sil</button>
        </div>
        ${arsiv.map(s => `
          <div class="li" style="opacity:.5">
            <button class="chk ok" onclick="togSinav(${s.id})"></button>
            <div class="li-main">
              <div class="li-t" style="text-decoration:line-through">${icons[s.type] || '📝'} ${s.name}</div>
              ${s.date ? `<div class="li-s">${new Date(s.date + 'T12:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>` : ''}
            </div>
            <button class="xbtn" onclick="delSinav(${s.id})">×</button>
          </div>`).join('')}
      </div>`;
  }

  el.innerHTML = html;
}

function togSinav(id) {
  const s = S.sinavlar.find(x => x.id === id);
  if (s) { s.done = !s.done; sv('sinavlar', S.sinavlar); renderSinavlar(); updateStats(); }
}

function delSinav(id) {
  S.sinavlar = S.sinavlar.filter(x => x.id !== id);
  sv('sinavlar', S.sinavlar); renderSinavlar(); updateStats(); renderCal();
}

function clearSinavArsiv() {
  S.sinavlar = S.sinavlar.filter(s => !s.done);
  sv('sinavlar', S.sinavlar); renderSinavlar(); updateStats(); renderCal();
}

renderSinavlar();
