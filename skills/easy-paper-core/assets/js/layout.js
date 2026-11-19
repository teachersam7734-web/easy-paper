// Easy Paper layout pass: draws mind-map connectors and reports overflow before PDF export.
(async function () {
  try { await document.fonts.ready; } catch (e) {}
  window.__epOverflow = [];
  document.querySelectorAll('.mindmap').forEach(function (mm) {
    var svg = mm.querySelector('.mm-svg');
    var box = mm.getBoundingClientRect();
    var c = mm.querySelector('.mm-center').getBoundingClientRect();
    var cx = c.left + c.width / 2 - box.left, cy = c.top + c.height / 2 - box.top, rad = c.width / 2;
    var paths = '';
    mm.querySelectorAll('.mm-card').forEach(function (card) {
      var r = card.getBoundingClientRect();
      var left = card.classList.contains('l');
      var x2 = (left ? r.right : r.left) - box.left;
      var y2 = r.top + Math.min(r.height / 2, 9 * 3.78) - box.top;
      var ang = Math.atan2(y2 - cy, x2 - cx);
      var x1 = cx + rad * Math.cos(ang), y1 = cy + rad * Math.sin(ang);
      var mx = (x1 + x2) / 2;
      var col = getComputedStyle(card).getPropertyValue('--c').trim() || '#0AA5C2';
      paths += '<path d="M' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' C' + mx.toFixed(1) + ',' + y1.toFixed(1) + ' ' + mx.toFixed(1) + ',' + y2.toFixed(1) + ' ' + x2.toFixed(1) + ',' + y2.toFixed(1) + '" stroke="' + col + '"/>' +
               '<circle cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="3" fill="' + col + '"/>';
    });
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    svg.innerHTML = paths;
  });
  document.querySelectorAll('.sheet').forEach(function (s) {
    var body = s.querySelector('.sheet-body') || s;
    var over = body.scrollHeight - body.clientHeight;
    if (over > 2) window.__epOverflow.push('sheet ' + (s.dataset.sheet || '?') + ' overflows by ~' + Math.round(over / 3.78) + ' mm; cut or tighten content');
  });
  document.querySelectorAll('.unknown').forEach(function (u) { window.__epOverflow.push(u.textContent); });
  window.__epLayoutDone = true;
})();
