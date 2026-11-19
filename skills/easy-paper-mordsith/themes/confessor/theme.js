(() => {
  const plate = document.querySelector('[data-folio-plate]');
  const canvas = plate.querySelector('canvas');
  const context = canvas.getContext('2d');
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = plate.querySelector('[data-folio-motion]');
  const audioButton = plate.querySelector('.folio-sound');
  const buttons = [...plate.querySelectorAll('[data-lens]')];
  const description = plate.querySelector('[data-lens-description]');
  const link = plate.querySelector('[data-lens-link]');
  const lenses = [
    {id: 'deep-dive', title: 'Deep Dive', note: 'Follow the paper’s argument.', light: -.66, tilt: -.19},
    {id: 'critique', title: 'Critique', note: 'Inspect the claims and their limits.', light: .86, tilt: .23},
    {id: 'review-guide', title: 'Review Guide', note: 'Rehearse what you need to recall.', light: -.15, tilt: -.43},
    {id: 'vocab-treasure', title: 'Vocab Treasure', note: 'Practice the paper’s academic language.', light: -1.08, tilt: .48},
  ];
  const plateReading = document.createElement('div');
  plateReading.className = 'folio-reading';
  const modeCounts = lenses.map(lens => {
    const panel = document.getElementById(lens.id);
    const terms = panel?.querySelectorAll('.vocab-card').length || 0;
    const sections = panel?.querySelectorAll('.study-card').length || 0;
    return terms ? terms + ' glossary entries' : sections + (sections === 1 ? ' section' : ' sections');
  });
  plate.querySelector('.folio-art').after(plateReading);

  const rim = 244;
  const globe = document.createElement('canvas');
  globe.width = globe.height = rim;
  const surface = globe.getContext('2d');
  const pixels = surface.createImageData(rim, rim);
  const sphere = [];
  for (let py = 0; py < rim; py++) {
    const y = 1 - (2 * py + 1) / rim;
    for (let px = 0; px < rim; px++) {
      const x = (2 * px + 1) / rim - 1;
      const rs = 1 - x * x - y * y;
      if (rs >= 0) sphere.push([4 * (py * rim + px), x, y, Math.sqrt(rs)]);
    }
  }
  const mapWidth = 512, mapHeight = 256;
  let texture;
  const map = new Image();
  map.addEventListener('load', () => {
    const sheet = document.createElement('canvas');
    sheet.width = mapWidth; sheet.height = mapHeight;
    const image = sheet.getContext('2d', {willReadFrequently: true});
    image.drawImage(map, 0, 0, mapWidth, mapHeight);
    texture = image.getImageData(0, 0, mapWidth, mapHeight).data;
    paint();
  }, {once: true});
  map.src = '{{ASSET:lroc_color_poles_1k.jpg}}';
  const stars = Array.from({length: 164}, (_, i) => {
    const f = n => n - Math.floor(n);
    const n = i + 1;
    return [f(n * .75487766), f(n * .56984029), f(n * .61803399), f(n * .41421356)];
  });

  let move = !motionQuery.matches, visible = false, active = 0, clock = 0, frame = 0, last = 0;
  let light = lenses[0].light, tilt = lenses[0].tilt;
  let aimX = 0, aimY = 0, x = 0, y = 0, audio;
  canvas.addEventListener('pointermove', event => {
    if (!move || motionQuery.matches) return;
    const box = canvas.getBoundingClientRect();
    aimX = 2 * (event.clientX - box.left) / box.width - 1;
    aimY = 2 * (event.clientY - box.top) / box.height - 1;
  });
  canvas.addEventListener('pointerleave', () => { aimX = 0; aimY = 0; });

  function lunarDisc() {
    const yaw = tilt * .75 + Math.sin(clock * .42) * .16 + x * .61;
    const pitch = y * .35 + .13;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const sunX = Math.sin(light), sunZ = Math.cos(light) * .91;
    for (const [i, nx, ny, nz] of sphere) {
      // Map the analytically intersected sphere normal back onto an equirectangular surface.
      const ry = ny * cp - nz * sp;
      const rz = ny * sp + nz * cp;
      const xx = nx * cy + rz * sy;
      const zz = rz * cy - nx * sy;
      let albedo;
      if (texture) {
        const u = ((.5 + Math.atan2(xx, zz) / (2 * Math.PI)) * mapWidth) | 0;
        const v = Math.min(mapHeight - 1, Math.floor((.5 - Math.asin(ry) / Math.PI) * mapHeight));
        const offset = 4 * (v * mapWidth + (u % mapWidth));
        albedo = (.20 * texture[offset] + .72 * texture[offset + 1] + .08 * texture[offset + 2]) / 255;
      } else {
        const maria = Math.sin(14 * xx + 3 * Math.sin(ry * 7)) * Math.sin(ry * 18 + zz * 5);
        albedo = .56 + maria * .13 + .045 * Math.sin(xx * 131 + ry * 89);
      }
      const incidence = Math.max(0, nx * sunX + ny * .37 + nz * sunZ);
      const lighting = .044 + Math.pow(incidence, .61) * .94;
      const limb = Math.pow(1 - nz, 3.6) * .10;
      const value = (albedo * 1.63 + .10) * lighting + limb;
      pixels.data[i] = 255 * value * .97 + 2;
      pixels.data[i + 1] = 246 * value + 5;
      pixels.data[i + 2] = 235 * value + 13 + limb * 30;
      pixels.data[i + 3] = Math.min(255, nz * 2880);
    }
    surface.putImageData(pixels, 0, 0);
  }

  function paint() {
    if (!context) return;
    const {width, height} = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.round(width * ratio), h = Math.round(height * ratio);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const wash = context.createRadialGradient(width * .5, height * .47, 0, width * .5, height * .5, width * .61);
    wash.addColorStop(0, '#253858'); wash.addColorStop(.51, '#101b33'); wash.addColorStop(1, '#080f20');
    context.fillStyle = wash; context.fillRect(0, 0, width, height);
    for (const [px, py, z, glow] of stars) {
      const wx = px * width + 13 * x * z + .2 * clock * z;
      const sx = ((wx % width) + width) % width;
      const sy = py * height + 8 * y * z;
      const shine = .24 + .57 * z + .12 * Math.sin(clock * .32 + px * 50);
      context.fillStyle = 'rgba(202,222,255,' + Math.max(.1, shine) + ')';
      context.beginPath(); context.arc(sx, sy, .28 + .88 * z, 0, 2 * Math.PI); context.fill();
      if (glow > .967) {
        context.strokeStyle = '#c3d9ff71'; context.lineWidth = .65; context.beginPath();
        context.moveTo(sx - 4, sy); context.lineTo(sx + 4, sy);
        context.moveTo(sx, sy - 4); context.lineTo(sx, sy + 4); context.stroke();
      }
    }
    const radius = Math.min(width * .24, height * .341);
    const mx = width * (.51 - x * .031), my = height * (.49 - y * .026);
    const angle = -.21 + tilt * .22;
    context.save(); context.translate(mx, my); context.rotate(angle);
    context.strokeStyle = '#a2b7d344'; context.lineWidth = .85; context.beginPath();
    context.ellipse(0, 0, radius * 1.73, radius * .49, 0, 0, 2 * Math.PI); context.stroke();
    context.strokeStyle = '#d1bcc52d'; context.beginPath();
    context.ellipse(0, 0, radius * 1.91, radius * .63, 0, .2, 2.85); context.stroke();
    const phase = .59 + clock * .26 + tilt * 1.25;
    const dx = Math.cos(phase) * radius * 1.73, dy = Math.sin(phase) * radius * .49;
    context.restore();
    lunarDisc();
    context.drawImage(globe, mx - radius, my - radius, radius * 2, radius * 2);
    context.strokeStyle = '#aac5ed41'; context.lineWidth = 1;
    context.beginPath(); context.arc(mx, my, radius + .7, 0, 2 * Math.PI); context.stroke();
    context.save(); context.translate(mx, my); context.rotate(angle);
    context.strokeStyle = '#adc7ef39'; context.beginPath();
    context.ellipse(0, 0, radius * 1.73, radius * .49, 0, 0, Math.PI); context.stroke();
    if (Math.sin(phase) > 0 || Math.hypot(dx, dy) > radius) {
      context.fillStyle = '#e6d1a6'; context.beginPath(); context.arc(dx, dy, 2.7, 0, 2 * Math.PI); context.fill();
    }
    context.restore();
  }

  function tick(now) {
    frame = 0;
    if (!move || !visible || document.hidden) return;
    if (!last || now - last >= 38) {
      clock += last ? Math.min(.10, (now - last) / 1000) : 0;
      last = now;
      light += (lenses[active].light - light) * .18;
      tilt += (lenses[active].tilt - tilt) * .17;
      x += (aimX - x) * .14; y += (aimY - y) * .14;
      paint();
    }
    frame = requestAnimationFrame(tick);
  }
  function refreshMotion() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    const running = move && visible && !document.hidden;
    document.documentElement.dataset.folioRunning = String(running);
    if (running) frame = requestAnimationFrame(tick);
    else if (!document.hidden) paint();
  }
  function setMotion() {
    motionButton.textContent = move ? 'Motion on' : 'Motion off';
    motionButton.setAttribute('aria-pressed', String(move));
    document.documentElement.dataset.folioMotion = move ? 'on' : 'off';
    if (!move) { aimX = aimY = x = y = 0; light = lenses[active].light; tilt = lenses[active].tilt; }
    refreshMotion();
  }
  motionButton.addEventListener('click', () => { move = !move; setMotion(); });
  motionQuery.addEventListener('change', () => { move = !motionQuery.matches; setMotion(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; refreshMotion();
  }).observe(canvas);
  document.addEventListener('visibilitychange', refreshMotion);
  new ResizeObserver(paint).observe(canvas);

  function select(index) {
    const next = lenses[index];
    active = index;
    plateReading.textContent = next.title + ' / ' + modeCounts[index];
    buttons.forEach((button, position) => button.setAttribute('aria-pressed', String(position === index)));
    description.textContent = next.note;
    link.href = '#' + next.id;
    link.textContent = 'Open ' + next.title + ' ↗';
    link.setAttribute('aria-label', 'Open ' + next.title);
    if (!move || !visible) { light = next.light; tilt = next.tilt; paint(); }
  }
  function ring(index) {
    if (!audio || audioButton.getAttribute('aria-pressed') !== 'true') return;
    const osc = audio.createOscillator(), gain = audio.createGain();
    const t = audio.currentTime;
    osc.frequency.value = [293.66, 349.23, 392, 466.16][index];
    gain.gain.setValueAtTime(.0001, t);
    gain.gain.exponentialRampToValueAtTime(.035, t + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, t + .35);
    osc.connect(gain).connect(audio.destination);
    osc.start(t); osc.stop(t + .36);
  }
  audioButton.addEventListener('click', async () => {
    if (!window.AudioContext) return;
    audio ??= new AudioContext();
    try { await audio.resume(); } catch { return; }
    const enabled = audioButton.getAttribute('aria-pressed') !== 'true';
    audioButton.setAttribute('aria-pressed', String(enabled));
    audioButton.textContent = enabled ? 'Sound on' : 'Sound off';
    if (enabled) ring(active);
  });
  plate.addEventListener('click', event => {
    const button = event.target.closest('[data-lens]');
    if (button) { const index = Number(button.dataset.lens); select(index); ring(index); }
  });
  document.addEventListener('mordsith:section', event => {
    const index = lenses.findIndex(lens => lens.id === event.detail.id);
    if (index !== -1) select(index);
  });
  select(Math.max(0, lenses.findIndex(lens => '#' + lens.id === location.hash)));
  setMotion();
  const vocab = document.querySelector('#vocab-treasure');
  if (vocab) {
    const cards = [...vocab.querySelectorAll('.vocab-card')];
    const filter = document.createElement('div');
    filter.className = 'folio-vocab-filter';
    filter.innerHTML = '<label for="folio-vocab-search">Find a vocabulary item</label>'
      + '<input type="search" id="folio-vocab-search" autocomplete="off" placeholder="Search terms or examples">'
      + '<p role="status"></p>';
    vocab.querySelector('.panel-head').after(filter);
    const input = filter.querySelector('input');
    const status = filter.querySelector('[role="status"]');
    function updateMatches() {
      const query = input.value.trim().toLocaleLowerCase();
      let matches = 0;
      for (const card of cards) {
        card.hidden = !card.textContent.toLocaleLowerCase().includes(query);
        if (!card.hidden) matches += 1;
      }
      status.textContent = matches === 0 ? 'No matches.' : matches + ' of ' + cards.length + ' items';
    }
    input.addEventListener('input', updateMatches);
    document.addEventListener('mordsith:section', event => {
      if (event.detail.id === vocab.id) updateMatches();
    });
    updateMatches();
  }
})();
