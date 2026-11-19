/* Smoke-test built Mord'Sith pages using a local Playwright and Chromium. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

const playwright = require(process.env.EASY_PAPER_PLAYWRIGHT || 'playwright');
const [templates, output, ...selected] = process.argv.slice(2);
const modes = ['study-map', 'deep-dive', 'critique', 'review-guide', 'vocab-treasure', 'quiz'];
const papers = {Agiel: 'ai-plagiarism', Confessor: 'mixed-methods', Seeker: 'ai-publishing'};

async function verifyBoxes(page, theme, width, state) {
  const defects = await page.evaluate(() => {
    const reported = new Set();
    const shown = element => !element.closest('[inert]') &&
      element.getClientRects().length && getComputedStyle(element).visibility === 'visible';
    if (document.documentElement.scrollWidth > innerWidth + 1) reported.add('page extends beyond viewport');
    for (const owner of document.querySelectorAll(
      '.hero, .mode-nav, .study-card, .map-card, .quiz-card, .paper-film, .panel-head, [data-check-box]'
    )) {
      if (!shown(owner)) continue;
      const bounds = owner.getBoundingClientRect();
      for (const element of owner.querySelectorAll('h1,h2,h3,h4,p,li,a,button,summary,label,legend,span')) {
        const closed = element.closest('details:not([open])');
        if (!shown(element) || element.closest('[aria-hidden="true"]') ||
            (closed && !element.closest('summary'))) continue;
        const scrollable = element.closest('[data-horizontal-scroll]');
        if (scrollable && owner.contains(scrollable)) continue;
        for (const node of element.childNodes) {
          if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            if (rect.width < 1) continue;
            if (rect.left < bounds.left - 3 || rect.right > bounds.right + 3 ||
                rect.top < bounds.top - 4 || rect.bottom > bounds.bottom + 4) {
              reported.add('text escaped ' + (owner.id || owner.classList[0]) + ': ' +
                node.textContent.trim().slice(0, 70));
            }
          }
        }
      }
    }
    for (const card of document.querySelectorAll('.quiz-card')) {
      if (!shown(card)) continue;
      const stem = card.querySelector('.quiz-front .quiz-stem');
      if (!stem || card.getAttribute('aria-labelledby') !== stem.id) {
        reported.add('quiz card missing a named stem');
        continue;
      }
      const box = card.getBoundingClientRect();
      const face = card.querySelector('.quiz-face:not([inert])');
      const heading = face.querySelector('h3');
      const title = heading.getBoundingClientRect();
      const following = heading.nextElementSibling.getBoundingClientRect();
      if (title.top < box.top + 8 || title.left < box.left + 8 ||
          title.bottom > following.top - 5 || title.right > box.right - 8) {
        reported.add('quiz heading is outside its padded card: ' + heading.textContent.slice(0, 70));
      }
    }
    for (const group of document.querySelectorAll('.hero-actions,.section-grid,.quiz-grid,.map-grid')) {
      const children = [...group.children].filter(shown).map(el => el.getBoundingClientRect());
      children.forEach((a, index) => {
        for (const b of children.slice(index + 1)) {
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 3 &&
              Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 3) {
            reported.add('overlapping children in ' + group.classList[0]);
          }
        }
      });
    }
    return [...reported].slice(0, 20);
  });
  assert.deepEqual(defects, [], theme + ' ' + state + ' at ' + width + 'px\n' + defects.join('\n'));
}

async function probe(browser, theme) {
  const flat = path.resolve(templates, theme + '.html');
  const file = await fs.access(flat).then(() => flat, () => path.resolve(templates, papers[theme], theme + '.html'));
  const url = pathToFileURL(file).href;
  const context = await browser.newContext({
    viewport: {width: 1440, height: 960},
    offline: true,
    reducedMotion: 'reduce',
    acceptDownloads: true,
  });
  try {
    const page = await context.newPage();
    const issues = [];
    page.on('pageerror', error => issues.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') issues.push(message.text());
    });
    page.on('request', request => {
      if (/^https?:/i.test(request.url())) issues.push('External request: ' + request.url());
    });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    const shown = () => page.locator('.study-panel:visible').evaluateAll(
      panels => panels.map(panel => panel.id)
    );
    assert.deepEqual(await shown(), ['study-map']);
    if (output) {
      await page.emulateMedia({reducedMotion: 'no-preference'});
      await page.screenshot({path: path.join(output, theme + '-desktop.png')});
      await page.emulateMedia({reducedMotion: 'reduce'});
    }
    const summary = page.locator('#paper-film-video');
    if (await summary.count()) {
      await page.locator('a.film-action').click();
      await page.waitForFunction(() => document.activeElement.id === 'paper-film');
      const captions = page.locator('[data-film-captions]');
      await captions.click();
      assert.equal(await captions.getAttribute('aria-pressed'), 'true');
      assert.ok(await summary.evaluate(el => [...el.textTracks].some(track => track.mode === 'showing' && track.cues.length >= 6)));
      await summary.evaluate(async element => {
        element.muted = true;
        await element.play();
      });
      await page.waitForFunction(() => document.querySelector('#paper-film-video').currentTime > .16);
      const duration = await summary.evaluate(element => element.duration);
      assert.ok(duration >= 60 && duration <= 120, 'Expected a 1–2 minute film');
      await page.locator('.mode-link[href="#deep-dive"]').click();
      assert.equal(await summary.evaluate(element => element.paused), true);
      await page.locator('.mode-link[href="#study-map"]').click();
    }
    if (theme === 'Agiel') {
      const scanner = page.locator('.agiel-scan-controls button');
      const readout = page.locator('.agiel-scan-readout');
      const initial = await readout.textContent();
      assert.ok(await scanner.count() >= 3);
      await scanner.nth(1).click();
      assert.equal(await scanner.nth(1).getAttribute('aria-pressed'), 'true');
      assert.notEqual(await readout.textContent(), initial);
    }
    if (theme === 'Confessor') {
      await page.locator('button[data-lens="1"]').click();
      assert.equal(await page.locator('button[data-lens="1"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[data-lens-link]').getAttribute('href'), '#critique');
    }
    if (theme === 'Seeker') {
      const stages = page.locator('[data-seeker-stage]');
      assert.equal(await stages.count(), 5);
      await stages.nth(4).click();
      assert.equal(await stages.nth(4).getAttribute('aria-pressed'), 'true');
      await stages.nth(0).click();
    }
    for (const mode of modes.slice(1, 5)) {
      await page.locator('.mode-link[href="#' + mode + '"]').click();
      assert.deepEqual(await shown(), [mode]);
      assert.equal(await page.locator('.mode-link[aria-current]').getAttribute('href'), '#' + mode);
      const encoded = page.locator('#pdf-' + mode);
      if (!(await encoded.count())) {
        assert.equal(await page.locator('[data-pdf="' + mode + '"]').count(), 0);
        continue;
      }
      const payload = await encoded.textContent();
      const downloadReady = page.waitForEvent('download');
      await page.locator('[data-pdf="' + mode + '"]').click();
      const download = await downloadReady;
      assert.deepEqual(await fs.readFile(await download.path()), Buffer.from(payload, 'base64'));
    }
    if (theme === 'Confessor') {
      const lookup = page.locator('#vocab-treasure input[type="search"]');
      await lookup.fill('contingent');
      assert.equal(await page.locator('#vocab-treasure .vocab-card:visible').count(), 1);
      await lookup.clear();
    }
    await page.reload();
    assert.deepEqual(await shown(), ['vocab-treasure']);
    await page.locator('.mode-link[href="#quiz"]').click();
    const answer = page.locator('#retrieval .quiz-card').first();
    const choice = answer.locator('input[value="' + await answer.getAttribute('data-answer') + '"]');
    await choice.check();
    assert.equal(await answer.locator('.quiz-front .quiz-flip').getAttribute('aria-expanded'), 'false');
    await answer.locator('.quiz-stem').click();
    assert.equal(await answer.locator('.quiz-front .quiz-flip').getAttribute('aria-expanded'), 'true');
    assert.equal(await answer.locator('.quiz-front').getAttribute('inert'), '');
    assert.equal(await answer.locator('.quiz-back').getAttribute('inert'), null);
    assert.equal(await answer.locator('.quiz-answer').textContent(), (await choice.locator('..').textContent()).trim());
    assert.ok((await answer.locator('.quiz-explanation').textContent()).trim());
    assert.equal(await page.locator(':focus').getAttribute('class'), 'quiz-answer');
    await answer.locator('.quiz-back .quiz-flip').press('Enter');
    assert.equal(await answer.locator('.quiz-front .quiz-flip').getAttribute('aria-expanded'), 'false');
    assert.equal(await choice.isChecked(), true);
    await page.locator('#retrieval button[type="submit"]').click();
    assert.match(await answer.locator('.quiz-feedback').textContent(), /^Correct/);
    assert.match(await page.locator('#retrieval output').textContent(), /1 correct/);
    if (theme === 'Seeker') {
      await page.locator('.receipt-print').click();
      const downloadReady = page.waitForEvent('download');
      await page.locator('.receipt-download').click();
      assert.ok((await downloadReady).suggestedFilename().endsWith('.txt'));
    }
    await answer.locator('.quiz-front .quiz-flip').press('Space');
    await page.locator('#retrieval button[type="reset"]').click();
    assert.equal(await page.locator('#retrieval output').textContent(), '');
    assert.equal(await answer.locator('.quiz-front .quiz-flip').getAttribute('aria-expanded'), 'false');
    assert.equal(await choice.isChecked(), false);
    await page.locator('.mode-link[href="#study-map"]').click();
    await page.locator('.hero [data-present]').click();
    await page.keyboard.press('ArrowRight');
    assert.deepEqual(await shown(), ['deep-dive']);
    await page.locator('[data-step="-1"]').click();
    assert.deepEqual(await shown(), ['study-map']);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.present-controls').isVisible(), false);
    for (const [width, height] of [[320, 568], [568, 320]]) {
      await page.setViewportSize({width, height});
      await page.locator('.mode-link[href="#quiz"]').click();
      await page.locator('.hero [data-present]').click();
      await page.waitForFunction(() => {
        const height = document.querySelector('.present-controls').getBoundingClientRect().height;
        return parseFloat(getComputedStyle(document.body).paddingBlockEnd) >= height + 12;
      });
      const clearance = await page.evaluate(async () => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise(requestAnimationFrame);
        const dock = document.querySelector('.present-controls').getBoundingClientRect();
        const action = document.querySelector('#retrieval button[type="reset"]').getBoundingClientRect();
        return dock.top - action.bottom;
      });
      assert.ok(clearance >= 6, theme + ' quiz action clearance at ' + width + '×' + height + ': ' + clearance + 'px');
      await page.keyboard.press('Escape');
    }
    await page.setViewportSize({width: 1440, height: 960});
    await page.locator('.hero [data-intro]').click();
    await page.waitForFunction(() => {
      const media = document.querySelector('#signature-intro video');
      if (media.error) throw new Error(media.error.message);
      return media.readyState >= 1;
    });
    const video = page.locator('#signature-intro video');
    assert.equal(await video.evaluate(node => node.paused), true);
    assert.ok(Math.abs(await video.evaluate(node => node.duration) - 5) < .15);
    await page.locator('[data-close-intro]').click();
    assert.equal(await page.locator('#signature-intro').isVisible(), false);
    const tape = page.locator('.tape-play');
    assert.equal(await tape.count(), theme === 'Seeker' ? 1 : 0);
    if (theme === 'Seeker') {
      await tape.click();
      await page.waitForFunction(() => {
        const audio = document.querySelector('audio');
        return audio && !audio.paused && audio.currentTime > 0;
      });
      await tape.click();
      assert.equal(await page.locator('audio').evaluate(node => node.paused), true);
    }
    for (const width of [1440, 1280, 768, 390, 320]) {
      await page.setViewportSize({width, height: 844});
      await page.locator('.mode-link[href="#study-map"]').click();
      await page.evaluate(() => window.scrollTo(0, 0));
      await verifyBoxes(page, theme, width, 'hero and Study Map');
      if (width === 390 && output) await page.screenshot({path: path.join(output, theme + '-mobile.png')});
      const transcript = page.locator('.film-transcript summary');
      if (width <= 390 && await transcript.count()) {
        await transcript.click();
        await verifyBoxes(page, theme, width, 'expanded film transcript');
        await transcript.click();
      }
      for (const mode of modes.slice(1)) {
        await page.locator('.mode-link[href="#' + mode + '"]').click();
        await verifyBoxes(page, theme, width, mode);
        if (mode === 'quiz') {
          await page.locator('.quiz-front .quiz-flip').evaluateAll(buttons => buttons.forEach(button => button.click()));
          await verifyBoxes(page, theme, width, 'flipped quiz cards');
          await page.locator('.quiz-back .quiz-flip').evaluateAll(buttons => buttons.forEach(button => button.click()));
        }
      }
    }
    assert.deepEqual(issues, []);
    console.log(theme + ': offline modes, retrieval, media and containment at 320–1440px verified');
  } finally {
    await context.close();
  }
}

(async () => {
  assert.ok(templates, 'Pass the template directory and an optional screenshot directory');
  if (output) await fs.mkdir(output, {recursive: true});
  const browser = await playwright.chromium.launch({
    executablePath: process.env.EASY_PAPER_CHROMIUM,
  });
  try {
    const themes = selected.length ? selected : ['Agiel', 'Confessor', 'Seeker'];
    for (const theme of themes) await probe(browser, theme);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
