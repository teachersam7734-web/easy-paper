#!/usr/bin/env python3
"""Build a standalone Mord'Sith study presentation with the Python standard library."""

import argparse
import base64
import hashlib
import html
import json
import mimetypes
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
THEMES = {"agiel": "Agiel", "confessor": "Confessor", "seeker": "Seeker"}
MODES = {
    "deep-dive": "Deep Dive",
    "critique": "Critique",
    "review-guide": "Review Guide",
    "vocab-treasure": "Vocab Treasure",
}
VIEWS = {"study-map": "Study Map", **MODES, "quiz": "Wrap-Up Quiz"}
TOKEN = re.compile(r"\{\{(ASSET:[^{}]+|[A-Z_]+)\}\}")
MIME = {".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf",
        ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".pdf": "application/pdf"}


def clean_text(value, label):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{label} must be nonempty text")
    return value


def obj(value, label):
    if not isinstance(value, dict):
        raise ValueError(f"{label} must be an object")
    return value


def items(value, label, minimum=1):
    if not isinstance(value, list) or len(value) < minimum:
        raise ValueError(f"{label} needs at least {minimum} item(s)")
    return value


def text_fields(value, label, names):
    record = obj(value, label)
    for name in names.split():
        clean_text(record.get(name), f"{label}.{name}")
    return record


def text_list(value, label, minimum=1):
    for entry in items(value, label, minimum):
        clean_text(entry, label)


def validate(data):
    text_fields(data, "presentation", "title kicker subtitle citation focus")
    if "notes" in data:
        clean_text(data["notes"], "notes")
    if "film" in data:
        if clean_text(data["film"], "film") not in THEMES:
            raise ValueError("film must name one of the bundled paper films")
    review = text_fields(data.get("qc"), "qc", "status source")
    if review["status"] != "passed":
        raise ValueError("qc.status must be passed before publishing")
    text_list(data.get("preview"), "preview", 2)
    for node in items(data.get("map"), "map", 3):
        text_fields(node, "map entry", "label detail")
    modes = obj(data.get("modes"), "modes")
    if set(modes) != set(MODES):
        raise ValueError("modes must contain " + ", ".join(MODES))
    for name, mode in modes.items():
        text_fields(mode, name, "intro")
        sections = items(mode.get("sections"), name + ".sections",
                         0 if name == "vocab-treasure" else 1)
        for section in sections:
            text_fields(section, name + " section", "title summary anchor")
            text_list(section.get("points"), name + " points", 0)
            if "memory" in section:
                clean_text(section["memory"], "memory")
    for entry in items(data.get("vocabulary"), "vocabulary"):
        text_fields(entry, "vocabulary entry", "term meaning example anchor")
        text_list(entry.get("alternatives"), "vocabulary alternatives")
    for entry in items(data.get("quiz"), "quiz", 3):
        text_fields(entry, "quiz item", "question explanation anchor")
        text_list(entry.get("options"), "quiz options", 2)
        choices = entry["options"]
        if len(set(choices)) != len(choices):
            raise ValueError("quiz options must be distinct")
        answer = entry.get("answer")
        if type(answer) is not int or not 0 <= answer < len(choices):
            raise ValueError("quiz answer must be a zero-based option index")


def esc(value):
    return html.escape(value, quote=True)


def list_markup(values):
    return "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in values) + "</ul>"


def asset_uri(path):
    mime = MIME.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0]
    if not mime:
        raise ValueError(f"Unknown media format for {path.name}")
    payload = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{payload}"


def section_card(section):
    memory = section.get("memory")
    cue = (f'<details class="memory"><summary>Memory Link</summary>'
           f'<p>{esc(memory)}</p></details>') if memory else ""
    points = list_markup(section["points"]) if section["points"] else ""
    return (f'<article class="study-card"><h3>{esc(section["title"])}</h3>'
            f'<p class="nugget">{esc(section["summary"])}</p>{points}{cue}'
            f'<p class="anchor">{esc(section["anchor"])}</p></article>')


def vocab_card(entry):
    alternatives = ", ".join(entry["alternatives"])
    return (f'<article class="study-card vocab-card"><h3>{esc(entry["term"])}</h3>'
            f'<p class="nugget">{esc(entry["meaning"])}</p>'
            f'<p><strong>Alternatives</strong> {esc(alternatives)}</p>'
            f'<p><strong>Try it</strong> {esc(entry["example"])}</p>'
            f'<p class="anchor">{esc(entry["anchor"])}</p></article>')


def quiz_card(index, entry):
    options = "".join(
        f'<label><input type="radio" name="question-{index}" value="{i}"> {esc(option)}</label>'
        for i, option in enumerate(entry["options"])
    )
    stem = f"question-stem-{index}"
    back = f"question-answer-{index}"
    return (f'<fieldset class="study-card quiz-card" aria-labelledby="{stem}" data-answer="{entry["answer"]}">'
            f'<div class="quiz-flashcard"><div class="quiz-face quiz-front">'
            f'<h3 class="quiz-stem" id="{stem}" tabindex="-1">{esc(entry["question"])}</h3>'
            f'<div class="quiz-options">{options}</div>'
            f'<button class="quiz-flip" type="button" aria-controls="{back}" aria-expanded="false">'
            f'Flip for answer <span aria-hidden="true">↻</span></button></div>'
            f'<div class="quiz-face quiz-back" id="{back}" inert>'
            f'<p class="quiz-answer-label">Correct answer</p>'
            f'<h3 class="quiz-answer" tabindex="-1">{esc(entry["options"][entry["answer"]])}</h3>'
            f'<div class="quiz-explanation"><p>{esc(entry["explanation"])}</p>'
            f'<p class="anchor">{esc(entry["anchor"])}</p></div>'
            f'<button class="quiz-flip" type="button" aria-controls="{stem}">'
            f'<span aria-hidden="true">↶</span> Back to question</button></div></div>'
            f'<p class="quiz-feedback" role="status"></p></fieldset>')


def panel(key, content, intro=""):
    paragraph = f"<p>{esc(intro)}</p>" if intro else ""
    return (f'<section class="study-panel" id="{key}" aria-labelledby="{key}-heading" tabindex="-1">'
            f'<div class="panel-head"><h2 id="{key}-heading">{VIEWS[key]}</h2>{paragraph}</div>'
            f'{content}</section>')


def film_markup(directory):
    film = json.loads((directory / "film.json").read_text(encoding="utf-8-sig"))
    text_fields(film, "paper film", "title source")
    duration = film.get("duration")
    if type(duration) not in (int, float) or not 60 <= duration <= 120:
        raise ValueError("The paper film must run between 60 and 120 seconds")
    cues = items(film.get("cues"), "paper film captions")
    end = 0
    for cue in cues:
        text_fields(cue, "caption", "text")
        start, stop = cue.get("start"), cue.get("end")
        if (type(start) not in (int, float) or type(stop) not in (int, float)
                or not end <= start < stop <= duration):
            raise ValueError("Captions need nonoverlapping, increasing times within the paper film")
        end = stop
    seconds = round(duration)
    time = f"{seconds // 60}:{seconds % 60:02}"
    sequence = json.dumps(cues, ensure_ascii=False).replace("<", "\\u003c")
    transcript = "".join(f'<p>{esc(cue["text"])}</p>' for cue in cues)
    credit = film.get("credit")
    credit_line = f'<p class="anchor">{esc(clean_text(credit, "film credit"))}</p>' if credit else ""
    cover = directory / "cover.jpg"
    poster = cover if cover.is_file() else directory / "poster.jpg"
    return f'''<section id="paper-film" class="paper-film" aria-labelledby="paper-film-heading" tabindex="-1">
  <div class="paper-film-head"><div>
    <p class="paper-film-label">Paper summary</p>
    <h3 id="paper-film-heading">{esc(film["title"])}</h3>
  </div><span class="paper-film-time">{time}</span></div>
  <video id="paper-film-video" controls playsinline preload="none"
         poster="{asset_uri(poster)}"
         src="{asset_uri(directory / "summary.mp4")}"
         aria-label="{esc(film["title"])}"></video>
  <div class="paper-film-tools">
    <button type="button" data-film-captions aria-pressed="false" hidden>Captions</button>
    <details class="film-transcript"><summary>Read transcript</summary>
      <div class="film-transcript-text">{transcript}</div>
      <p class="anchor">{esc(film["source"])}</p>
      {credit_line}
    </details>
  </div>
  <script type="application/json" id="paper-film-cues">{sequence}</script>
</section>'''


def fragments(data, theme, pdfs, film=None):
    presenter = data.get("notes")
    notes = (f'<details class="presenter-note"><summary>Presenter cue</summary>'
             f'<p>{esc(presenter)}</p></details>') if presenter else ""
    watch = '<a class="film-action" href="#paper-film">Watch summary</a>' if film else ""
    hero = f'''<header class="hero" id="overview">
  <p class="eyebrow">{esc(data["kicker"])}</p>
  <h1>{esc(data["title"])}</h1>
  <p class="deck-subtitle">{esc(data["subtitle"])}</p>
  <p class="citation">{esc(data["citation"])}</p>
  <p class="lead">{esc(data["focus"])}</p>
  <div class="hero-actions">
    <a class="primary-action" href="#study-map">Start studying</a>
    {watch}
    <button type="button" data-present aria-pressed="false">Present</button>
    <button type="button" data-intro>Play signature intro</button>
  </div>{notes}
</header>'''
    nav_links = "".join(f'<a class="mode-link" href="#{key}">{title}</a>'
                        for key, title in VIEWS.items())
    nav = f'<nav class="mode-nav" aria-label="Study modes">{nav_links}</nav>'
    nodes = "".join(f'<div class="map-card"><h3>{esc(x["label"])}</h3>'
                    f'<p>{esc(x["detail"])}</p></div>' for x in data["map"])
    film_section = film_markup(film) if film else ""
    overview = (f'{film_section}<div class="map-grid">{nodes}</div>'
                f'<section class="preview"><h3>Preview questions</h3>'
                f'{list_markup(data["preview"])}</section>')
    panels = [panel("study-map", overview)]
    for key, mode in data["modes"].items():
        cards = "".join(section_card(item) for item in mode["sections"])
        if key == "vocab-treasure":
            cards += "".join(vocab_card(item) for item in data["vocabulary"])
        pdf = ""
        if key in pdfs:
            path = pdfs[key]
            pdf = (f'<p class="source-download"><button type="button" data-pdf="{key}" '
                   f'data-filename="{esc(path.name)}">Download {MODES[key]} PDF</button></p>'
                   f'<script type="application/octet-stream" id="pdf-{key}">'
                   f'{base64.b64encode(path.read_bytes()).decode("ascii")}</script>')
        panels.append(panel(key, f'<div class="section-grid">{cards}</div>{pdf}', mode["intro"]))
    quiz = "".join(quiz_card(index, item) for index, item in enumerate(data["quiz"], 1))
    panels.append(panel("quiz", f'<form id="retrieval"><div class="quiz-grid">{quiz}</div>'
                         '<div class="quiz-actions"><button type="submit">Check answers</button>'
                         '<button type="reset">Reset quiz</button><output aria-live="polite">'
                         '</output></div></form>', "Answer from memory, then flip each card to see the reasoning."))
    controls = '''<nav class="present-controls" aria-label="Presentation controls" hidden>
  <button type="button" data-step="-1" aria-label="Previous section">←</button>
  <span data-position aria-live="polite"></span>
  <button type="button" data-step="1" aria-label="Next section">→</button>
  <button type="button" data-present>Exit presentation</button>
</nav>'''
    intro = f'''<dialog id="signature-intro" aria-labelledby="intro-title">
  <div class="intro-bar"><h2 id="intro-title">Sajjad Irani</h2>
  <button type="button" data-close-intro autofocus>Close intro</button></div>
  <video controls playsinline preload="metadata" aria-label="Animated Sajjad Irani signature"
         data-src="{asset_uri(ROOT / "assets" / "signature-intro.mp4")}"></video>
</dialog>'''
    footer = ('<footer class="site-footer"><p>Easy Paper · Sajjad Irani</p>'
              f'<p>Mord’Sith · {esc(THEMES[theme])}</p></footer>')
    return {"HERO": hero, "NAV": nav, "PANELS": '<main id="study">' +
            "".join(panels) + '</main>' + controls, "INTRO": intro, "FOOTER": footer}


def render(data, theme, pdfs, film=None):
    directory = ROOT / "themes" / theme
    source = directory / "shell.html"
    shell = source.read_text(encoding="utf-8")
    data["modes"] = {key: data["modes"][key] for key in MODES}
    if film is None and "film" in data:
        film = ROOT / "films" / data["film"]
    values = fragments(data, theme, pdfs, film)
    for key in values:
        if shell.count("{{" + key + "}}") != 1:
            raise ValueError(f"{source.name} needs exactly one {key} slot")

    def substitute(match):
        key = match[1]
        if key in values:
            return values[key]
        if key.startswith("ASSET:"):
            relative = Path(key.removeprefix("ASSET:"))
            local = (directory / "assets").resolve()
            requested = (local / relative).resolve()
            if not requested.is_relative_to(local):
                raise ValueError(f"Theme asset escapes its directory: {relative}")
            return asset_uri(requested)
        raise ValueError(f"Unknown template slot: {key}")

    base_css = (ROOT / "runtime" / "base.css").read_text(encoding="utf-8")
    kit_css = (ROOT / "runtime" / "css-kit.css").read_text(encoding="utf-8")
    atmosphere_css = (ROOT / "runtime" / "atmosphere.css").read_text(encoding="utf-8")
    theme_css = TOKEN.sub(substitute, (directory / "theme.css").read_text(encoding="utf-8"))
    notices = [ROOT / "assets" / "Open-Props-LICENSE.txt"]
    notices.extend(sorted(p for p in (directory / "assets").glob("*.txt")
                          if "license" in p.name.lower() or "ofl" in p.name.lower()))
    license_text = "\n\n".join(p.read_text(encoding="utf-8-sig") for p in notices).replace("*/", "* /")
    css = "\n".join((base_css, theme_css, kit_css, atmosphere_css, f"/*\n{license_text}*/"))
    base_js = (ROOT / "runtime" / "app.js").read_text(encoding="utf-8")
    theme_js = TOKEN.sub(substitute, (directory / "theme.js").read_text(encoding="utf-8"))
    atmosphere_js = (ROOT / "runtime" / "atmosphere.js").read_text(encoding="utf-8")
    body = TOKEN.sub(substitute, shell)
    uid = hashlib.sha256((data["title"] + data["citation"] + theme).encode()).hexdigest()[:16]
    return f'''<!doctype html>
<html lang="en" data-theme="{theme}" data-deck="{uid}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; media-src data: blob:; base-uri 'none'; form-action 'none'">
  <meta name="color-scheme" content="light dark">
  <title>{esc(data["title"])} · {THEMES[theme]}</title>
  <style>{css}</style>
</head>
<body data-atmosphere="{theme}">
  <canvas class="paper-atmosphere" aria-hidden="true"></canvas>
  <a class="skip-link" href="#study-map">Skip to study material</a>
  {body}
  <script>{base_js}</script>
  <script>{theme_js}</script>
  <script>{atmosphere_js}</script>
</body>
</html>
'''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--theme", choices=THEMES, required=True)
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--film", type=Path,
                        help="Use an approved paper film folder with film.json, poster.jpg and summary.mp4.")
    parser.add_argument("--pdf", metavar="MODE=PATH", action="append", default=[],
                        help="Embed a reviewed output PDF. Repeat once for each mode.")
    args = parser.parse_args()
    try:
        if args.output.suffix.lower() != ".html":
            raise ValueError("--output must end in .html")
        data = json.loads(args.data.read_text(encoding="utf-8-sig"))
        validate(data)
        pdfs = {}
        for attachment in args.pdf:
            mode, separator, filename = attachment.partition("=")
            if not separator or mode not in MODES or mode in pdfs:
                raise ValueError(f"Invalid or duplicate --pdf value: {attachment}")
            path = Path(filename)
            with path.open("rb") as stream:
                if stream.read(5) != b"%PDF-":
                    raise ValueError(f"Expected PDF file: {path}")
            pdfs[mode] = path
        result = render(data, args.theme, pdfs, args.film)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(result, encoding="utf-8")
    except (ValueError, OSError) as error:
        parser.exit(2, f"Mord'Sith: {error}\n")
    print(args.output.resolve())


if __name__ == "__main__":
    main()
