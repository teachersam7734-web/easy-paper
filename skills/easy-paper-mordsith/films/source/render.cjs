/* Render original offline compositions at 24fps. Requires Playwright, Chromium and FFmpeg. */
const fs = require('node:fs/promises');
const path = require('node:path');
const {execFile, spawn} = require('node:child_process');
const {once} = require('node:events');
const {pathToFileURL} = require('node:url');
const {promisify} = require('node:util');

const playwright = require(process.env.EASY_PAPER_PLAYWRIGHT || 'playwright');
const [work, ...options] = process.argv.slice(2);
const auditOnly = options.includes('--audit');
const requested = options.filter(option => option !== '--audit');
const fontFiles = {
  agiel: ['rajdhani-700-latin.woff2', 'inter-400-latin.woff2', 'jetbrains-mono-400-latin.woff2'],
  confessor: ['eb-garamond-400-latin.woff2', 'sora-400-latin.woff2', 'ibm-plex-mono-400-latin.woff2'],
  seeker: ['space-grotesk-700-latin.woff2', 'outfit-400-latin.woff2', 'ibm-plex-mono-500-latin.woff2'],
};
const footageCredits = {
  agiel: 'A Person Using a Copier, Phillips Vinegar / Pexels · excerpt, crop and grade',
  confessor: 'Colored Liquids Mixing in Slow Motion, Dan Cristian Pădureț / Pexels · excerpt, crop and grade',
  seeker: 'Close up of an Industrial Printing Machine Working, Kuba Grzybek / Pexels · excerpt, crop and grade',
};
const sourceNames = {
  agiel: {one: 'Coverr', two: 'cottonbro studio', three: 'Kindel Media',
    four: 'Ron Lach', five: 'Video Kickstarter', six: 'SHVETS production', seven: 'Kaboompics.com'},
  confessor: {one: 'Pavel Danilyuk', two: 'RDNE Stock project', three: 'Kindel Media',
    four: 'George Milton', five: 'Gustavo Fring', six: 'cottonbro studio', seven: 'StefWithAnF'},
  seeker: {one: 'Edmond Dantès', two: 'Pranjall Kumar', three: 'Everett Bumstead',
    four: 'MART PRODUCTION', five: 'Ron Lach', six: 'Ron Lach', seven: 'Everett Bumstead'},
};

async function installFonts(page, theme) {
  const files = fontFiles[theme];
  const sources = await Promise.all(files.map(async file => {
    return (await fs.readFile(path.join(__dirname, 'fonts', file))).toString('base64');
  }));
  await page.evaluate(async fonts => {
    const names = ['FilmDisplay', 'FilmBody', 'FilmMono'];
    for (let index = 0; index < names.length; index++) {
      const face = new FontFace(names[index], 'url(data:font/woff2;base64,' + fonts[index] + ')');
      document.fonts.add(await face.load());
    }
    await document.fonts.ready;
  }, sources);
}

async function ffmpegFrames(page, voice, effects, output, count) {
  const mix = [
    '[1:a]aformat=channel_layouts=stereo,highpass=f=72,acompressor=threshold=0.1:ratio=2:attack=12:release=120,asplit=2[voice][side]',
    '[2:a]aformat=channel_layouts=stereo,volume=0.83[foley]',
    '[foley][side]sidechaincompress=threshold=0.04:ratio=4:attack=22:release=180[ducked]',
    '[voice][ducked]amix=inputs=2:normalize=0,loudnorm=I=-17:TP=-1.5:LRA=7[sound]',
  ].join(';');
  const subprocess = spawn('ffmpeg', [
    '-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', '24',
    '-i', 'pipe:0', '-i', voice, '-i', effects,
    '-filter_complex', mix, '-map', '0:v', '-map', '[sound]',
    '-c:v', 'libx264', '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p', '-crf', '23', '-maxrate', '500k', '-bufsize', '1000k',
    '-ar', '48000', '-c:a', 'aac', '-b:a', '96k', '-threads', '3', '-movflags', '+faststart',
    '-t', String(count / 24), output,
  ], {stdio: ['pipe', 'ignore', 'inherit'], windowsHide: true});
  const finished = once(subprocess, 'close');
  const stream = subprocess.stdin;
  stream.on('error', () => {});
  try {
    for (let first = 0; first < count; first += 36) {
      const frames = await page.evaluate(({start, length}) => window.exportFrames(start, length),
        {start: first, length: Math.min(36, count - first)});
      const chunk = Buffer.concat(frames.map(encoded => Buffer.from(encoded, 'base64')));
      if (!stream.write(chunk)) await Promise.race([once(stream, 'drain'), finished]);
      if (stream.destroyed && first + frames.length < count) throw new Error('FFmpeg stopped early.');
    }
  } finally {
    stream.end();
  }
  const [code] = await finished;
  if (code !== 0) throw new Error('FFmpeg failed with exit code ' + code);
}

async function installFootage(page, inputs, name, slot = 'lead') {
  const clip = path.join(__dirname, 'footage', name + '.mp4');
  try {
    await fs.access(clip);
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
  const item = path.join(inputs, 'footage-' + slot);
  await fs.mkdir(item, {recursive: true});
  const pattern = path.join(item, 'cutaway-%03d.jpg');
  await promisify(execFile)('ffmpeg', ['-y', '-v', 'error', '-i', clip,
    '-vf', 'fps=12', '-frames:v', '72', '-q:v', '3', pattern], {windowsHide: true});
  const names = (await fs.readdir(item)).filter(name => /^cutaway-\d{3}\.jpg$/.test(name)).sort();
  if (names.length !== 72) throw new Error('Expected 72 frames of licensed footage for ' + name);
  const frames = await Promise.all(names.map(async name =>
    (await fs.readFile(path.join(item, name))).toString('base64')));
  await page.evaluate(({images, position}) => window.installFilmFootage(images, position),
    {images: frames, position: slot});
  return true;
}

async function auditFrames(page, count, theme) {
  for (let first = 0; first < count; first += 96) {
    const collision = await page.evaluate(({firstFrame, size}) => window.auditFilm(firstFrame, size),
      {firstFrame: first, size: Math.min(96, count - first)});
    if (collision) throw new Error(theme + ' at ' + (collision.frame / 24).toFixed(2) +
      's: ' + collision.reason + ': ' + collision.labels.join(' | '));
  }
  console.log(theme + ': ' + count + ' text and caption-safe frames checked');
}

async function film(browser, theme) {
  const inputs = path.resolve(work, theme);
  const output = path.resolve(__dirname, '..', theme);
  await fs.mkdir(output, {recursive: true});
  const timeline = JSON.parse(await fs.readFile(path.join(inputs, 'timeline.json'), 'utf-8'));
  const page = await browser.newPage({viewport: {width: 1280, height: 720}});
  try {
    await page.goto(pathToFileURL(path.join(__dirname, 'composition.html')).href);
    await installFonts(page, theme);
    await page.evaluate(({name, data}) => window.setupFilm(name, data), {name: theme, data: timeline});
    const cover = await fs.readFile(path.join(output, 'cover.jpg')).catch(error => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (cover) await page.evaluate(encoded => window.installFilmCover(encoded), cover.toString('base64'));
    await auditFrames(page, timeline.frames, theme);
    if (auditOnly) return;
    const primary = await installFootage(page, inputs, theme);
    const additional = [];
    for (const [slot, creator] of Object.entries(sourceNames[theme])) {
      if (await installFootage(page, inputs, theme + '-' + slot, slot)) additional.push(creator);
    }
    const credit = [primary ? footageCredits[theme] : '',
      additional.length ? [...new Set(additional)].join(', ') + ' / Pexels · additional edited footage' : '',
      timeline.narrator ? 'Narration: ' + timeline.narrator : ''].filter(Boolean).join('. ');
    const poster = await page.evaluate(() => window.exportFrames(106, 1)[0]);
    await fs.writeFile(path.join(output, 'poster.jpg'), Buffer.from(poster, 'base64'));
    const effects = path.join(inputs, 'effects.wav');
    await promisify(execFile)('python', [path.join(__dirname, 'sound_design.py'), theme,
      path.join(inputs, 'timeline.json'), effects], {windowsHide: true});
    await ffmpegFrames(page, path.join(inputs, 'narration.wav'), effects,
      path.join(output, 'summary.mp4'), timeline.frames);
    const {title, source, duration, cues} = timeline;
    await fs.writeFile(path.join(output, 'film.json'),
      JSON.stringify(credit ? {title, source, duration, cues, credit} : {title, source, duration, cues}, null, 2) + '\n');
    await fs.copyFile(path.join(inputs, 'captions.vtt'), path.join(output, 'captions.vtt'));
    console.log(theme + ': rendered ' + duration.toFixed(2) + ' seconds');
  } finally {
    await page.close();
  }
}

(async () => {
  if (!work) throw new Error('Pass the temporary folder used by prepare.py.');
  const names = requested.length ? requested : Object.keys(fontFiles);
  if (names.some(name => !Object.hasOwn(fontFiles, name))) throw new Error('Unrecognized film name.');
  const browser = await playwright.chromium.launch({executablePath: process.env.EASY_PAPER_CHROMIUM});
  try {
    const results = await Promise.allSettled(names.map(name => film(browser, name)));
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length) throw new Error(failures.map(result => result.reason.message).join('\n'));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
