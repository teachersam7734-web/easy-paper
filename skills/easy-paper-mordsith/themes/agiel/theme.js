(() => {
  const exhibit = document.querySelector('.agiel-exhibit');
  if (!exhibit) return;
  const canvas = exhibit.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const motion = document.querySelector('[data-agiel-motion]');
  const sound = document.querySelector('[data-agiel-sound]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let moving = !reduced.matches, audible = false, visible = false, frame = 0;
  let time = 0, last = 0, selected = 0, audio;
  function tone(note = 230) {
    if (!audible) return;
    try {
      const Engine = window.AudioContext || window.webkitAudioContext;
      if (!Engine) return;
      audio ||= new Engine();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      const oscillator = audio.createOscillator(), gain = audio.createGain();
      oscillator.frequency.setValueAtTime(note, audio.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(note * .64, audio.currentTime + .09);
      gain.gain.setValueAtTime(.028, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + .13);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(); oscillator.stop(audio.currentTime + .14);
    } catch { /* The scanner remains usable without device audio. */ }
  }
  // Biconcave surface, mathematical perspective and directional lighting.
  const across = 30;
  const rings = 15;
  const mesh = Array.from({length: (rings + 1) * across}, (_, i) => {
    const v = Math.PI * Math.floor(i / across) / rings;
    const a = 2 * Math.PI * (i % across) / across;
    const r = Math.sin(v);
    return [r * Math.cos(a), r * Math.sin(a), Math.cos(v) * (.072 + .34 * r * r)];
  });
  const faces = Array.from({length: rings * across}, (_, i) => {
    const next = Math.floor(i / across) * across + (i + 1) % across;
    return [i, next, next + across, i + across];
  });
  const specimens = [
    {x: -.64, y: -.36, z: -1.25, radius: .44, tilt: 1.2, hue: 4},
    {x: .67, y: -.47, z: -.65, radius: .49, tilt: -.65, hue: 16},
    {x: .53, y: .50, z: -.15, radius: .47, tilt: .92, hue: 12},
    {x: -.56, y: .60, z: .12, radius: .6, tilt: .88, hue: 18},
    {x: .01, y: -.02, z: .63, radius: .77, tilt: -.26, hue: 24},
  ];
  const pointer = {x: 0, y: 0, active: false};
  let driftX = 0, driftY = 0, displacement = 0;
  const plate = exhibit.querySelector('.agiel-diagram');
  plate.addEventListener('pointermove', event => {
    if (!moving || reduced.matches) return;
    const box = plate.getBoundingClientRect();
    pointer.x = 2 * (event.clientX - box.left) / box.width - 1;
    pointer.y = 2 * (event.clientY - box.top) / box.height - 1;
    pointer.active = true;
  });
  plate.addEventListener('pointerleave', () => {
    pointer.x = 0; pointer.y = 0; pointer.active = false;
  });

  function specimen(cell, index, w, h, zoom) {
    const a = cell.tilt + Math.sin(time * .48 + index * 1.33) * .24 + driftY * .2 + displacement * .10;
    const b = index * 1.8 + time * .15 + driftX * .24;
    const c = index * .64 + time * .2 + displacement * .16;
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    const cc = Math.cos(c), sc = Math.sin(c);
    const depth = cell.z + .14 * Math.sin(time * .46 + index);
    const cx = cell.x + .15 * Math.sin(time * .31 + index) + driftX * (.22 + depth * .13);
    const cy = cell.y + .12 * Math.sin(time * .51 + index * 2.5) + driftY * (.23 + depth * .11);
    const vertices = mesh.map(([px, py, pz]) => {
      const y = py * ca - pz * sa;
      const z = py * sa + pz * ca;
      const x = px * cb + z * sb;
      const lz = z * cb - px * sb;
      const lx = x * cc - y * sc, ly = x * sc + y * cc;
      const distance = 3.4 - depth - lz * cell.radius;
      const scale = zoom * 3.4 / distance;
      return [lx, ly, lz, w * .5 + (cx + lx * cell.radius) * scale,
        h * .50 + (cy + ly * cell.radius) * scale];
    });
    const sorted = [];
    for (const face of faces) {
      const points = face.map(v => vertices[v]);
      const [v0, v1, v2, v3] = points;
      const ux = v1[0] - v0[0], uy = v1[1] - v0[1], uz = v1[2] - v0[2];
      const vx = v2[0] - v0[0], vy = v2[1] - v0[1], vz = v2[2] - v0[2];
      const x = uz * vy - uy * vz, y = ux * vz - uz * vx, z = uy * vx - ux * vy;
      if (z <= .0000001) continue;
      const length = Math.hypot(x, y, z);
      const light = Math.max(0, (-x * .52 - y * .64 + z * .56) / length);
      const sheen = Math.pow(Math.max(0, (-x * .31 - y * .39 + z * .87) / length), 18);
      const rim = Math.pow(1 - z / length, 1.8);
      const softness = .74 + .24 * (depth + 1.25) / 1.88;
      const r = Math.min(255, (52 + cell.hue + 131 * light + 79 * sheen + 22 * rim) * softness);
      const g = (7 + 28 * light + 106 * sheen + 10 * rim) * softness;
      const b = (20 + 33 * light + 116 * sheen + 20 * rim) * softness;
      sorted.push({points, z: (v0[2] + v1[2] + v2[2] + v3[2]) * .25,
        color: 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')'});
    }
    sorted.sort((a, b) => a.z - b.z);
    ctx.lineWidth = .46;
    for (const {points, color} of sorted) {
      ctx.beginPath(); ctx.moveTo(points[0][3], points[0][4]);
      for (let j = 1; j < points.length; j++) ctx.lineTo(points[j][3], points[j][4]);
      ctx.closePath();
      ctx.fillStyle = color; ctx.strokeStyle = color; ctx.fill(); ctx.stroke();
    }
  }

  function paint() {
    if (!ctx) return;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(devicePixelRatio || 1, 1.65);
    const w = Math.round(width * ratio), h = Math.round(height * ratio);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    if (moving) {
      driftX += (pointer.x - driftX) * .16;
      driftY += (pointer.y - driftY) * .16;
      displacement += (selected - displacement) * .14;
    } else {
      driftX = driftY = 0; displacement = selected;
    }
    const background = ctx.createRadialGradient(width * (.49 + driftX * .16), height * (.51 + driftY * .13),
      4, width * .53, height * .5, width * .65);
    background.addColorStop(0, '#591724');
    background.addColorStop(.4, '#2f101b');
    background.addColorStop(1, '#130b13');
    ctx.fillStyle = background; ctx.fillRect(0, 0, width, height);

    // Tiny flow tracers move at staggered speeds to separate the depth planes.
    for (let i = 0; i < 84; i++) {
      const depth = (i * 31 % 83) / 83;
      const x = (width + (i * width * .382 + time * (6 + depth * 17) + driftX * depth * 15) % width) % width;
      const y = ((i * .618 % 1) * height + Math.sin(time * .47 + i * 1.72) * 8) % height;
      ctx.fillStyle = 'rgba(255,132,145,' + (.07 + depth * .32) + ')';
      ctx.beginPath(); ctx.arc(x, y, .35 + depth * 1.2, 0, Math.PI * 2); ctx.fill();
    }

    const zoom = Math.min(width * .25, height * .37);
    specimens.forEach((cell, index) => specimen(cell, index, width, height, zoom));
    const beamY = height * (.24 + .17 * displacement + .04 * Math.sin(time * .65));
    const beam = ctx.createLinearGradient(0, beamY - 23, 0, beamY + 23);
    beam.addColorStop(0, '#fb596800'); beam.addColorStop(.49, '#ff56633c');
    beam.addColorStop(.51, '#ffacaa79'); beam.addColorStop(1, '#fb596800');
    ctx.fillStyle = beam; ctx.fillRect(0, beamY - 23, width, 46);
    if (pointer.active && moving) {
      const x = width * (.5 + driftX * .43), y = height * (.5 + driftY * .43);
      ctx.strokeStyle = '#ffbeae69'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.strokeStyle = '#ff8d964b'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 17; x < width - 15; x += 9) {
      ctx.moveTo(x, height - 10); ctx.lineTo(x, height - ((x - 17) % 36 === 0 ? 18 : 13));
    }
    ctx.stroke();
  }
  function tick(now) {
    frame=0;
    if (!moving || !visible || document.hidden) return;
    if (now-last>=34) { time+=Math.min((now-last)/1000,.1); last=now; paint(); }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame=0;
    exhibit.closest('.agiel').dataset.motion=moving?'on':'off'; motion.textContent=moving?'Motion on':'Motion off'; motion.setAttribute('aria-pressed',String(moving));
    const running = moving && visible && !document.hidden;
    exhibit.closest('.agiel').dataset.running = String(running);
    if (!document.hidden) paint();
    if (running) frame=requestAnimationFrame(tick);
  }
  motion.addEventListener('click',()=>{moving=!moving; sync();});
  sound.addEventListener('click',()=>{audible=!audible; sound.textContent=audible?'Sound on':'Sound off';sound.setAttribute('aria-pressed',String(audible));tone();});
  reduced.addEventListener('change',()=>{moving=!reduced.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  new ResizeObserver(paint).observe(canvas);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}).observe(canvas);
  const cards=[...document.querySelectorAll('#study-map .map-card')];
  const caption=exhibit.querySelector('.agiel-scan-readout'), group=exhibit.querySelector('.agiel-scan-controls');
  function select(index) {
    selected=index; exhibit.querySelector('.agiel-diagram').dataset.scan=String(index);
    caption.textContent=cards[index].querySelector('p')?.textContent || '';
    exhibit.querySelector('.agiel-position').textContent=(index+1)+' / '+cards.length;
    [...group.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    paint();
  }
  cards.forEach((card,index)=>{
    const button=document.createElement('button'); button.type='button'; button.textContent=card.querySelector('h3')?.textContent;
    button.addEventListener('click',()=>{select(index);tone(196+index*45);}); group.append(button);
  });
  if(cards.length){select(0);exhibit.classList.add('agiel-scan-ready');}
  sync();
})();

