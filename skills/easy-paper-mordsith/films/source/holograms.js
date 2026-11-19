/* Perspective projection of original wire meshes. Every image is a function of film time. */
(() => {
  const tau = 2 * Math.PI;
  const colors = {agiel: '255,125,146', confessor: '143,204,255', seeker: '255,194,118'};
  const clamp = n => Math.max(0, Math.min(1, n));

  function ring(radius, height, detail = 48) {
    return Array.from({length: detail + 1}, (_, i) => {
      const angle = i / detail * tau;
      return [Math.cos(angle) * radius, height, Math.sin(angle) * radius];
    });
  }
  function mesh(ctx, theme, t, variant, width, height) {
    const xCenter = width * (.5 + .025 * Math.sin(variant * 1.23 + t * .48));
    const yCenter = height * .46;
    const rgba = alpha => 'rgba(' + colors[theme] + ',' + clamp(alpha) + ')';
    const yaw = t * (theme === 'confessor' ? .32 : .52) + variant * .5;
    const pitch = (theme === 'seeker' ? -.54 : -.26) + .10 * Math.sin(t * .7 + variant);
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const focal = 760;
    const dolly = 1.48 + .11 * Math.sin(t * 1.1 + variant);
    const lens = ctx.createRadialGradient(xCenter, yCenter, 3, xCenter, yCenter, width * .65);
    lens.addColorStop(0, theme === 'agiel' ? '#311420' : theme === 'confessor' ? '#132b49' : '#302218');
    lens.addColorStop(.52, '#0a111b');
    lens.addColorStop(1, '#06090f');
    ctx.fillStyle = lens;
    ctx.fillRect(0, 0, width, height);

    function project([x, y, z]) {
      const side = x * cy - z * sy;
      const depth = x * sy + z * cy;
      const d = y * sp + depth * cp;
      const size = dolly * focal / (focal + d + 135);
      return [xCenter + side * size, yCenter + (y * cp - depth * sp) * size, size];
    }
    function trace(points, alpha, wide = 1.1) {
      const screen = points.map(project);
      ctx.beginPath();
      screen.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      const depth = screen.reduce((n, point) => n + point[2], 0) / screen.length;
      ctx.lineWidth = wide;
      ctx.strokeStyle = rgba(alpha * depth);
      ctx.stroke();
    }
    function point(world, size, alpha) {
      const [x, y, z] = project(world);
      ctx.fillStyle = rgba(alpha);
      ctx.fillRect(x - size * z / 2, y - size * z / 2, size * z, size * z);
    }
    function face(vertices, alpha) {
      const screen = vertices.map(project);
      const blur = ctx.shadowBlur;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      screen.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath();
      ctx.fillStyle = rgba(alpha);
      ctx.fill();
      ctx.shadowBlur = blur;
    }
    const light = ctx.createLinearGradient(xCenter, height * .18, xCenter, height * .78);
    light.addColorStop(0, rgba(0));
    light.addColorStop(.74, rgba(.045));
    light.addColorStop(1, rgba(.13));
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.moveTo(xCenter - width * .20, height * .18);
    ctx.lineTo(xCenter + width * .20, height * .18);
    ctx.lineTo(xCenter + width * .105, height * .78);
    ctx.lineTo(xCenter - width * .105, height * .78);
    ctx.closePath();
    ctx.fill();
    const scan = (t * 99 + variant * 50) % 334 - 167;
    const floor = 174;
    for (let i = -5; i <= 5; i += 1) {
      trace([[-410, floor, i * 63], [410, floor, i * 63]], .16);
      trace([[i * 72, floor, -370], [i * 72, floor, 370]], .16);
    }
    for (const radius of [149, 202, 241]) trace(ring(radius, floor), radius === 202 ? .46 : .29);
    for (let i = 0; i < 125; i += 1) {
      const angle = i * 2.39996 + t * .13;
      const radius = 150 + ((i * 71) % 213);
      const y = ((i * 53 + t * 47) % 348) - 173;
      const glint = .09 + .19 * (.5 + .5 * Math.sin(i * 6.1 + t * 2));
      point([Math.cos(angle) * radius, y, Math.sin(angle) * radius], i % 9 === 0 ? 3 : 1.5, glint);
    }

    ctx.shadowColor = rgba(.65);
    ctx.shadowBlur = 11;
    if (theme === 'agiel') {
      // A detector scan separates a single document into layers of evidence.
      const spread = 62 + Math.sin(t * 1.2) * 21;
      for (let layer = -1; layer <= 1; layer += 1) {
        const z = layer * spread;
        const x = layer * 26, y = 9 * layer;
        const corners = [[x-128,y-145,z],[x+87,y-145,z],[x+130,y-102,z],
          [x+130,y+144,z],[x-128,y+144,z],[x-128,y-145,z]];
        face(corners, layer === 0 ? .10 : .04);
        trace(corners, layer === 0 ? .90 : .42, layer === 0 ? 2.25 : 1.3);
        trace([[x+87,y-145,z],[x+87,y-102,z],[x+130,y-102,z]], .7);
        for (let row = 0; row < 14; row += 1) {
          const yy = y - 98 + row * 15;
          const highlight = Math.exp(-Math.abs(scan - yy) / 25);
          trace([[x-105,yy,z],[x+55+(row*15)%41,yy,z]], .17 + highlight * .57, highlight > .6 ? 2.4 : 1);
        }
      }
      const scanner = [[-245,scan,-120],[245,scan,-120],[245,scan,120],[-245,scan,120],[-245,scan,-120]];
      face(scanner, .11);
      trace(scanner, .74, 1.7);
    } else if (theme === 'confessor') {
      // Two independently moving strands visibly converge in the center of the study.
      const merge = Math.sin(t * .85 + variant * .45) * 26;
      const strands = [[], []];
      for (let i = 0; i <= 95; i += 1) {
        const u = i / 95;
        const turn = u * tau * 1.56 + t * 1.6;
        const radius = 34 + Math.abs(u - .5) * 162 + merge;
        for (const [j, strand] of strands.entries()) {
          const a = turn + j * Math.PI;
          strand.push([Math.sin(a)*radius, 150-300*u, Math.cos(a)*radius]);
        }
      }
      strands.forEach((strand, id) => {
        const edge = strand.map(([x, y, z]) => [x * 1.13, y + 2, z * 1.13]);
        for (let i = 0; i < strand.length - 1; i += 1) {
          face([strand[i], edge[i], edge[i+1], strand[i+1]], .20 + .09 * Math.sin(t * 2 + i * .1));
        }
        trace(edge, .40, 1.2);
        trace(strand, id ? .78 : 1, id ? 2.9 : 3.5);
      });
      for (let i = 4; i < 95; i += 5) {
        trace([strands[0][i], strands[1][i]], .24 + .6 * Math.exp(-Math.abs(scan - strands[0][i][1]) / 47));
        point(strands[0][i], 3.2, .88);
        point(strands[1][i], 3.2, .66);
      }
      for (const tilt of [-.55, .43]) {
        const tilted = ring(178, 0).map(([x, , z]) => [x, z * Math.sin(tilt), z * Math.cos(tilt)]);
        trace(tilted, .30, 1.4);
      }
    } else {
      // The manuscript advances through a sequence of distinct editorial checkpoints.
      const position = (t * .73 + variant * .27) % 5;
      const gates = [-208, -104, 0, 104, 208];
      trace([[-315,142,0],[315,142,0]], .77, 2.5);
      gates.forEach((x, i) => {
        const near = Math.max(0, 1 - Math.abs(i - position));
        const y = -110 - 38 * near;
        const gate = [[x,142,-66],[x,y,-66],[x,y-22,0],[x,y,66],[x,142,66],[x,142,-66]];
        face(gate, near * .095);
        trace(gate, .38 + near * .55, 1.3 + near);
        point([x,y-22,0], 5, .55 + near * .45);
      });
      const x = -208 + position * 104;
      const bob = Math.sin(t * 2.3) * 12;
      for (let sheet = 3; sheet >= 0; sheet -= 1) {
        const xx = x - sheet * 15;
        const outline = [[xx,bob-92,-54],[xx,bob-92,43],[xx,bob-71,61],
          [xx,bob+69,61],[xx,bob+69,-54],[xx,bob-92,-54]];
        face(outline, sheet ? .035 : .18);
        trace(outline, .96 - sheet * .19, 1.75);
        if (sheet === 0) {
          for (let row = 0; row < 7; row += 1) {
            const y = bob - 58 + row * 16;
            trace([[xx,y,-38],[xx,y,32+(row*7)%13]], .48);
          }
        }
      }
    }
    ctx.shadowBlur = 0;

    const scanlines = ctx.createLinearGradient(0, 0, 0, height);
    scanlines.addColorStop(0, '#04090f51');
    scanlines.addColorStop(.29, '#07091300');
    scanlines.addColorStop(.72, '#07091300');
    scanlines.addColorStop(1, '#04080fd8');
    ctx.fillStyle = scanlines;
    ctx.fillRect(0, 0, width, height);
  }

  const plates = {agiel: {0: [4.6, 7.8], 2: [4.2, 8.5], 4: [5.2, 8.6]},
    confessor: {1: [4.6, 8.6], 3: [4.2, 8.5], 4: [4.5, 8.2]},
    seeker: {0: [4.8, 8.1], 2: [4.1, 8.6], 4: [4.5, 8.5]}};

  window.paintFilmHologram = (ctx, theme, index, time, width, height) => {
    const beat = plates[theme][index];
    if (!beat || time <= beat[0] || time >= beat[1]) return;
    const local = time - beat[0];
    const entry = Math.min(1, local / .42);
    const exit = Math.min(1, (beat[1] - time) / .54);
    ctx.save();
    ctx.globalAlpha = Math.min(entry, exit);
    mesh(ctx, theme, local, index, width, height);
    ctx.restore();
  };
})();
