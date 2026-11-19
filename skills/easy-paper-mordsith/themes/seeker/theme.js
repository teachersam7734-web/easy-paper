(() => {
  const tape = document.querySelector('.focus-deck');
  const audio = tape.querySelector('audio');
  const play = tape.querySelector('.tape-play');
  const [icon, playLabel] = play.children;
  const position = tape.querySelector('input');
  const time = tape.querySelector('.tape-time');
  const tapeStatus = tape.querySelector('.tape-status');
  audio.volume = 0.28;

  function updateTape() {
    const active = !audio.paused;
    play.setAttribute('aria-pressed', String(active));
    icon.textContent = active ? '\u2016' : '\u25b6';
    playLabel.textContent = active ? 'Pause' : 'Play';
    tape.classList.toggle('is-playing', active);
  }

  function updatePosition() {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const elapsed = Math.floor(audio.currentTime);
    const minutes = Math.floor(elapsed / 60);
    const seconds = String(elapsed % 60).padStart(2, '0');
    const label = minutes + ':' + seconds;
    position.value = String(Math.round(1000 * audio.currentTime / audio.duration));
    position.disabled = false;
    position.setAttribute('aria-valuetext', label);
    time.textContent = label;
  }

  play.addEventListener('click', async () => {
    tapeStatus.hidden = true;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
      if (document.hidden) audio.pause();
    } catch (error) {
      if (error.name === 'AbortError') return;
      tapeStatus.textContent = 'The focus track could not start.';
      tapeStatus.hidden = false;
    }
  });

  position.addEventListener('input', () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = Number(position.value) * audio.duration / 1000;
  });
  audio.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(video => {
      if (!video.paused) video.pause();
    });
    updateTape();
  });
  audio.addEventListener('pause', updateTape);
  audio.addEventListener('timeupdate', updatePosition);
  audio.addEventListener('loadedmetadata', updatePosition);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.pause();
  });
  window.addEventListener('pagehide', () => audio.pause());
  document.addEventListener('mordsith:intro', () => audio.pause());

  document.addEventListener('mordsith:film', () => audio.pause());
  const effects = tape.querySelector('.seeker-sfx');
  let context;
  effects.addEventListener('click', () => {
    const enabled = effects.getAttribute('aria-pressed') !== 'true';
    effects.setAttribute('aria-pressed', String(enabled));
    effects.textContent = 'Control sound ' + (enabled ? 'on' : 'off');
  });
  document.addEventListener('click', event => {
    if (effects.getAttribute('aria-pressed') !== 'true' || !audio.paused ||
        !event.target.closest('.seeker-sfx,.mode-link,.receipt-print,.receipt-download') ||
        [...document.querySelectorAll('video')].some(video => !video.paused) || !window.AudioContext) return;
    context ||= new AudioContext();
    if (context.state === 'suspended') context.resume().catch(() => {});
    const tone = context.createOscillator();
    const gain = context.createGain();
    tone.frequency.setValueAtTime(510, context.currentTime);
    tone.frequency.exponentialRampToValueAtTime(160, context.currentTime + .047);
    gain.gain.setValueAtTime(.037, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .052);
    tone.connect(gain).connect(context.destination);
    tone.start();
    tone.stop(context.currentTime + .055);
  });

  const quiz = document.querySelector('#retrieval');
  const receipt = document.querySelector('.seeker-receipt');
  const paper = receipt.querySelector('.receipt-paper');
  const result = receipt.querySelector('.receipt-result');
  const print = receipt.querySelector('.receipt-print');
  const download = receipt.querySelector('.receipt-download');
  let recap = '';

  function resetReceipt() {
    recap = '';
    result.textContent = '';
    print.textContent = 'Print recap';
    print.setAttribute('aria-expanded', 'false');
    paper.hidden = true;
    receipt.hidden = true;
  }

  quiz.addEventListener('submit', () => {
    resetReceipt();
    const checked = [...quiz.querySelectorAll('.quiz-card')].filter(card => card.querySelector('.quiz-feedback[data-result]'));
    if (checked.length === 0) return;
    result.textContent = quiz.querySelector('output').textContent;
    const details = checked.map(card => {
      const question = card.querySelector('.quiz-stem').textContent.trim();
      const selected = card.querySelector('input:checked').closest('label').textContent.trim();
      const feedback = card.querySelector('.quiz-feedback').textContent.trim();
      const correct = card.querySelector('.quiz-answer').textContent.trim();
      const explanation = [...card.querySelectorAll('.quiz-explanation p')]
        .map(paragraph => paragraph.textContent.trim());
      return [question, 'Your answer: ' + selected, feedback, 'Correct answer: ' + correct, ...explanation].join('\n');
    });
    recap = [document.querySelector('.hero h1').textContent.trim(), result.textContent, ...details].join('\n\n');
    receipt.hidden = false;
  });

  quiz.addEventListener('reset', resetReceipt);
  quiz.addEventListener('change', resetReceipt);
  document.addEventListener('mordsith:section', event => {
    receipt.hidden = event.detail.id !== 'quiz' || !recap;
  });

  print.addEventListener('click', () => {
    paper.hidden = !paper.hidden;
    print.textContent = paper.hidden ? 'Print recap' : 'Hide recap';
    print.setAttribute('aria-expanded', String(!paper.hidden));
  });

  download.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([recap], {type: 'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seeker-recall-recap.txt';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();

(() => {
  const panel = document.querySelector('.seeker-instrument');
  if (!panel) return;
  const stage = panel.querySelector('.seeker-artifact-stage');
  const canvas = stage.querySelector('canvas');
  const context = canvas.getContext('2d', {alpha: false});
  if (!context) return;

  const buttons = [...panel.querySelectorAll('[data-seeker-stage]')];
  const note = panel.querySelector('.seeker-stage-note');
  const toggle = panel.querySelector('.seeker-motion');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const passages = [
    'Use AI to generate directions worth exploring. Check sources and define the research question yourself.',
    'Treat suggested code and analysis as provisional. Check them against your data and chosen methods.',
    'Use editing suggestions to improve clarity. Verify citations and follow the journal’s disclosure requirements.',
    'AI can help with initial screening. Scholars still evaluate the methods, evidence, and contribution.',
    'The authors remain responsible for the claims, sources, and decisions in the published work.',
  ];
  const metals = {
    silver: [140, 170, 169], cutting: [185, 204, 199], teal: [25, 68, 70],
    gold: [186, 130, 78], dark: [53, 69, 70], bone: [170, 184, 169],
  };
  const tau = 2 * Math.PI;
  const work = {selected: 0, elapsed: 0, last: 0, frame: 0, visible: true,
    forceMotion: null, x: 0, y: 0, viewX: 0, viewY: 0, bearing: 0};

  function facets(rings, colors) {
    const quads = [];
    for (let row = 0; row < rings.length - 1; row += 1) {
      const ring = rings[row];
      const next = rings[row + 1];
      ring.forEach((point, index) => {
        const following = (index + 1) % ring.length;
        quads.push({points: [point, ring[following], next[following], next[index]],
          color: colors[index % colors.length]});
      });
    }
    return quads;
  }

  const diamond = (y, width, thickness) =>
    [[-width, y, 0], [0, y, thickness], [width, y, 0], [0, y, -thickness]];
  const octagon = (y, width, depth) => Array.from({length: 8}, (_, i) => [
    width * Math.cos(i * tau / 8), y, depth * Math.sin(i * tau / 8),
  ]);
  const crossSection = (x, y, h, z) =>
    [[x, y - h, -z], [x, y - h, z], [x, y + h, z], [x, y + h, -z]];

  // These are stylized digital meshes in arbitrary scene coordinates.
  const blade = [
    ...facets([diamond(-2.19, .006, .005), diamond(-1.51, .167, .064),
      diamond(-.11, .26, .092), diamond(.47, .32, .12), diamond(.61, .21, .09)],
    [metals.silver, metals.cutting, metals.silver, metals.bone]),
    ...facets([diamond(-1.49, .011, .067), diamond(-.19, .047, .096),
      diamond(.51, .064, .122)], [metals.gold, metals.teal, metals.gold, metals.teal]),
    ...facets([crossSection(-.82, .45, .035, .032), crossSection(-.62, .55, .09, .09),
      crossSection(-.25, .67, .106, .11), crossSection(0, .72, .114, .16),
      crossSection(.25, .67, .106, .11), crossSection(.62, .55, .09, .09),
      crossSection(.82, .45, .035, .032)], [metals.bone, metals.gold, metals.dark, metals.gold]),
    ...facets([octagon(.73, .14, .119), octagon(.92, .125, .106),
      octagon(1.46, .105, .088), octagon(1.54, .157, .12)], [metals.dark, metals.teal]),
    ...facets([diamond(1.49, .147, .12), diamond(1.66, .19, .15),
      diamond(1.83, .08, .081), diamond(1.87, .018, .01)], [metals.gold, metals.bone]),
  ];
  for (let ring = 0; ring < 5; ring += 1) {
    const y = .92 + ring * .104;
    blade.push(...facets([octagon(y, .128 - ring * .005, .112 - ring * .005),
      octagon(y + .024, .127 - ring * .005, .111 - ring * .005)], [metals.gold, metals.dark]));
  }

  const arrow = [
    ...facets([diamond(-.65, .005, .004), diamond(-.32, .156, .049),
      diamond(-.2, .035, .023)], [metals.silver, metals.cutting]),
    ...facets([octagon(-.24, .032, .032), octagon(.49, .028, .028)], [metals.gold, metals.teal]),
    ...facets([diamond(.29, .032, .026), diamond(.54, .119, .046),
      diamond(.64, .039, .018)], [metals.gold, metals.silver, metals.gold, metals.teal]),
  ];

  function rotate([x, y, z], ax, ay, az) {
    const cx = Math.cos(ax), sx = Math.sin(ax);
    const cy = Math.cos(ay), sy = Math.sin(ay);
    const cz = Math.cos(az), sz = Math.sin(az);
    const iy = y * cx - z * sx;
    const iz = y * sx + z * cx;
    const px = x * cy + iz * sy;
    return [px * cz - iy * sz, px * sz + iy * cz, iz * cy - x * sy];
  }

  function project([x, y, z], width, height, focal) {
    const scale = focal / (5.9 + z);
    return [width * .5 + x * scale, height * .51 + y * scale];
  }

  function light(points, color, emphasis) {
    const [a, b, c] = points;
    const u = b.map((p, index) => p - a[index]);
    const v = c.map((p, index) => p - a[index]);
    const nx = u[1] * v[2] - u[2] * v[1];
    const ny = u[2] * v[0] - u[0] * v[2];
    const nz = u[0] * v[1] - u[1] * v[0];
    const brightness = Math.abs((nx * .47 - ny * .42 - nz * .77) /
      (Math.hypot(nx, ny, nz) || 1));
    const gloss = Math.max(0, (brightness - .72) * 3) * (emphasis ? 48 : 33);
    const gain = (emphasis ? .77 : .58) + .58 * brightness;
    return `rgb(${color.map(component => Math.min(255,
      Math.round(component * gain + gloss))).join(' ')})`;
  }

  function outline(points, ink, close) {
    context.beginPath();
    context.moveTo(...points[0]);
    for (const point of points.slice(1)) context.lineTo(...point);
    if (close) context.closePath();
    context.strokeStyle = ink;
    context.stroke();
  }

  function scene(width, height, focal, seconds) {
    const haze = context.createRadialGradient(width * .51, height * .48, 0,
      width * .51, height * .49, Math.max(width, height) * .6);
    haze.addColorStop(0, '#354d4a');
    haze.addColorStop(.52, '#14292b');
    haze.addColorStop(1, '#091418');
    context.fillStyle = haze;
    context.fillRect(0, 0, width, height);
    context.lineWidth = 1;
    outline([[width * .16, height * .14], [width * .14, height * .14], [width * .14, height * .18]], '#af8b5980');
    outline([[width * .84, height * .86], [width * .86, height * .86], [width * .86, height * .82]], '#af8b5980');
    for (const radius of [1.58, 1.75, 2.04]) {
      const points = Array.from({length: 96}, (_, index) => {
        const angle = index * tau / 96;
        return project([Math.cos(angle) * radius, 1.2 + Math.sin(angle) * .39,
          Math.sin(angle) * radius], width, height, focal);
      });
      outline(points, radius === 1.75 ? '#d399655f' : '#90c8bd33', true);
    }
    const trail = Array.from({length: 21}, (_, i) => project(
      [-2 + i / 5, .38 + .055 * Math.sin(i * .65 + seconds * .7), 1.75],
      width, height, focal));
    outline(trail, '#e4af6e45');
    context.fillStyle = '#e2c19a7d';
    for (let i = 0; i < 31; i += 1) {
      const x = ((i * 339.43 + seconds * (6 + i % 3)) % 1009) / 1009 * width;
      const y = ((i * 73.81 + seconds * 2) % 353) / 353 * height;
      const opacity = .19 + .32 * (1 + Math.sin(i * 1.7 + seconds * .95)) / 2;
      context.globalAlpha = opacity;
      context.fillRect(x, y, i % 6 === 0 ? 3 : 1.5, 1);
    }
    context.globalAlpha = 1;
  }

  function draw() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const density = Math.min(devicePixelRatio || 1, 1.7);
    const width = rect.width;
    const height = rect.height;
    const pixels = [Math.round(width * density), Math.round(height * density)];
    if (canvas.width !== pixels[0] || canvas.height !== pixels[1]) {
      canvas.width = pixels[0];
      canvas.height = pixels[1];
    }
    context.setTransform(density, 0, 0, density, 0, 0);
    const focal = Math.min(height * 1.28, width * 1.22);
    const seconds = work.elapsed;
    scene(width, height, focal, seconds);

    const pose = [work.viewY * .34 + Math.sin(seconds * .56) * .1,
      -.52 + work.viewX * .6 + Math.sin(seconds * .63) * .22 + work.bearing * .11,
      -.52 + .12 * Math.cos(seconds * .7) + work.bearing * .05];
    const ornaments = [{mesh: blade, pose,
      shift: [0, -.045 + .105 * Math.sin(seconds * .88), -.23], scale: 1, on: true}];
    buttons.forEach((_, index) => {
      const angle = Math.PI * .65 + (index - work.bearing) * tau / buttons.length;
      const on = index === work.selected;
      const radius = on ? 1.8 : 1.96;
      const x = Math.cos(angle) * radius;
      const depth = Math.sin(angle) * 1.15;
      ornaments.push({mesh: arrow, pose: [.18 + .12 * Math.sin(angle + seconds),
        angle * .7, x * .31 + work.viewX * .06],
      shift: [x, .27 + depth * .22 + .065 * Math.sin(seconds * 1.45 + index), depth],
      scale: on ? .79 : .59, on});
    });

    const faces = ornaments.flatMap(item => item.mesh.map(face => {
      const view = face.points.map(point => {
        const rotated = rotate(point, ...item.pose);
        return rotated.map((component, index) => component * item.scale + item.shift[index]);
      });
      return {view, color: face.color, on: item.on,
        depth: view.reduce((sum, point) => sum + point[2], 0) / view.length};
    })).sort((a, b) => b.depth - a.depth);
    context.lineWidth = .7;
    for (const face of faces) {
      outline(face.view.map(point => project(point, width, height, focal)),
        face.on ? '#e9d3a851' : '#a2b8a637', true);
      context.fillStyle = light(face.view, face.color, face.on);
      context.fill();
    }
    stage.classList.add('has-scene');
  }

  const animated = () => work.forceMotion ?? !preference.matches;
  function tick(now) {
    work.frame = 0;
    if (!animated() || !work.visible || document.hidden) return;
    const delta = work.last ? Math.min(.05, (now - work.last) / 1000) : 0;
    work.last = now;
    work.elapsed += delta;
    const damp = 1 - Math.exp(-7 * delta);
    work.viewX += (work.x - work.viewX) * damp;
    work.viewY += (work.y - work.viewY) * damp;
    work.bearing += (work.selected - work.bearing) * damp;
    draw();
    work.frame = requestAnimationFrame(tick);
  }

  function refresh() {
    if (!animated() || !work.visible || document.hidden) {
      if (work.frame) cancelAnimationFrame(work.frame);
      work.frame = work.last = 0;
      if (work.visible && !document.hidden) {
        work.bearing = work.selected;
        work.viewX = work.viewY = work.x = work.y = 0;
        draw();
      }
      return;
    }
    if (!work.frame) work.frame = requestAnimationFrame(tick);
  }

  function updateToggle() {
    toggle.setAttribute('aria-pressed', String(!animated()));
    toggle.textContent = animated() ? 'Pause motion' : 'Resume motion';
  }

  function select(index) {
    work.selected = index;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
    note.textContent = passages[index];
    refresh();
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      select(next);
    });
  });

  toggle.addEventListener('click', () => {
    work.forceMotion = !animated();
    updateToggle();
    refresh();
  });
  preference.addEventListener('change', () => {
    updateToggle();
    refresh();
  });
  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !animated()) return;
    const rect = stage.getBoundingClientRect();
    work.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    work.y = (event.clientY - rect.top) / rect.height * 2 - 1;
  });
  stage.addEventListener('pointerleave', () => { work.x = work.y = 0; });
  new ResizeObserver(() => { if (work.visible && !document.hidden) draw(); }).observe(stage);
  new IntersectionObserver(([entry]) => {
    work.visible = entry.isIntersecting;
    refresh();
  }, {threshold: .02}).observe(stage);
  document.addEventListener('visibilitychange', refresh);
  updateToggle();
  select(0);
})();
