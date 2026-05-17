// ═══════════════════════════════════════════
// LİSTE PATCH (İzle/Oku/Dinle) — üstü çizme + sil + arşiv
// index.html'deki mevcut addListe, renderListe, togListe, delListe
// fonksiyonlarını BU DOSYA EZER.
// </script> kapanış etiketinden ÖNCE ekle:
// <script src="liste-patch.js"></script>
// ═══════════════════════════════════════════

const tEmoji = { kitap: '📚', film: '🎬', dizi: '📺', 'albüm': '🎵' };

function addListe() {
  const v = $('lI').value.trim();
  if (!v) return;
  S.liste.push({ id: Date.now(), name: v, type: $('lT').value, done: false });
  sv('liste', S.liste);
  $('lI').value = '';
  renderListe();
}

function renderListe() {
  const g = $('listeGrid');
  const em = $('listeEmpty');
  const aktif = S.liste.filter(i => !i.done);
  const arsiv = S.liste.filter(i => i.done);

  if (!S.liste.length) {
    g.innerHTML = '';
    em.style.display = 'block';
    return;
  }
  em.style.display = 'none';

  let html = '';

  // Aktif öğeler — grid
  if (aktif.length) {
    html += `<div class="media-grid" style="margin-bottom:10px">` +
      aktif.map(item => `
        <div class="media-card" onclick="togListe(${item.id})">
          <button class="media-x" onclick="event.stopPropagation();delListe(${item.id})">×</button>
          <div class="media-type">${tEmoji[item.type] || '✦'} ${item.type}</div>
          <div class="media-title">${item.name}</div>
        </div>`).join('') +
      `</div>`;
  }

  // Arşiv
  if (arsiv.length) {
    html += `
      <div style="margin-top:4px">
        <div class="ct" style="display:flex;align-items:center;justify-content:space-between">
          <span>✅ Tamamlananlar (${arsiv.length})</span>
          <button onclick="clearListeArsiv()" style="background:none;border:none;color:var(--tx4);font-size:11px;cursor:pointer;font-weight:700">hepsini sil</button>
        </div>
        <div class="media-grid">
          ${arsiv.map(item => `
            <div class="media-card media-done" onclick="togListe(${item.id})">
              <button class="media-x" onclick="event.stopPropagation();delListe(${item.id})">×</button>
              <div class="media-type">${tEmoji[item.type] || '✦'} ${item.type}</div>
              <div class="media-title">${item.name}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  g.innerHTML = html;
}

function togListe(id) {
  const x = S.liste.find(i => i.id === id);
  if (x) { x.done = !x.done; sv('liste', S.liste); renderListe(); }
}

function delListe(id) {
  S.liste = S.liste.filter(i => i.id !== id);
  sv('liste', S.liste); renderListe();
}

function clearListeArsiv() {
  S.liste = S.liste.filter(i => !i.done);
  sv('liste', S.liste); renderListe();
}

renderListe();
