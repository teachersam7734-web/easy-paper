(() => {
  const canvas = document.querySelector('.paper-atmosphere');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const theme = document.body.dataset.atmosphere;
  const colors = {agiel: '255,106,129', confessor: '63,112,190', seeker: '247,185,109'};
  const rgb = colors[theme];
  if (!rgb) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const cardSelector = '.study-card, .map-card, .preview, .quiz-card';
  let seed = 811;
  const random = () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const points = Array.from({length: theme === 'confessor' ? 105 : 67}, () => ({
    x: random(), y: random(), depth: .25 + random() * .75,
    phase: random() * Math.PI * 2, speed: .35 + random() * .85
  }));
  const pointer = {x: 0, y: 0, live: false};
  let activeCard;
  let width, height, frame = 0, time = 0, last = 0, lastDraw = 0;
  let scrollPosition = window.scrollY;
  let energy = 0;

  const controls = [...document.querySelectorAll('button:is([data-agiel-motion], [data-folio-motion], .seeker-motion)')];
  const paused = () => motion.matches || controls.some(control =>
    control.getAttribute('aria-pressed') === (control.matches('.seeker-motion') ? 'true' : 'false'));
  const wrap = (value, size) => ((value % size) + size) % size;
  const ink = alpha => 'rgba(' + rgb + ',' + alpha + ')';

  function line(x1, y1, x2, y2) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const compact = width < 600;
    const scroll = scrollPosition;
    const radius = Math.max(width, height) * .63;
    const side = theme === 'agiel' ? .16 : theme === 'confessor' ? .77 : .91;
    const glowX = width * side + (pointer.live ? (pointer.x - width * .5) * .10 : 0);
    const glowY = height * (.42 + Math.sin(time * .16 + scroll * .002) * .20);
    const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, radius);
    glow.addColorStop(0, ink(.16 + energy * .045));
    glow.addColorStop(.42, ink(.054));
    glow.addColorStop(1, ink(0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;

    if (theme === 'confessor') {
      ctx.save();
      ctx.translate(width * .76, height * .46);
      ctx.rotate(-.5 + Math.sin(time * .08 + scroll * .001) * .15);
      ctx.strokeStyle = ink(.14);
      for (const ring of [0.58, 0.69, 0.84]) {
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * ring, radius * ring * .31, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else {
      for (let band = 0; band < 5; band += 1) {
        const x = width * (theme === 'agiel' ? .135 : .875) + (band - 2) * width * .044;
        const sway = Math.sin(time * .35 + band * .48 + scroll * .004) * width * .048;
        ctx.strokeStyle = ink(.065 + (band === 2 ? .035 : 0));
        ctx.beginPath();
        ctx.moveTo(x - width * .28, height + 24);
        ctx.bezierCurveTo(x + sway - width * .12, height * .69,
          x + width * .10 - sway, height * .32, x + width * .26, -24);
        ctx.stroke();
      }
    }

    for (const [index, point] of points.entries()) {
      if (compact && index % 2) continue;
      const p = point.depth;
      const dx = pointer.live ? (pointer.x - width * .5) * p * .05 : 0;
      const dy = pointer.live ? (pointer.y - height * .5) * p * .055 : 0;
      let x = point.x * width + dx;
      let y = point.y * height + dy;
      if (theme === 'agiel') {
        y -= time * 15 * point.speed + scroll * .09 * p;
        x += time * 10 * point.speed + Math.sin(point.phase + y * .008 + time * .43) * 32;
      } else if (theme === 'confessor') {
        y += Math.cos(point.phase + time * .20) * (9 + p * 24) - scroll * .055 * p;
        x += Math.sin(point.phase + time * .16) * (14 + p * 28);
      } else {
        x += time * (13 + 30 * p) * point.speed + scroll * .055 * p;
        y -= time * (8 + 15 * p) * point.speed + scroll * .075 * p;
      }
      x = wrap(x + 30, width + 60) - 30;
      y = wrap(y + 30, height + 60) - 30;
      const wake = pointer.live ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 105) : 0;
      const alpha = (.12 + p * .33 + wake * .26) * (.78 + .22 * Math.cos(time * point.speed + point.phase));
      ctx.strokeStyle = ctx.fillStyle = ink(alpha);
      if (theme === 'agiel' && index % 4 === 0) {
        ctx.beginPath();
        ctx.ellipse(x, y, 2 + p * 5.5, 1.5 + p * 2.8, point.phase + time * .12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillRect(x, y, 1.2, 1.2);
      } else if (theme === 'seeker' && index % 3 === 0) {
        const tail = 8 + p * 25 + wake * 9;
        line(x - tail, y + tail * .50, x, y);
        if (index % 9 === 0) {
          ctx.beginPath();
          ctx.moveTo(x - 8, y - 1); ctx.lineTo(x, y); ctx.lineTo(x - 6, y + 6);
          ctx.stroke();
        }
      } else if (theme === 'confessor' && index % 9 === 0) {
        const arm = 2 + p * 3.6 + wake * 2;
        line(x - arm, y, x + arm, y);
        line(x, y - arm, x, y + arm);
      } else {
        ctx.fillRect(x, y, .9 + p * 1.65, .9 + p * 1.65);
      }
    }
  }

  function animate(now) {
    frame = 0;
    if (paused() || document.hidden) return;
    if (now - lastDraw >= 30) {
      time += Math.min(.075, Math.max(0, (now - (last || now)) / 1000));
      last = lastDraw = now;
      energy *= .94;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    if (paused() || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      clearPointer();
      if (!document.hidden) draw();
    } else if (!frame) {
      frame = requestAnimationFrame(animate);
    }
  }
  function resize() {
    width = document.documentElement.clientWidth;
    height = window.innerHeight;
    const scale = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    draw();
    sync();
  }
  function clearPointer() {
    pointer.live = false;
    activeCard?.style.removeProperty('--light-x');
    activeCard?.style.removeProperty('--light-y');
    activeCard = null;
  }
  window.addEventListener('pointermove', event => {
    if (!fine.matches || paused()) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.live = true;
    const card = event.target.closest?.(cardSelector);
    if (card !== activeCard) {
      activeCard?.style.removeProperty('--light-x');
      activeCard?.style.removeProperty('--light-y');
      activeCard = card;
    }
    if (card) {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--light-x', (event.clientX - bounds.left) + 'px');
      card.style.setProperty('--light-y', (event.clientY - bounds.top) + 'px');
    }
  }, {passive: true});
  document.documentElement.addEventListener('pointerleave', clearPointer);
  window.addEventListener('blur', clearPointer);
  window.addEventListener('scroll', () => { scrollPosition = window.scrollY; }, {passive: true});
  document.addEventListener('mordsith:section', () => { energy = 1; clearPointer(); });
  document.addEventListener('click', event => {
    if (event.target.closest('.quiz-actions button')) energy = 1;
  });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  const observer = new MutationObserver(sync);
  controls.forEach(control => observer.observe(control, {attributes: true, attributeFilter: ['aria-pressed']}));
  window.addEventListener('resize', resize, {passive: true});
  resize();
})();
