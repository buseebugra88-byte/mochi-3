// ═══════════════════════════════════════════
// MAKALE PATCH — üstü çizme + sil + arşiv
// index.html'deki mevcut addMakale, renderMakale, togMakale, delMakale
// fonksiyonlarını BU DOSYA EZER.
// </script> kapanış etiketinden ÖNCE ekle:
// <script src="makale-patch.js"></script>
// ═══════════════════════════════════════════

function addMakale() {
  const v = $('mklI').value.trim();
  if (!v) return;
  S.makale.push({ id: Date.now(), name: v, url: $('mklU').value.trim(), note: $('mklN').value.trim(), done: false });
  sv('makale', S.makale);
  $('mklI').value = ''; $('mklU').value = ''; $('mklN').value = '';
  renderMakale();
}

function renderMakale() {
  const el = $('makaleList');
  const aktif = S.makale.filter(m => !m.done);
  const arsiv = S.makale.filter(m => m.done);

  if (!S.makale.length) {
    el.innerHTML = '<div class="empty"><div class="ei">📰</div>makale yok</div>';
    return;
  }

  let html = '';

  if (aktif.length) {
    html += aktif.map(m => `
      <div class="mkcard">
        <div class="mkcard-t">${m.name}</div>
        ${m.url ? `<a class="mkcard-u" href="${m.url}" target="_blank">${m.url}</a>` : ''}
        ${m.note ? `<div class="mkcard-n">${m.note}</div>` : ''}
        <div class="mkcard-acts">
          <button class="mkbtn" style="background:var(--mintd);color:#fff" onclick="togMakale(${m.id})">✓ okundu</button>
          <button class="mkbtn" style="background:var(--lavl);color:var(--lavd)" onclick="delMakale(${m.id})">sil</button>
        </div>
      </div>`).join('');
  } else {
    html += '<div class="empty" style="padding:8px 0"><div class="ei">📰</div>okunacak makale yok</div>';
  }

  if (arsiv.length) {
    html += `
      <div style="margin-top:14px">
        <div class="ct" style="display:flex;align-items:center;justify-content:space-between">
          <span>✅ Okunanlar (${arsiv.length})</span>
          <button onclick="clearMakaleArsiv()" style="background:none;border:none;color:var(--tx4);font-size:11px;cursor:pointer;font-weight:700">hepsini sil</button>
        </div>
        ${arsiv.map(m => `
          <div class="mkcard" style="opacity:.5">
            <div class="mkcard-t" style="text-decoration:line-through">${m.name}</div>
            ${m.url ? `<a class="mkcard-u" href="${m.url}" target="_blank">${m.url}</a>` : ''}
            ${m.note ? `<div class="mkcard-n">${m.note}</div>` : ''}
            <div class="mkcard-acts">
              <button class="mkbtn" style="background:var(--lavl);color:var(--lavd)" onclick="togMakale(${m.id})">↩ geri al</button>
              <button class="mkbtn" style="background:var(--lavl);color:var(--lavd)" onclick="delMakale(${m.id})">sil</button>
            </div>
          </div>`).join('')}
      </div>`;
  }

  el.innerHTML = html;
}

function togMakale(id) {
  const m = S.makale.find(x => x.id === id);
  if (m) { m.done = !m.done; sv('makale', S.makale); renderMakale(); }
}

function delMakale(id) {
  S.makale = S.makale.filter(x => x.id !== id);
  sv('makale', S.makale); renderMakale();
}

function clearMakaleArsiv() {
  S.makale = S.makale.filter(m => !m.done);
  sv('makale', S.makale); renderMakale();
}

renderMakale();
