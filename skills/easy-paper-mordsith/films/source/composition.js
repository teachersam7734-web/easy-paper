/* Original Mord'Sith compositions. Every visible property depends on the given frame. */
(() => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d', {alpha: false});
  const WIDTH = 1280;
  const HEIGHT = 720;
  const TICKS = 24;
  const CAPTION_EDGE = 620;
  const palettes = {
    agiel: {bg: '#170f16', black: '#251920', paper: '#39212b', muted: '#d8a6a8',
      ink: '#fff1eb', accent: '#ff786c', rule: '#754347', soft: '#b46561'},
    confessor: {bg: '#f3f0e9', faint: '#dfdcd4', blue: '#25469c', gold: '#a44730',
      ink: '#1b233a', muted: '#4e5670', pale: '#dde4f6', rose: '#f0d8ca'},
    seeker: {bg: '#202411', black: '#15180d', ink: '#f5f0d8', accent: '#d9f677',
      muted: '#bdc398', rule: '#657247', paper: '#dfddaa', rust: '#cb9262'},
  };
  let film;
  let theme;
  const cutaways = {};
  let cover;
  let textBounds;

  const limit = value => Math.min(1, Math.max(0, value));
  const ease = value => 1 - (1 - limit(value)) ** 3;
  const progress = (time, delay, duration = .6) => ease((time - delay) / duration);
  const mix = (a, b, amount) => a + (b - a) * amount;
  const font = {
    condensed: 'FilmDisplay, "Arial Narrow", Arial, sans-serif',
    sans: 'FilmBody, "Segoe UI", Arial, sans-serif',
    serif: 'FilmDisplay, Georgia, "Times New Roman", serif',
    mono: 'FilmMono, Consolas, monospace',
  };

  function fill(color, x = 0, y = 0, w = WIDTH, h = HEIGHT) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }

  function border(color, x, y, w, h, width = 1) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.strokeRect(x, y, w, h);
  }

  function path(points, color, width = 1) {
    context.beginPath();
    context.moveTo(...points[0]);
    for (const point of points.slice(1)) context.lineTo(...point);
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
  }

  function disc(x, y, radius, color, outline) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    if (outline) {
      context.strokeStyle = color;
      context.lineWidth = outline;
      context.stroke();
    } else {
      context.fillStyle = color;
      context.fill();
    }
  }

  function recordText(value, x, y, width) {
    if (!textBounds || context.globalAlpha < .1) return;
    const m = context.measureText(value);
    const scale = width && m.width > width ? width / m.width : 1;
    const left = x - m.actualBoundingBoxLeft * scale;
    const right = x + m.actualBoundingBoxRight * scale;
    const top = y - m.actualBoundingBoxAscent;
    const bottom = y + m.actualBoundingBoxDescent;
    const matrix = context.getTransform();
    const corners = [[left, top], [right, top], [left, bottom], [right, bottom]]
      .map(([px, py]) => matrix.transformPoint({x: px, y: py}));
    textBounds.push({value,
      left: Math.min(...corners.map(p => p.x)), right: Math.max(...corners.map(p => p.x)),
      top: Math.min(...corners.map(p => p.y)), bottom: Math.max(...corners.map(p => p.y))});
  }

  function txt(value, x, y, config = {}) {
    const {size = 30, family = font.sans, weight = 400, color = '#fff',
      align = 'left', width, italic = false, spacing = 0} = config;
    context.fillStyle = color;
    context.font = (italic ? 'italic ' : '') + weight + ' ' + size + 'px ' + family;
    context.textBaseline = 'top';
    context.textAlign = align;
    context.letterSpacing = spacing + 'px';
    recordText(value, x, y, width);
    if (width) context.fillText(value, x, y, width);
    else context.fillText(value, x, y);
  }

  function words(lines, x, y, config = {}) {
    const height = config.lineHeight || config.size * 1.04;
    lines.forEach((line, i) => txt(line, x, y + i * height, config));
  }

  function fadeIn(amount, x, y, draw) {
    if (amount <= 0) return;
    context.save();
    context.globalAlpha *= amount;
    context.translate((1 - amount) * x, (1 - amount) * y);
    draw();
    context.restore();
  }

  function cutaway(time, box, opacity, tint, slot = 'lead', fade = true) {
    const frames = cutaways[slot];
    if (!frames?.length || time < 0 || time > 7.2) return;
    const [x, y, w, h] = box;
    const image = frames[Math.min(frames.length - 1, Math.floor(time * 12))];
    const scale = Math.max(w / image.width, h / image.height) * (1.01 + .11 * ease(time / 6));
    context.save();
    context.beginPath();
    context.rect(x, y, w, h);
    context.clip();
    context.globalAlpha = opacity * (fade ? progress(time, 0, .6) * limit((7.2 - time) / 1.6) : 1);
    context.filter = tint;
    const width = image.width * scale;
    const height = image.height * scale;
    context.drawImage(image, x + (w - width) * .5 + 9 * limit(time / 6), y + (h - height) * .5, width, height);
    context.restore();
  }

  function curve(from, controls, end, color, width, fraction = 1) {
    const point = p => {
      const q = 1 - p;
      return [q ** 3 * from[0] + 3 * q * q * p * controls[0][0] +
        3 * q * p * p * controls[1][0] + p ** 3 * end[0],
      q ** 3 * from[1] + 3 * q * q * p * controls[0][1] +
        3 * q * p * p * controls[1][1] + p ** 3 * end[1]];
    };
    const samples = Array.from({length: 36}, (_, index) => point(index * fraction / 35));
    path(samples, color, width);
    return samples.at(-1);
  }

  function focusBar(x, y, width, t, color, signal) {
    const sweep = (t * 66) % (width + 140) - 70;
    context.save();
    context.beginPath();
    context.rect(x, y - 8, width, 16);
    context.clip();
    const angle = Array.from({length: Math.ceil(width / 7)}, (_, i) => {
      const at = i * 7;
      const gain = Math.max(.13, 1 - Math.abs(at - sweep) / 110);
      return [x + at, y + 5 * gain * Math.sin(at * .21 - t * 6 + signal)];
    });
    path(angle, color, 1.2);
    context.restore();
  }

  function labSheet(x, y, tilt, color, flagged) {
    const p = palettes.agiel;
    context.save();
    context.translate(x, y);
    context.rotate(tilt);
    fill(p.black, -101, -140, 202, 280);
    border(color, -101, -140, 202, 280, 2);
    fill(color, -77, -108, 60, 5);
    for (let index = 0; index < 7; index++) {
      const field = flagged && index === 3;
      fill(field ? p.accent : p.rule, -77, -77 + index * 25, 98 + ((index * 19) % 53), field ? 5 : 2);
    }
    context.restore();
  }

  function agiel(scene, index, t, duration) {
    const p = palettes.agiel;
    fill(p.bg);
    for (let x = 24; x < WIDTH; x += 32) path([[x, 78], [x, 616]], '#21151e');
    for (let y = 78; y < 618; y += 32) path([[52, y], [1228, y]], '#21151e');
    path([[52, 611], [1228, 611]], p.rule);
    focusBar(52, 603, 1176, t, '#874849', index);
    const title = (x, y, size = 82) => words(scene.heading, x, y, {
      color: p.ink, size, lineHeight: size * .94, weight: 800, family: font.condensed, width: WIDTH - x - 49,
    });

    if (index === 0) {
      title(76, 157, 113);
      txt('Same flag. Different origins.', 79, 418, {size: 36, color: p.muted, weight: 550});
      border(p.rule, 640, 113, 535, 441, 1);
      cutaway(t, [644, 117, 527, 433], .53, 'grayscale(1) sepia(.42) contrast(1.2) brightness(.82)');
      const move = progress(t, .37, 2.2);
      const float = Math.sin(t * 1.09) * 4;
      labSheet(824 + float, mix(288, 329, move) - float, -.19 + float * .008, p.soft, false);
      labSheet(979 - float, mix(385, 338, move) + float, .16 - float * .008, p.accent, true);
      const phase = (Math.max(0, t - .2) / 4.8) % 2;
      const beam = 148 + (phase <= 1 ? phase : 2 - phase) * 354;
      fill('#49252c', 644, beam - 5, 527, 11);
      fill(p.accent, 644, beam, 527, 2);
      for (const x of [656, 1159]) fill(p.ink, x - 3, beam - 3, 6, 6);
    } else if (index === 1) {
      title(709, 139, 76);
      words(['The paper synthesizes', 'prior detector studies.'], 714, 351,
        {size: 34, color: p.muted, lineHeight: 44, width: 470});
      const count = progress(t, .47, 1.21);
      for (let n = 0; n < 57; n++) {
        const x = 78 + (n % 10) * 56;
        const y = 150 + Math.floor(n / 10) * 64;
        const selected = n < 33 && count > n / 34;
        fill(selected ? p.accent : p.paper, x, y, 38, 44);
        if (!selected) border(p.rule, x, y, 38, 44);
        if (selected && Math.floor(t * 4.8) % 33 === n) border(p.ink, x - 3, y - 3, 44, 50, 2);
        fill(selected ? p.bg : p.rule, x + 8, y + 13, 21, 2);
        fill(selected ? p.bg : p.rule, x + 8, y + 22, 14, 2);
      }
      txt('33 of 57 records selected', 78, 549, {color: p.ink, size: 27, family: font.mono});
    } else if (index === 2) {
      title(76, 112, 80);
      const rows = [
        ['Watermarking', 'A trace placed by the generator'],
        ['Training-based', 'A classifier trained on examples'],
        ['Statistical', 'Patterns and predictability in text'],
        ['Retrieval-based', 'A match against stored outputs'],
      ];
      rows.forEach((row, n) => fadeIn(progress(t, .55 + n * 2.9), 36, 0, () => {
        const y = 231 + n * 89;
        if (Math.min(3, Math.floor(Math.max(0, t - .55) / 2.9)) === n) {
          const band = 16 + 6 * Math.sin(t * 2.3);
          fill('#472931', 79, y + 2, 5, 76);
          fill(p.accent, 79, y + 39 - band / 2, 5, band);
        }
        path([[79, y], [1200, y]], p.rule);
        disc(112, y + 39, 4, p.accent);
        txt(row[0], 165, y + 20, {size: 39, color: p.ink, weight: 700});
        txt(row[1], 625, y + 26, {size: 28, color: p.muted});
      }));
    } else if (index === 3) {
      title(76, 108, 83);
      [[77, 'False positive', 'Human writing', 'Flagged as AI'], [646, 'False negative', 'AI writing', 'Missed by the tool']].forEach((row, n) => {
        const [x, label, input, result] = row;
        fadeIn(progress(t, n * .48), 0, 25, () => {
          fill(p.black, x, 244, 555, 232);
          fill(p.accent, x, 244, 555, 4);
          txt(label, x + 25, 267, {color: p.ink, size: 41, weight: 750});
          txt(input, x + 26, 345, {color: p.muted, size: 33});
          txt(result, x + 26, 407, {color: p.accent, size: 34, weight: 650, width: 284});
          focusBar(x + 350, 426, 158, t * .85, p.accent, n * 2.3);
        });
      });
      txt('Recheck on the model, genre and learners you will actually see.', 79, 534,
        {size: 31, color: p.muted});
    } else if (index === 4) {
      title(76, 117, 90);
      const axes = [
        ['Reliability', 'Does it hold up under checks?'],
        ['Generalizability', 'Does it travel to other settings?'],
        ['Accessibility', 'Can teachers use it in practice?'],
      ];
      axes.forEach(([name, claim], n) => {
        const x = 78 + n * 385;
        const y = 273;
        fadeIn(progress(t, .46 + 2.25 * n), 0, 34, () => {
          border(p.rule, x, y, 353, 222);
          path([[x, y + 24], [x, y], [x + 24, y]], p.accent, 3);
          txt(name, x + 23, y + 49, {size: 38, color: p.ink, width: 303, weight: 720});
          txt(claim, x + 23, y + 116, {size: 23, color: p.muted, width: 305});
          focusBar(x + 23, y + 181, 300, t, p.soft, n * 1.7);
        });
      });
      txt('Ibrahim’s AICEF framework', 79, 537, {size: 27, color: p.accent, family: font.mono});
    } else {
      title(76, 124, 90);
      const steps = ['Check the flag', 'Review drafts', 'Hear the learner', 'Decide in context'];
      path([[188, 388], [1091, 388]], p.rule, 3);
      const lit = limit((t - .38) / 5);
      path([[190, 388], [190 + 897 * lit, 388]], p.accent, 3);
      disc(190 + 897 * lit, 388, 4 + 1.8 * Math.sin(t * 3), p.ink);
      steps.forEach((label, n) => {
        const x = 190 + n * 299;
        const amount = progress(t, .38 + n * 1.35);
        fadeIn(amount, 16, 0, () => {
          fill(p.accent, x - 10, 379, 19, 19);
          txt(label, x, 420, {
            size: 33, color: p.ink, weight: 680, align: 'center', width: 270,
          });
        });
      });
      txt('Use a flag to start a review.', 80, 536, {size: 34, color: p.muted});
    }
    const page = (index + limit(t / duration)) / film.scenes.length;
    fill(p.accent, 52, 611, page * 1176, 3);
  }

  function confessor(scene, index, t, duration) {
    const p = palettes.confessor;
    fill(p.bg);
    const title = (x, y, size = 82, align = 'left', width = 1134) => words(scene.heading, x, y, {
      align, size, lineHeight: size * 1.06, color: p.ink, family: font.serif, width,
    });
    const label = (value, x, y, options = {}) => txt(value, x, y,
      {size: 25, color: p.blue, weight: 650, spacing: 1, ...options});
    path([[72, 612], [1208, 612]], '#9ca2b1');

    if (index === 0) {
      title(640, 123, 96, 'center');
      const amount = progress(t, .55, 4.2);
      const blue = curve([111, 423], [[339, 424], [408, 550]], [681, 465], p.blue, 16, amount);
      const red = curve([111, 538], [[350, 538], [410, 365]], [681, 465], p.gold, 16, amount);
      disc(...blue, 8, p.blue);
      disc(...red, 8, p.gold);
      const join = curve([686, 465], [[794, 418 + 8 * Math.sin(t)], [929, 472]], [1161, 464],
        p.ink, 17, progress(t, 3.1, 4.0));
      if (t > 3.1) disc(...join, 8, p.ink);
      txt('Quantitative', 110, 375, {size: 33, color: p.blue, weight: 650});
      txt('Qualitative', 110, 553, {size: 33, color: p.gold, weight: 650});
      txt('Integrated study', 1160, 500, {size: 34, color: p.ink, align: 'right', weight: 650});
    } else if (index === 1) {
      title(69, 132, 84, 'left', 647);
      txt('36 invitations', 73, 408, {size: 47, color: p.muted, family: font.serif});
      txt('19 definitions', 73, 467, {size: 73, color: p.blue, family: font.serif, weight: 700});
      for (let i = 0; i < 36; i++) {
        const x = 770 + (i % 6) * 71;
        const y = 151 + Math.floor(i / 6) * 71;
        const active = i < 19 && progress(t, .3 + i * .16, .3) > .68;
        disc(x, y, active ? 16 : 13, active ? p.blue : '#a4a8af', active ? 0 : 2);
        if (active && Math.floor(t * 5) % 19 === i) disc(x, y, 22 + 3 * Math.sin(t * 4), p.gold, 1.4);
      }
      txt('Constant comparison', 770, 549, {size: 28, color: p.muted});
    } else if (index === 2) {
      title(71, 123, 83);
      const themes = [
        ['What', 'Which elements?'], ['When or where', 'At what point?'], ['Breadth', 'How much?'],
        ['Why', 'Toward what purpose?'], ['Orientation', 'Which research stance?'],
      ];
      themes.forEach(([name, detail], i) => {
        const x = 76 + (i % 3) * 395;
        const y = 255 + Math.floor(i / 3) * 159;
        fadeIn(progress(t, .35 + i * 1.55), -13, 10, () => {
          path([[x, y], [x + 340 * progress(t, .35 + i * 1.55, 1.7), y]], i % 2 ? p.gold : p.blue, 3);
          txt(name, x, y + 13, {size: 52, color: p.ink, family: font.serif, width: 346});
          txt(detail, x + 1, y + 79, {size: 29, color: p.muted, width: 346});
        });
      });
      const r = Math.sin(t * .92) * 16;
      for (let j = 0; j < 7; j++) {
        const y = 455 + j * 11;
        curve([870, y], [[976, y - 37 + r], [1074, y + 47 - r]], [1200, y - 23],
          j % 2 ? '#a447306b' : '#25469c68', 2, progress(t, 5.1, 2.3));
      }
    } else if (index === 3) {
      title(72, 128, 84);
      const x0 = 160;
      const x1 = 1120;
      for (let j = 0; j < 10; j++) {
        const lineY = 357 + j * 4;
        const current = 12 * Math.sin(t * .77 + j * .16);
        curve([x0, lineY - 36], [[400, lineY + 62 + current], [830, lineY - 48 - current]], [x1, lineY + 30], '#25469c60', 3);
        curve([x0, lineY + 62], [[420, lineY - 26 - current], [844, lineY + 74 + current]], [x1, lineY - 57], '#a447306f', 3);
      }
      const position = mix(x0, x1, progress(t, 1.8, 8));
      path([[x0, 428], [x1, 428]], '#9ca2b1', 2);
      for (const x of [x0, 640, x1]) path([[x, 418], [x, 438]], p.ink, 2);
      disc(position, 428, 9, p.ink);
      const positions = [['QUAL + quan', x0, 'left'], ['Equal status', 640, 'center'], ['QUAN + qual', x1, 'right']];
      positions.forEach(([value, x, align]) => txt(value, x, 478, {size: 37, color: p.ink, weight: 630, align}));
      txt('The design determines which strand takes the lead.', 640, 555, {size: 29, color: p.muted, align: 'center'});
    } else if (index === 4) {
      title(73, 151, 103, 'left', 615);
      cutaway(t, [705, 140, 490, 386], .6, 'saturate(.68) contrast(.86)');
      const drift = Math.sin(t * .59) * 6;
      const circles = [[843 - drift, 313, 151, '#7595d228', p.blue], [998 + drift, 374, 157, '#d3917829', p.gold]];
      circles.forEach(([x, y, r, tint, color], i) => fadeIn(progress(t, .15 + i * .65), i ? 25 : -25, 12, () => {
        disc(x, y, r, tint);
        disc(x, y, r, color, 3);
      }));
      txt('QUAL', 769, 263, {size: 37, color: p.blue, weight: 680});
      txt('QUAN', 1028, 388, {size: 37, color: p.gold, weight: 680});
      txt('See more. Understand more. Check how the pieces fit.', 73, 543, {size: 30, color: p.muted});
    } else {
      title(69, 120, 90);
      const note = progress(t, .65, 1.05);
      path([[72, 341], [1208, 341]], '#a4a8af', 1.2);
      path([[632, 362], [632, 560]], '#a4a8af', 1.2);
      label('GENERAL DEFINITION', 74, 366);
      words(['Qualitative and quantitative', 'elements are combined.'], 73, 412,
        {size: 46, color: p.ink, family: font.serif, width: 530});
      fadeIn(note, 18, 15, () => {
        label('TENTATIVE FULLER DEFINITION', 665, 366, {color: p.gold});
        words(['Adds pragmatism and', 'social awareness.'], 664, 412,
          {size: 46, color: p.ink, family: font.serif, width: 522});
      });
      const breath = 9 * Math.sin(t * 1.2);
      curve([73, 557], [[304, 519 + breath], [530, 588 - breath]], [1208, 557],
        '#25469c58', 2, progress(t, 3, 7));
    }
    fill(p.blue, 72, 611, 1136 * ((index + limit(t / duration)) / film.scenes.length), 2);
  }

  function printedPage(x, y, size, turn, step, intro) {
    const p = palettes.seeker;
    context.save();
    context.translate(x, y);
    context.rotate(turn);
    fill('#171810', -size * .45 + 10, -size * .55 + 13, size * .9, size * 1.12);
    fill(p.ink, -size * .45, -size * .55, size * .9, size * 1.12);
    fill(p.black, -size * .34, -size * .41, size * .43, 6);
    fill(p.rust, -size * .34, -size * .36, size * .59, 2);
    for (let j = 0; j < 6; j++) fill('#9a9b78', -size * .34, -size * .25 + size * .079 * j,
      size * (.46 + (j * 7 % 11) * .018), 2);
    if (!intro) {
      fill(p.accent, -size * .31, size * .24, size * .61, size * .19);
      txt(step, 0, size * .263, {size: size * .082, color: p.black, align: 'center', weight: 700, width: size * .55});
    }
    context.restore();
  }

  function seeker(scene, index, t, duration) {
    const p = palettes.seeker;
    fill(p.bg);
    const title = (x, y, size = 89, width = WIDTH - x - 61) => words(scene.heading, x, y, {
      size, lineHeight: size, color: p.ink, family: font.condensed, weight: 700, width,
    });
    const pairs = [
      ['Brainstorm', 'Verify against original sources.'],
      ['Prototype code', 'Audit the data and results.'],
      ['Revise a draft', 'Check citations and disclosure.'],
      ['Screen submissions', 'Keep specialist judgment human.'],
      ['Support the workflow', 'People answer for the claims.'],
    ];
    const stages = ['IDEA', 'METHODS', 'DRAFT', 'REVIEW', 'PUBLISH'];
    const step = Math.max(0, index - 1);

    if (index === 0) {
      title(72, 154, 104, 645);
      txt('A 2024 preprint on AI in academic publishing', 77, 407,
        {size: 31, color: p.muted, width: 625});
      cutaway(t, [798, 136, 406, 389], .65, 'grayscale(.9) sepia(.55) contrast(1.12) brightness(.96)');
      const sweep = progress(t, .38, 5.4);
      for (let j = 0; j < 7; j++) {
        const x = 672 + j * 72 - 12 * sweep;
        path([[x, 531], [x + 160, 134]], '#424c2c', 2);
      }
      path([[633, 534], [745, 478], [939, 478], [1163, 330]], p.rule, 5);
      printedPage(mix(894, 990, sweep), mix(326, 307, sweep), 283, mix(-.14, .12, sweep), '', true);
      txt('MANUSCRIPT IN TRANSIT', 1196, 513, {size: 21, color: p.accent, family: font.mono, align: 'right'});
    } else {
      title(75, index === 5 ? 123 : 144, index === 5 ? 81 : 85, 725);
      const enter = progress(t, .22, 1.16);
      fadeIn(enter, 36, 0, () => {
        const y = index === 5 ? 326 : 298;
        path([[77, y], [808, y]], p.rule, 2);
        txt('AI CAN ASSIST', 78, y + 19, {size: 22, color: p.accent, family: font.mono, spacing: 1.7});
        txt(pairs[step][0], 76, y + 49, {size: 48, color: p.ink, weight: 680, width: 680});
        fadeIn(progress(t, 4.8, .7), 14, 0, () => {
          txt(pairs[step][1], 78, y + 119, {size: 32, color: p.muted, width: 690});
        });
      });

      const rx = 905;
      const ry = 267;
      const running = progress(t, .15, 4.7);
      path([[rx - 23, ry + 188], [rx - 15, ry + 33], [1157, ry + 33], [1210, ry + 188]], p.rule, 2);
      path([[rx - 23, ry + 188], [1210, ry + 188]], p.rule, 9);
      for (let i = 0; i < 13; i++) {
        disc(rx + i * 23, ry + 188, 5, (i + Math.floor(t * 12)) % 4 === 0 ? p.accent : '#272e1b');
      }
      printedPage(mix(rx + 15, rx + 122, running), mix(ry + 97, ry + 68, running),
        163, -.13 + running * .18, stages[step], false);
      const tracer = rx + (t * 115) % 278;
      fill(p.accent, tracer, ry + 185, Math.min(21, 1207 - tracer), 6);
      txt('RESEARCHER / EDITOR', 1207, 488, {size: 19, align: 'right', color: p.muted, family: font.mono});
    }

    const routeY = 557;
    fill(p.black, 0, routeY, WIDTH, 68);
    const begin = 73;
    const end = 1207;
    const span = (end - begin) / stages.length;
    for (let i = 0; i < stages.length; i++) {
      const x = begin + i * span;
      if (index > 0 && i === step) fill(p.accent, x, routeY + 2, span - 11, 3);
      txt(stages[i], x + 8, routeY + 28, {
        size: 25, color: index > 0 && i === step ? p.accent : p.muted, family: font.mono, weight: 650,
      });
    }
    const active = index === 0 ? limit(t / duration) : (step + limit(t / duration)) / stages.length;
    fill(p.rust, 0, 621, WIDTH * active, 3);
  }

  window.setupFilm = (name, manifest) => { theme = name; film = manifest; };
  window.installFilmCover = async encoded => {
    cover = new Image();
    cover.src = 'data:image/jpeg;base64,' + encoded;
    await cover.decode();
  };
  window.installFilmFootage = (frames, position) => Promise.all(frames.map(async encoded => {
    const image = new Image();
    image.src = 'data:image/jpeg;base64,' + encoded;
    await image.decode();
    return image;
  })).then(images => { cutaways[position] = images; });
  const B_ROLL = {
    agiel: [
      [0, 8.1, 2.8, 'six'], [1, .22, 3.25, 'four'], [1, 6.4, 3.1, 'one'],
      [2, .20, 3.45, 'five'], [3, .20, 3.65, 'two'],
      [4, .25, 3.9, 'seven'], [5, .18, 3.85, 'three'],
    ],
    confessor: [
      [0, 3.4, 4.1, 'four'], [1, .28, 3.6, 'one'], [2, .2, 3.65, 'two'],
      [2, 6.2, 4.5, 'five'], [3, .25, 3.55, 'six'], [4, .2, 3.65, 'three'],
      [5, 6.8, 3.8, 'seven'],
    ],
    seeker: [
      [0, 8.15, 2.8, 'four'], [1, .24, 3.6, 'six'], [1, 6.1, 3.2, 'one'],
      [2, .24, 3.5, 'five'], [3, .24, 3.7, 'two'],
      [5, .24, 3.5, 'three'], [5, 6.5, 4.4, 'seven'],
    ],
  };
  const GRADES = {
    agiel: 'grayscale(.86) sepia(.46) contrast(1.2) brightness(.87)',
    confessor: 'saturate(.75) contrast(.96) brightness(1.04)',
    seeker: 'grayscale(.52) sepia(.53) contrast(1.16) brightness(.96)',
  };
  function editCutaway(t, index) {
    const shot = B_ROLL[theme].find(([scene, start, duration]) =>
      scene === index && t >= start && t < start + duration);
    if (!shot || !cutaways[shot[3]]) return;
    const [, start, duration, slot] = shot;
    const local = t - start;
    const arrival = progress(local, 0, .28);
    const departure = progress(local, duration - .75, .75);
    const coverage = Math.min(arrival, 1 - departure);
    context.save();
    context.beginPath();
    if (theme === 'confessor') {
      const h = Math.round(HEIGHT * coverage);
      context.rect(0, 0, WIDTH, h);
    } else if (theme === 'agiel') {
      for (let row = 0; row < 4; row++) {
        const remaining = Math.max(0, WIDTH * coverage - row * 13 * Math.sin(coverage * Math.PI));
        context.rect(WIDTH - remaining, row * HEIGHT / 4, remaining, HEIGHT / 4);
      }
    } else {
      const edge = WIDTH * coverage;
      const bevel = 65 * Math.sin(coverage * Math.PI);
      context.moveTo(0, 0);
      context.lineTo(edge - bevel, 0);
      context.lineTo(edge + bevel, HEIGHT);
      context.lineTo(0, HEIGHT);
      context.closePath();
    }
    context.clip();
    cutaway(local + .53, [0, 0, WIDTH, HEIGHT], 1, GRADES[theme], slot, false);
    const shade = context.createLinearGradient(0, 530, 0, HEIGHT);
    shade.addColorStop(0, '#08090b00');
    shade.addColorStop(1, '#08090bad');
    fill(shade, 0, 530, WIDTH, HEIGHT - 530);
    context.restore();
  }
  function editTransition(t, index) {
    const p = palettes[theme];
    if (index === 0 && cover && t < 1.1) {
      const amount = progress(t, .27, .83);
      const x = Math.round(WIDTH * amount);
      context.save();
      context.beginPath();
      context.rect(x, 0, WIDTH - x, HEIGHT);
      context.clip();
      const scale = 1.02 + .015 * t;
      context.drawImage(cover, -(scale - 1) * WIDTH / 2, -(scale - 1) * HEIGHT / 2, WIDTH * scale, HEIGHT * scale);
      context.restore();
      if (x > 0) fill(p.accent || p.blue, x, 0, 3, HEIGHT);
    }
    if (index === 0 || t > .48) return;
    const amount = progress(t, 0, .48);
    if (theme === 'confessor') {
      const remaining = HEIGHT - Math.round(HEIGHT * amount);
      fill(p.bg, 0, HEIGHT - remaining, WIDTH, remaining);
      fill(p.faint, 0, HEIGHT - remaining, WIDTH, 2);
    } else {
      const x = Math.round(WIDTH * amount);
      fill(p.black, x, 0, WIDTH - x, HEIGHT);
      fill(p.accent, x, 0, theme === 'seeker' ? 5 : 2, HEIGHT);
    }
  }
  window.paintFilm = frame => {
    const index = film.scenes.findLastIndex(scene => frame >= scene.frame);
    const scene = film.scenes[Math.max(0, index)];
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = 1;
    const paint = {agiel, confessor, seeker}[theme];
    const t = (frame - scene.frame) / TICKS;
    paint(scene, Math.max(0, index), t, scene.frames / TICKS);
    window.paintFilmHologram(context, theme, index, t, WIDTH, HEIGHT);
    editCutaway(t, index);
    editTransition(t, index);
  };
  window.auditFilm = (first, count) => {
    try {
      for (let frame = first; frame < first + count; frame++) {
        textBounds = [];
        window.paintFilm(frame);
        for (const [i, a] of textBounds.entries()) {
          if (a.left < 8 || a.right > WIDTH - 8 || a.top < 8 || a.bottom > CAPTION_EDGE) {
            return {frame, reason: 'outside the caption-safe text area', labels: [a.value], bounds: a};
          }
          for (const b of textBounds.slice(i + 1)) {
            if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
                Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) {
              return {frame, reason: 'overlapping visible glyph bounds', labels: [a.value, b.value]};
            }
          }
        }
      }
      return null;
    } finally {
      textBounds = undefined;
    }
  };
  window.exportFrames = (first, count) => Array.from({length: count}, (_, offset) => {
    window.paintFilm(first + offset);
    return canvas.toDataURL('image/jpeg', .92).split(',')[1];
  });
})();
