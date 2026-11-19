(() => {
  'use strict';
  const root = document.documentElement;
  const panels = [...document.querySelectorAll('.study-panel')];
  const modes = [...document.querySelectorAll('.mode-link')];
  const controls = document.querySelector('.present-controls');
  const intro = document.querySelector('#signature-intro');
  const video = intro.querySelector('video');
  const paperFilm = document.querySelector('#paper-film');
  const filmVideo = paperFilm?.querySelector('video');
  const quiz = document.querySelector('#retrieval');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let presenting = false;
  let introTrigger;
  let presentTrigger;
  root.classList.add('js');
  function measurePresentControls() {
    if (presenting) {
      root.style.setProperty('--present-controls-height', controls.getBoundingClientRect().height + 'px');
    }
  }
  new ResizeObserver(measurePresentControls).observe(controls);

  function show(index, focus) {
    active = index;
    const panel = panels[index];
    for (const item of panels) item.hidden = item !== panel;
    if (panel.id !== 'study-map') filmVideo?.pause();
    for (const link of modes) {
      if (link.hash === '#' + panel.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    controls.querySelector('[data-position]').textContent =
      (index + 1) + ' / ' + panels.length + ' · ' + panel.querySelector('h2').textContent;
    controls.querySelector('[data-step="-1"]').disabled = index === 0;
    controls.querySelector('[data-step="1"]').disabled = index === panels.length - 1;
    if (focus) {
      panel.focus({preventScroll: true});
      panel.scrollIntoView({block: 'start'});
    }
    document.dispatchEvent(new CustomEvent('mordsith:section', {detail: {id: panel.id}}));
  }

  function readHash(focus) {
    if (paperFilm && location.hash === '#paper-film') {
      show(0, false);
      if (focus) {
        paperFilm.focus({preventScroll: true});
        paperFilm.scrollIntoView({block: 'start'});
      }
      return;
    }
    const index = panels.findIndex(panel => '#' + panel.id === location.hash);
    show(Math.max(0, index), focus && index !== -1);
  }

  function navigate(index) {
    if (index < 0 || index >= panels.length) return;
    const hash = '#' + panels[index].id;
    if (location.hash !== hash) location.hash = hash;
    show(index, true);
  }

  function togglePresentation() {
    presenting = !presenting;
    root.classList.toggle('presenting', presenting);
    controls.hidden = !presenting;
    presentTrigger?.setAttribute('aria-pressed', String(presenting));
    if (presenting) {
      measurePresentControls();
      show(active, true);
    } else {
      root.style.removeProperty('--present-controls-height');
      presentTrigger?.focus();
    }
  }

  function download(button) {
    const encoded = document.getElementById('pdf-' + button.dataset.pdf).textContent;
    const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = button.dataset.filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      if (paperFilm && link.hash === '#paper-film') {
        event.preventDefault();
        if (location.hash === '#paper-film') readHash(true);
        else location.hash = '#paper-film';
        return;
      }
      const index = panels.findIndex(panel => '#' + panel.id === link.hash);
      if (index !== -1) {
        event.preventDefault();
        navigate(index);
      }
    }
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-present')) {
      if (!presenting) presentTrigger = button;
      togglePresentation();
    }
    if (button.dataset.step) navigate(active + Number(button.dataset.step));
    if (button.hasAttribute('data-intro')) {
      filmVideo?.pause();
      introTrigger = button;
      video.src = video.dataset.src;
      video.volume = 0.5;
      intro.showModal();
      if (!motion.matches) video.play().catch(() => {});
    }
    if (button.hasAttribute('data-close-intro')) intro.close();
    if (button.dataset.pdf) download(button);
  });

  intro.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    introTrigger?.focus();
  });
  video.addEventListener('play', () => document.dispatchEvent(new Event('mordsith:intro')));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && intro.open) video.pause();
    if (document.hidden) filmVideo?.pause();
  });

  if (filmVideo) {
    filmVideo.addEventListener('play', () => {
      if (intro.open) video.pause();
      document.dispatchEvent(new Event('mordsith:film'));
    });
    if ('VTTCue' in window) {
      const control = paperFilm.querySelector('[data-film-captions]');
      const cues = JSON.parse(document.getElementById('paper-film-cues').textContent);
      const track = filmVideo.addTextTrack('captions', 'English', 'en');
      track.mode = 'hidden';
      for (const item of cues) {
        const cue = new VTTCue(item.start, item.end, item.text);
        cue.snapToLines = false;
        cue.line = 97;
        cue.lineAlign = 'end';
        cue.size = 96;
        track.addCue(cue);
      }
      control.hidden = false;
      control.addEventListener('click', () => {
        track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
        control.setAttribute('aria-pressed', String(track.mode === 'showing'));
      });
    }
  }
  addEventListener('hashchange', () => {
    const current = '#' + panels[active].id;
    if (location.hash !== current) readHash(true);
  });
  document.addEventListener('keydown', event => {
    if (!presenting || intro.open || event.repeat || event.altKey || event.ctrlKey ||
        event.metaKey || event.defaultPrevented) return;
    if (event.key === 'Escape') {
      togglePresentation();
      return;
    }
    if (event.target.closest('input, select, textarea, video, [contenteditable]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(active + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  function flipCard(card, reveal, focus) {
    const stack = card.querySelector('.quiz-flashcard');
    const front = stack.querySelector('.quiz-front');
    const back = stack.querySelector('.quiz-back');
    stack.toggleAttribute('data-flipped', reveal);
    front.toggleAttribute('inert', reveal);
    back.toggleAttribute('inert', !reveal);
    front.querySelector('.quiz-flip').setAttribute('aria-expanded', String(reveal));
    if (focus) {
      const heading = (reveal ? back : front).querySelector('h3');
      heading.focus({preventScroll: true});
      const bounds = heading.getBoundingClientRect();
      if (bounds.top < 0 || bounds.bottom > innerHeight) heading.scrollIntoView({block: 'nearest'});
    }
  }

  quiz.addEventListener('click', event => {
    const card = event.target.closest('.quiz-card');
    if (!card) return;
    const toggle = event.target.closest('.quiz-flip');
    if (!toggle && (event.target.closest('input, label, a, button') || !window.getSelection()?.isCollapsed)) return;
    flipCard(card, !card.querySelector('.quiz-flashcard').hasAttribute('data-flipped'), true);
  });

  quiz.addEventListener('submit', event => {
    event.preventDefault();
    const cards = [...quiz.querySelectorAll('.quiz-card')];
    let correct = 0;
    let attempted = 0;
    for (const card of cards) {
      const choice = card.querySelector('input:checked');
      const feedback = card.querySelector('.quiz-feedback');
      if (!choice) {
        feedback.textContent = 'Choose an answer to check.';
        feedback.removeAttribute('data-result');
        continue;
      }
      const matches = choice.value === card.dataset.answer;
      attempted += 1;
      correct += Number(matches);
      feedback.dataset.result = matches ? 'correct' : 'retry';
      feedback.textContent = matches ? 'Correct.' : 'Try again or read the explanation.';
    }
    quiz.querySelector('output').textContent =
      correct + ' correct · ' + attempted + ' of ' + cards.length + ' answered';
  });
  quiz.addEventListener('reset', () => {
    quiz.querySelector('output').textContent = '';
    for (const card of quiz.querySelectorAll('.quiz-card')) {
      const feedback = card.querySelector('.quiz-feedback');
      feedback.textContent = '';
      feedback.removeAttribute('data-result');
      flipCard(card, false, false);
    }
  });
  quiz.addEventListener('change', event => {
    const card = event.target.closest('.quiz-card');
    if (!card) return;
    const feedback = card.querySelector('.quiz-feedback');
    feedback.textContent = '';
    feedback.removeAttribute('data-result');
    quiz.querySelector('output').textContent = '';
  });
  readHash(Boolean(location.hash));
})();
