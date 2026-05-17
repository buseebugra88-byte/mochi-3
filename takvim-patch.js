// ═══════════════════════════════════════════
// TAKVİM PATCH — etkinliklere sil butonu
// index.html'deki mevcut renderCalEvents ve addEvent
// fonksiyonlarını BU DOSYA EZER.
// </script> kapanış etiketinden ÖNCE ekle:
// <script src="takvim-patch.js"></script>
// ═══════════════════════════════════════════

function addEvent() {
  const d = $('evDate').value, n = $('evName').value.trim();
  if (!d || !n) return;
  S.events.push({ id: Date.now(), date: d, name: n });
  sv('events', S.events);
  $('evDate').value = ''; $('evName').value = '';
  renderCal(); updateStats();
}

function delEvent(id) {
  S.events = S.events.filter(x => x.id !== id);
  sv('events', S.events);
  renderCal(); updateStats();
}

function renderCalEvents() {
  const el = $('calEvents');
  const icons = { etkinlik: '📌', sınav: '📝', ödev: '📋', teslim: '📦', sunum: '🎤', tez: '🎓' };

  const all = [
    ...S.events.map(e => ({ ...e, etype: 'etkinlik', deletable: true })),
    ...S.sinavlar.filter(e => e.date && !e.done).map(e => ({ date: e.date, name: e.name, etype: e.type, id: e.id, deletable: false })),
    ...S.tezDates.filter(e => e.date).map(e => ({ date: e.date, name: e.name, etype: 'tez', id: e.id, deletable: false })),
  ].filter(e => {
    if (!e.date) return false;
    const d = new Date(e.date + 'T12:00');
    return d.getMonth() === calM && d.getFullYear() === calY;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!all.length) {
    el.innerHTML = '<div class="empty" style="padding:10px 0">bu ayda etkinlik yok 🌸</div>';
    return;
  }

  el.innerHTML = all.map(e => `
    <div class="cal-ev-item" style="display:flex;align-items:center;gap:8px">
      <div style="flex:1">
        <div class="cal-ev-date">${new Date(e.date + 'T12:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</div>
        ${icons[e.etype] || '📌'} ${e.name}
      </div>
      ${e.deletable ? `<button onclick="delEvent(${e.id})" style="background:none;border:none;color:var(--tx4);font-size:16px;cursor:pointer;padding:2px 6px;flex-shrink:0">×</button>` : ''}
    </div>`).join('');
}
