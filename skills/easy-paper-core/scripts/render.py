#!/usr/bin/env python3
"""Easy Paper renderer: content spec (JSON) -> themed HTML -> PDF (Playwright/Chromium).

Usage:
  python3 render.py spec.json [--out out.pdf] [--html-only] [--mode deep-dive|critique|review-guide]

The spec is described in skills/easy-paper-core/references/spec-schema.md.
The script also runs validate.py rules (structure + writing rules) and checks page
counts and fixed-sheet overflow after rendering. Exit code 2 = rendered with problems
that must be fixed (overflow, page budget, missing required blocks).
"""
import argparse, base64, html, json, os, re, sys, subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
CORE = HERE.parent
SKILLS = CORE.parent
ASSETS = CORE / "assets"

MODE_LABEL = {"deep-dive": "Deep Dive", "critique": "Critique Notes", "review-guide": "Review Guide", "vocab-treasure": "Vocab Treasure"}

# ---------------------------------------------------------------- helpers
def esc(s):
    return html.escape(str(s), quote=True)

def icon(name, cls="ic"):
    if not name:
        return ""
    p = ASSETS / "icons" / f"{name}.svg"
    if not p.exists():
        return ""
    svg = p.read_text(encoding="utf-8-sig")
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S)
    svg = svg.replace("<svg", f'<svg class="{cls}" aria-hidden="true"', 1)
    svg = re.sub(r'\s(width|height)="24"', "", svg)
    return svg

INLINE_RULES = [
    (re.compile(r"\*\*(.+?)\*\*"), r"<strong>\1</strong>"),
    (re.compile(r"==(.+?)=="), r'<mark>\1</mark>'),
    (re.compile(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])"), r"<em>\1</em>"),
    (re.compile(r"`(.+?)`"), r"<code>\1</code>"),
    (re.compile(r"\[((?:PDF )?pp?\.\s?[\d\-–, ]+(?:;\s?(?:PDF )?pp?\.\s?[\d\-–, ]+)*|§\s?[\w\.]+|Table \d+|Fig(?:ure)?\.? \d+|Note \d+(?:, p\. \d+)?)\]"), r'<span class="anchor">\1</span>'),
    (re.compile(r"\{\{(.+?)\}\}"), r'<span class="kw">\1</span>'),
]

def md(s):
    """Tiny inline markup: **bold** *italic* ==highlight== `code` [p. 4] anchors {{keyword}}."""
    if s is None:
        return ""
    out = esc(s)
    for rx, rep in INLINE_RULES:
        out = rx.sub(rep, out)
    return out.replace("\n", "<br>")

def tone_icon(tone):
    return {"tip": "lightbulb", "warn": "triangle-alert", "exam": "graduation-cap", "say": "mic",
            "outside": "compass", "gap": "puzzle", "parking": "bookmark", "nugget": "gem",
            "key": "key", "time": "timer", "link": "link"}.get(tone, "sparkles")

# ---------------------------------------------------------------- blocks
class R:
    def __init__(self, spec):
        self.spec = spec
        self.quiz_keys = []   # (title, items)
        self.counters = {"hq": 0}

    def blocks(self, blocks):
        return "\n".join(self.block(b) for b in (blocks or []))

    def block(self, b):
        t = b.get("type")
        fn = getattr(self, "b_" + str(t).replace("-", "_"), None)
        if not fn:
            return f'<div class="unknown">Unknown block type: {esc(t)}</div>'
        return fn(b)

    # ---- structure
    def b_section(self, b):
        kicker = f'<div class="kicker">{esc(b["kicker"])}</div>' if b.get("kicker") else ""
        lead = f'<p class="lead">{md(b["lead"])}</p>' if b.get("lead") else ""
        brk = " brk" if b.get("new_page") else ""
        return (f'<section class="sec{brk}" data-role="{esc(b.get("role",""))}"><header class="sec-h">{icon(b.get("icon"), "ic sec-ic")}'
                f'<div>{kicker}<h2>{md(b.get("title",""))}</h2></div></header>{lead}'
                f'{self.blocks(b.get("blocks"))}</section>')

    def b_h3(self, b):
        return f'<h3>{icon(b.get("icon"))}{md(b.get("text",""))}</h3>'

    def b_p(self, b):
        cls = " class=\"lead\"" if b.get("lead") else ""
        return f"<p{cls}>{md(b.get('text',''))}</p>"

    def b_bullets(self, b):
        style = b.get("style", "dot")
        tag = "ol" if style == "num" else "ul"
        items = "".join(f"<li>{md(i)}</li>" for i in b.get("items", []))
        title = f'<div class="mini-h">{md(b["title"])}</div>' if b.get("title") else ""
        return f'{title}<{tag} class="list {style}">{items}</{tag}>'

    def b_page_break(self, b):
        return '<div class="page-break"></div>'

    def b_spacer(self, b):
        return f'<div style="height:{float(b.get("mm",4))}mm"></div>'

    def b_columns(self, b):
        cols = b.get("cols", [])
        inner = "".join(f'<div class="col">{self.blocks(c)}</div>' for c in cols)
        return f'<div class="columns n{len(cols)}" style="--gap:{b.get("gap",5)}mm">{inner}</div>'

    def b_sheet(self, b):
        """A fixed A4 page (used by Review Guide). Overflow is detected after render."""
        title = ""
        if b.get("title"):
            title = (f'<div class="sheet-h"><span class="sheet-no">PAGE {esc(b.get("no",""))}</span>'
                     f'<h2>{md(b["title"])}</h2>'
                     f'<span class="sheet-sub">{md(b.get("sub",""))}</span></div>')
        foot = ""
        if self.spec.get("meta", {}).get("mode") == "vocab-treasure":
            foot = f'<div class="sheet-foot">Vocab Treasure - {esc(self.spec.get("meta", {}).get("byline", "Sajjad Irani"))}</div>'
        return f'<div class="sheet" data-sheet="{esc(b.get("no",""))}">{title}<div class="sheet-body">{self.blocks(b.get("blocks"))}</div>{foot}</div>'

    # ---- ADHD learning furniture
    def b_mission(self, b):
        chips = "".join(f'<span class="chip">{icon(c.get("icon"))}{md(c["text"])}</span>' for c in b.get("chips", []))
        return (f'<div class="mission">{icon("target","ic big")}<div><div class="kicker">MISSION</div>'
                f'<div class="mission-name">{md(b.get("name",""))}</div>'
                f'<div class="mission-goal">{md(b.get("goal",""))}</div>'
                f'<div class="chips">{chips}</div></div></div>')

    def b_preview(self, b):
        items = "".join(f'<li><span class="pq-n">P{i+1}</span>{md(q)}</li>' for i, q in enumerate(b.get("items", [])))
        note = b.get("note", "Guess an answer to each before you read on. Being wrong first makes the right answer stick.")
        return (f'<div class="preview">{icon("message-circle-question","ic big")}<div class="pv-body">'
                f'<div class="kicker">PREVIEW QUESTIONS</div><div class="pv-note">{md(note)}</div>'
                f'<ol class="pq">{items}</ol></div></div>')

    def b_nuggets(self, b):
        items = "".join(f'<li>{icon("gem","ic tiny")}<span>{md(i)}</span></li>' for i in b.get("items", []))
        title = b.get("title", "Gold nuggets")
        return (f'<div class="nuggets"><div class="ng-h">{icon("sparkles")}<span>{md(title)}</span></div>'
                f'<ul>{items}</ul></div>')

    def b_chunk(self, b):
        self.counters["hq"] += 1
        hid = b.get("id") or f"HQ{self.counters['hq']}"
        meta = []
        if b.get("pages"):
            meta.append(f'<span class="anchor">{esc(b["pages"])}</span>')
        if b.get("minutes"):
            meta.append(f'<span class="chip sm">{icon("timer")}{esc(b["minutes"])} min</span>')
        ans = f'<div class="hq-answer"><span class="ans-tag">SHORT ANSWER</span>{md(b["answer"])}</div>' if b.get("answer") else ""
        return (f'<section class="chunk"><div class="hq">{icon(b.get("icon") or "search","ic hq-ic")}'
                f'<div class="hq-text"><div class="hq-id">HUNT QUESTION {esc(hid)} {"".join(meta)}</div>'
                f'<h3 class="hq-q">{md(b.get("question",""))}</h3></div></div>{ans}'
                f'<div class="chunk-body">{self.blocks(b.get("blocks"))}</div></section>')

    def b_definition(self, b):
        verb = b.get("verbatim", True)
        q = f'<blockquote class="canon">&ldquo;{md(b["quote"])}&rdquo;<cite>{md(b.get("source",""))}</cite></blockquote>' if b.get("quote") else ""
        plain = f'<div class="plain"><span class="plain-tag">IN PLAIN WORDS</span>{md(b["plain"])}</div>' if b.get("plain") else ""
        tag = "VERBATIM DEFINITION" if (verb and b.get("quote")) else "DEFINITION"
        return (f'<div class="defn">{icon("book-open","ic")}<div class="defn-body"><div class="kicker">{tag}</div>'
                f'<div class="term">{md(b.get("term",""))}</div>{q}{plain}</div></div>')

    def b_callout(self, b):
        tone = b.get("tone", "tip")
        labels = {"tip": "TIP", "warn": "WATCH OUT", "exam": "EXAM MAGNET", "say": "SAY IT LIKE THIS",
                  "outside": "OUTSIDE THE PAPER", "gap": "GAP", "parking": "PARKING LOT", "nugget": "GOLD NUGGET",
                  "key": "KEY IDEA", "time": "TIME SAVER", "link": "CONNECTION"}
        title = b.get("title") or labels.get(tone, tone.upper())
        return (f'<div class="callout {tone}">{icon(b.get("icon") or tone_icon(tone))}<div>'
                f'<div class="co-t">{md(title)}</div><div class="co-x">{md(b.get("text",""))}</div>'
                f'{self.blocks(b.get("blocks"))}</div></div>')

    def b_quote(self, b):
        return f'<blockquote class="pull">{md(b.get("text",""))}<cite>{md(b.get("source",""))}</cite></blockquote>'

    def b_table(self, b):
        cols = b.get("columns", [])
        widths = b.get("widths")
        colgroup = ""
        if widths:
            colgroup = "<colgroup>" + "".join(f'<col style="width:{w}%">' for w in widths) + "</colgroup>"
        head = "".join(f"<th>{md(c)}</th>" for c in cols)
        rows = ""
        hl = set(b.get("highlight_rows", []))
        for i, r in enumerate(b.get("rows", [])):
            cls = ' class="hl"' if i in hl else ""
            rows += f"<tr{cls}>" + "".join(f"<td>{md(c)}</td>" for c in r) + "</tr>"
        cap = f'<div class="tbl-cap">{icon(b.get("icon") or "layers")}{md(b["title"])}</div>' if b.get("title") else ""
        note = f'<div class="tbl-note">{md(b["note"])}</div>' if b.get("note") else ""
        compact = " compact" if b.get("compact") else ""
        return f'<div class="tbl{compact}">{cap}<table>{colgroup}<thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>{note}</div>'

    def b_pipeline(self, b):
        steps = b.get("steps", [])
        direction = b.get("direction", "row")
        parts = []
        for i, s in enumerate(steps):
            parts.append(f'<div class="step">{icon(s.get("icon"),"ic st-ic")}<div class="st-n">{i+1}</div>'
                         f'<div class="st-l">{md(s.get("label",""))}</div><div class="st-t">{md(s.get("text",""))}</div></div>')
            if i < len(steps) - 1:
                parts.append('<div class="arrow"></div>')
        title = f'<div class="mini-h">{icon(b.get("icon") or "route")}{md(b["title"])}</div>' if b.get("title") else ""
        cap = f'<div class="fig-cap">{md(b["caption"])}</div>' if b.get("caption") else ""
        return f'<div class="pipeline-wrap">{title}<div class="pipeline {direction} n{len(steps)}">{"".join(parts)}</div>{cap}</div>'

    def b_cycle(self, b):
        """Circular diagram (e.g., the logic of a framework). Up to 6 nodes."""
        nodes = b.get("nodes", [])
        n = max(len(nodes), 1)
        import math
        W, H, R_, r = 520, 300, 115, 48
        cx, cy = W / 2, H / 2
        pts = [(cx + R_ * 1.55 * math.cos(-math.pi/2 + 2*math.pi*i/n), cy + R_ * math.sin(-math.pi/2 + 2*math.pi*i/n)) for i in range(n)]
        svg = [f'<svg viewBox="0 0 {W} {H}" class="cycle-svg"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>']
        for i in range(n):
            x1, y1 = pts[i]; x2, y2 = pts[(i+1) % n]
            mx, my = (x1+x2)/2, (y1+y2)/2
            # pull control point toward the outside for a curve
            ox, oy = (mx-cx)*0.25, (my-cy)*0.25
            svg.append(f'<path d="M{x1:.0f},{y1:.0f} Q{mx+ox:.0f},{my+oy:.0f} {x2:.0f},{y2:.0f}" class="cyc-edge" marker-end="url(#ah)"/>')
        if b.get("center"):
            svg.append(f'<circle cx="{cx}" cy="{cy}" r="42" class="cyc-center"/>')
        svg.append("</svg>")
        labels = "".join(
            f'<div class="cyc-node" style="left:{x/W*100:.1f}%;top:{y/H*100:.1f}%"><b>{md(nd.get("label",""))}</b><span>{md(nd.get("text",""))}</span></div>'
            for (x, y), nd in zip(pts, nodes))
        center = f'<div class="cyc-c" style="left:50%;top:50%">{md(b.get("center",""))}</div>' if b.get("center") else ""
        title = f'<div class="mini-h">{icon("network")}{md(b["title"])}</div>' if b.get("title") else ""
        return f'<div class="cycle-wrap">{title}<div class="cycle">{"".join(svg)}{labels}{center}</div></div>'

    def b_mindmap(self, b):
        branches = b.get("branches", [])
        palette = ["#0AA5C2", "#E0890B", "#D6336C", "#12A36B", "#6A5AE0", "#1F7AE0", "#B8860B", "#C2410C"]
        half = (len(branches) + 1) // 2
        left, right = branches[:half], branches[half:]
        def card(br, i, side):
            color = br.get("color") or palette[i % len(palette)]
            leaves = "".join(f"<li>{md(l)}</li>" for l in br.get("leaves", []))
            return (f'<div class="mm-card {side}" style="--c:{color}" data-mm="{i}">'
                    f'<div class="mm-t">{icon(br.get("icon"),"ic")}<span class="mm-no">{i+1}</span>{md(br.get("label",""))}</div>'
                    f'<ul>{leaves}</ul></div>')
        L = "".join(card(br, i, "l") for i, br in enumerate(left))
        Rr = "".join(card(br, i + half, "r") for i, br in enumerate(right))
        center = (f'<div class="mm-center"><div class="kicker">CENTRAL IDEA</div>'
                  f'<div class="mm-c-t">{md(b.get("center",""))}</div>'
                  f'<div class="mm-c-s">{md(b.get("sub",""))}</div></div>')
        h = b.get("height_mm")
        style = f' style="min-height:{h}mm"' if h else ""
        return (f'<div class="mindmap"{style}><svg class="mm-svg"></svg><div class="mm-col">{L}</div>'
                f'<div class="mm-mid">{center}</div><div class="mm-col">{Rr}</div></div>')

    def b_cards(self, b):
        items = ""
        for it in b.get("items", []):
            tone = it.get("tone", "")
            badge = f'<span class="badge">{md(it["badge"])}</span>' if it.get("badge") else ""
            items += (f'<div class="card {tone}"><div class="card-t">{icon(it.get("icon"))}{md(it.get("title",""))}{badge}</div>'
                      f'<div class="card-x">{md(it.get("text",""))}</div>'
                      f'{self.blocks(it.get("blocks"))}</div>')
        return f'<div class="cards n{b.get("cols",2)}">{items}</div>'

    def b_compare(self, b):
        """Side-by-side contrast with shared row labels."""
        sides = b.get("sides", [])
        rows = b.get("rows", [])
        head = '<div class="cmp-h"></div>' + "".join(f'<div class="cmp-h side" style="--c:{s.get("color","var(--accent)")}">{icon(s.get("icon"))}{md(s.get("label",""))}</div>' for s in sides)
        body = ""
        for r in rows:
            body += f'<div class="cmp-l">{md(r.get("label",""))}</div>' + "".join(f'<div class="cmp-c">{md(v)}</div>' for v in r.get("values", []))
        title = f'<div class="mini-h">{icon("git-compare")}{md(b["title"])}</div>' if b.get("title") else ""
        return f'{title}<div class="compare" style="grid-template-columns: 26mm repeat({len(sides)}, 1fr)">{head}{body}</div>'

    def b_timeline(self, b):
        items = "".join(f'<div class="tl-i"><div class="tl-w">{md(i.get("when",""))}</div><div class="tl-dot"></div>'
                        f'<div class="tl-x"><b>{md(i.get("who",""))}</b> {md(i.get("what",""))}</div></div>' for i in b.get("items", []))
        title = f'<div class="mini-h">{icon("clock")}{md(b["title"])}</div>' if b.get("title") else ""
        return f'{title}<div class="timeline">{items}</div>'

    def b_stats(self, b):
        items = "".join(f'<div class="stat"><div class="stat-v">{md(i.get("value",""))}</div><div class="stat-l">{md(i.get("label",""))}</div></div>' for i in b.get("items", []))
        return f'<div class="stats n{len(b.get("items", []))}">{items}</div>'

    def b_bars(self, b):
        items = b.get("items", [])
        mx = max([float(i.get("value", 0)) for i in items] + [1])
        rows = "".join(
            f'<div class="bar-r"><div class="bar-l">{md(i.get("label",""))}</div><div class="bar-t"><div class="bar-f" style="width:{float(i.get("value",0))/mx*100:.1f}%"></div></div><div class="bar-v">{md(i.get("display", i.get("value","")))}</div></div>'
            for i in items)
        title = f'<div class="mini-h">{icon("chart-column")}{md(b["title"])}</div>' if b.get("title") else ""
        note = f'<div class="tbl-note">{md(b["note"])}</div>' if b.get("note") else ""
        return f'<div class="bars">{title}{rows}{note}</div>'

    def b_figure(self, b):
        if b.get("svg"):
            body = b["svg"]
        elif b.get("src"):
            p = Path(b["src"])
            if p.exists():
                mime = "image/svg+xml" if p.suffix == ".svg" else f"image/{p.suffix.lstrip('.').replace('jpg','jpeg')}"
                body = f'<img src="data:{mime};base64,{base64.b64encode(p.read_bytes()).decode()}">'
            else:
                body = f'<div class="unknown">Missing image {esc(b["src"])}</div>'
        else:
            body = ""
        cap = f'<div class="fig-cap">{md(b["caption"])}</div>' if b.get("caption") else ""
        return f'<figure class="fig" style="max-width:{b.get("width","100%")}">{body}{cap}</figure>'

    # ---- critique furniture
    def b_verdict(self, b):
        scores = ""
        for s in b.get("scores", []):
            v = int(s.get("value", 0))
            dots = "".join(f'<i class="{"on" if k < v else ""}"></i>' for k in range(5))
            scores += f'<div class="sc"><span>{md(s.get("label",""))}</span><span class="dots">{dots}</span></div>'
        return (f'<div class="verdict">{icon("scale","ic big")}<div class="vd-body"><div class="kicker">VERDICT IN ONE BREATH</div>'
                f'<div class="vd-line">{md(b.get("line",""))}</div>'
                f'<div class="vd-scores">{scores}</div></div></div>')

    def b_critique_card(self, b):
        kind = b.get("kind", "strength")
        ic = {"strength": "thumbs-up", "weakness": "thumbs-down"}.get(kind, "scale")
        label = {"strength": "STRENGTH", "weakness": "WEAKNESS"}.get(kind, kind.upper())
        num = esc(b.get("n", ""))
        rows = []
        for key, lab in [("claim", "The point"), ("anchor", "Proof in the paper"), ("why", "Why it matters"), ("fix", "What would fix it")]:
            if b.get(key):
                rows.append(f'<div class="cc-r"><span class="cc-k">{lab}</span><span class="cc-v">{md(b[key])}</span></div>')
        say = f'<div class="say">{icon("mic","ic tiny")}<span>{md(b["say"])}</span></div>' if b.get("say") else ""
        sev = f'<span class="sev">{esc(b["severity"])}</span>' if b.get("severity") else ""
        return (f'<div class="ccard {kind}"><div class="cc-h">{icon(ic)}<span class="cc-lab">{label} {num}</span>{sev}'
                f'<span class="cc-title">{md(b.get("title",""))}</span></div>{"".join(rows)}{say}</div>')

    def b_qa(self, b):
        items = "".join(f'<div class="qa-i"><div class="qa-q">{icon("message-circle-question","ic tiny")}{md(i.get("q",""))}</div>'
                        f'<div class="qa-a">{md(i.get("a",""))}</div></div>' for i in b.get("items", []))
        title = f'<div class="mini-h">{icon(b.get("icon") or "graduation-cap")}{md(b.get("title","If they ask you..."))}</div>'
        return f'<div class="qa">{title}{items}</div>'

    def b_script(self, b):
        lines = "".join(f'<li>{md(l)}</li>' for l in b.get("lines", []))
        secs = f'<span class="chip sm">{icon("timer")}{esc(b["seconds"])} sec</span>' if b.get("seconds") else ""
        return (f'<div class="script"><div class="mini-h">{icon("mic")}{md(b.get("title","Say it out loud"))} {secs}</div>'
                f'<ol>{lines}</ol></div>')

    def b_glossary(self, b):
        items = "".join(f'<div class="gl-i"><div class="gl-t">{md(i.get("term",""))}</div><div class="gl-p">{md(i.get("plain",""))}</div></div>' for i in b.get("items", []))
        title = f'<div class="mini-h">{icon("key")}{md(b.get("title","Glossary"))}</div>'
        return f'<div class="glossary">{title}<div class="gl-grid">{items}</div></div>'

    def b_studyplan(self, b):
        items = "".join(f'<div class="sp-i"><span class="sp-m">{esc(i.get("min",""))}′</span><span class="sp-t">{md(i.get("task",""))}</span></div>' for i in b.get("items", []))
        total = sum(int(re.sub(r"\D", "", str(i.get("min", "0"))) or 0) for i in b.get("items", []))
        title = f'<div class="mini-h">{icon("timer")}{md(b.get("title","Game plan"))} <span class="chip sm">{total} min</span></div>'
        return f'<div class="studyplan">{title}{items}</div>'

    def b_scoreboard(self, b):
        items = "".join(f'<div class="sb-i"><span>{md(i)}</span><span class="sb-box"></span></div>' for i in b.get("items", []))
        return f'<div class="scoreboard">{icon("trophy")}<span class="kicker">SCOREBOARD</span>{items}</div>'

    def b_quiz(self, b):
        title = b.get("title", "Wrap-up quiz")
        qs = ""
        for i, q in enumerate(b.get("items", []), 1):
            opts = ""
            if q.get("options"):
                opts = '<ol class="opts" type="A">' + "".join(f"<li>{md(o)}</li>" for o in q["options"]) + "</ol>"
            kind = {"mcq": "Choose one", "tf": "True or false", "short": "Answer in a sentence", "apply": "Apply it", "fill": "Fill the gap"}.get(q.get("type", "mcq"), "")
            qs += f'<div class="qz-i"><div class="qz-q"><span class="qz-n">Q{i}</span>{md(q.get("q",""))} <span class="qz-k">{kind}</span></div>{opts}</div>'
        self.quiz_keys.append((title, b.get("items", [])))
        return (f'<div class="quiz"><div class="qz-h">{icon("list-checks")}<span>{md(title)}</span>'
                f'<span class="qz-hint">{md(b.get("hint","Answer from memory first. Key on the last page."))}</span></div>{qs}</div>')

    def b_answer_key(self, b):
        out = ""
        for title, items in self.quiz_keys:
            rows = ""
            for i, q in enumerate(items, 1):
                rows += f'<div class="ak-i"><span class="qz-n">Q{i}</span><b>{md(q.get("answer",""))}</b> {md(q.get("why",""))}</div>'
            out += f'<div class="mini-h">{icon("circle-check")}{md(b.get("title","Answer key"))}: {md(title)}</div>{rows}'
        return f'<div class="answer-key">{out}</div>'

    def b_sources(self, b):
        items = "".join(f"<li>{md(i)}</li>" for i in b.get("items", []))
        return f'<div class="sources"><div class="mini-h">{icon("bookmark")}{md(b.get("title","Further reading"))}</div><ol>{items}</ol></div>'

    # ---- vocab treasure furniture
    def b_vt_strip(self, b):
        stats = "".join(f'<span class="vt-stat"><b>{md(x.get("value",""))}</b>{md(x.get("label",""))}</span>' for x in b.get("stats", []))
        return (f'<div class="vt-strip"><span class="vt-reel">{md(b.get("reel","REEL 01"))}</span>'
                f'<span class="vt-src">{md(b.get("source",""))}</span><span class="vt-stats">{stats}</span></div>')

    def b_vocab(self, b):
        out = []
        for i, it in enumerate(b.get("items", []), 1):
            n = it.get("n", i)
            alts = "".join(f'<span class="vt-alt">{md(a)}</span>' for a in it.get("alternatives", []))
            ctx = it.get("context", "")
            term = it.get("term", "")
            hl = esc(ctx)
            for form in sorted(set([term] + it.get("forms", [])), key=len, reverse=True):
                if form:
                    hl = re.sub(re.escape(esc(form)), lambda m: f'<mark class="vt-hit">{m.group(0)}</mark>', hl, count=1, flags=re.I)
            page = f'<span class="vt-page">{esc(it.get("page",""))}</span>' if it.get("page") else ""
            feat = " feature" if it.get("feature") else ""
            note = f'<div class="vt-note">{md(it["note"])}</div>' if it.get("note") else ""
            out.append(
                f'<article class="vt-card{feat}"><div class="vt-top"><span class="vt-n">{int(n):02d}</span>'
                f'<span class="vt-type">{md(it.get("type",""))}</span><span class="vt-lvl">{md(it.get("level",""))}</span></div>'
                f'<h3 class="vt-term">{md(term)}</h3>'
                f'<div class="vt-pattern">{md(it.get("pattern",""))}</div>'
                f'<div class="vt-mean">{md(it.get("meaning",""))}</div>'
                f'<div class="vt-ctx"><span class="vt-lab">In context</span><q>{hl}</q>{page}</div>'
                f'<div class="vt-alts"><span class="vt-lab2">Alternatives</span>{alts}</div>'
                f'<div class="vt-use"><span class="vt-lab2">Use it</span>{md(it.get("example",""))}</div>{note}</article>')
        return f'<div class="vt-grid">{"".join(out)}</div>'

# ---------------------------------------------------------------- page assembly
def font_faces(theme_fonts):
    faces = []
    for fam, fname in theme_fonts.items():
        p = ASSETS / "fonts" / fname
        if p.exists():
            b64 = base64.b64encode(p.read_bytes()).decode()
            style = "italic" if "italic" in fname else "normal"
            faces.append(f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{b64}) format('woff2');font-weight:100 900;font-style:{style};font-display:block}}")
    return "\n".join(faces)

def find_theme(mode):
    p = SKILLS / mode / "assets" / "theme.css"
    if p.exists():
        return p
    alt = CORE / "assets" / "themes" / f"{mode}.css"   # standalone-skill fallback
    return alt if alt.exists() else None

FONT_SETS = {
    "deep-dive":    {"EP Display": "sora.woff2", "EP Body": "inter.woff2", "EP Mono": "jetbrains-mono.woff2", "EP Serif": "eb-garamond-italic.woff2"},
    "critique":     {"EP Display": "space-grotesk.woff2", "EP Body": "inter.woff2", "EP Mono": "jetbrains-mono.woff2", "EP Serif": "eb-garamond-italic.woff2"},
    "review-guide": {"EP Display": "outfit.woff2", "EP Body": "inter.woff2", "EP Mono": "jetbrains-mono.woff2", "EP Serif": "eb-garamond-italic.woff2"},
    "vocab-treasure": {"EP Display": "syncopate-bold.woff2", "EP Body": "exo2.woff2", "EP Mono": "michroma.woff2",
                       "EP Serif": "eb-garamond-italic.woff2", "EP Headword": "eb-garamond.woff2", "EP Script": "allura.woff2"},
}

def cover(spec, mode):
    m = spec.get("meta", {})
    paper = m.get("paper", {})
    chips = "".join(f'<span class="chip">{icon(c.get("icon"))}{md(c["text"])}</span>' for c in m.get("cover_chips", []))
    style = m.get("cover", "full")
    return (f'<header class="cover {style}"><div class="cv-band"><span class="cv-brand">EASY PAPER</span>'
            f'<span class="cv-mode">{icon({"deep-dive":"microscope","critique":"scale","review-guide":"zap","vocab-treasure":"gem"}[mode])}{MODE_LABEL[mode].upper()}</span></div>'
            f'<div class="cv-main"><div class="cv-kicker">{md(m.get("kicker",""))}</div>'
            f'<h1>{md(paper.get("title", m.get("title","")))}</h1>'
            f'<div class="cv-auth">{md(paper.get("authors",""))} <span class="cv-year">({esc(paper.get("year",""))})</span></div>'
            f'<div class="cv-ref">{md(paper.get("reference",""))}</div>'
            f'<div class="chips">{chips}</div></div>'
            f'<div class="cv-by">By: {esc(m.get("byline","Sajjad Irani"))}</div></header>')

def build_html(spec, mode):
    r = R(spec)
    body = r.blocks(spec.get("blocks", []))
    # auto-append answer key if quizzes exist and no explicit key block
    if r.quiz_keys and '"answer_key"' not in json.dumps(spec.get("blocks", [])):
        key = '<section class="sec key-sec">' + r.b_answer_key({}) + "</section>"
        if '<div class="sheet-body">' in body:   # sheet documents: key goes inside the last sheet
            i = body.rindex('<div class="sheet-body">')
            j = body.index('</div><div class="sheet-foot">', i) if '<div class="sheet-foot">' in body[i:] else body.rindex("</div></div>")
            body = body[:j] + key + body[j:]
        else:
            body += key
    theme = find_theme(mode)
    css = (ASSETS / "css" / "base.css").read_text(encoding="utf-8-sig") + "\n" + (theme.read_text(encoding="utf-8-sig") if theme else "")
    js = (ASSETS / "js" / "layout.js").read_text(encoding="utf-8-sig")
    cv = cover(spec, mode) if spec.get("meta", {}).get("cover", "full") != "none" else ""
    if cv and '<div class="sheet"' in body:
        # fixed-sheet documents: the cover lives inside the first sheet so it shares its height
        i = body.index('<div class="sheet"')
        j = body.index(">", i) + 1
        body = body[:j] + cv + body[j:]
        cv = ""
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>{esc(spec.get('meta',{}).get('paper',{}).get('title','Easy Paper'))}</title>
<style>{font_faces(FONT_SETS[mode])}\n{css}</style></head>
<body class="mode-{mode}"><main class="doc">{cv}{body}</main><script>{js}</script></body></html>"""

def footer_template(spec, mode):
    m = spec.get("meta", {})
    if mode == "vocab-treasure":
        by = esc(m.get("byline", "Sajjad Irani"))
        return (f'<div style="width:100%;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:7.5px;'
                f'letter-spacing:.32em;color:#C9A24A;text-transform:uppercase">Vocab Treasure - {by}</div>')
    short = esc(m.get("short_title") or m.get("paper", {}).get("title", "")[:60])
    by = esc(m.get("byline", "Sajjad Irani"))
    return (f'<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:7px;color:#8a8f9c;padding:0 14mm;'
            f'display:flex;justify-content:space-between;letter-spacing:.04em">'
            f'<span>EASY PAPER · {MODE_LABEL[mode].upper()} · {short}</span>'
            f'<span>By: {by} · <span class="pageNumber"></span>/<span class="totalPages"></span></span></div>')

FULLBLEED = {"vocab-treasure"}  # full-bleed fixed sheets that draw their own footer
PAGE_BUDGET = {"deep-dive": (5, 10), "critique": (3, 5), "review-guide": (4, 4), "vocab-treasure": (1, 2)}

def render(spec_path, out=None, html_only=False, mode=None):
    spec = json.loads(Path(spec_path).read_text(encoding="utf-8-sig"))
    mode = mode or spec.get("meta", {}).get("mode")
    if mode not in MODE_LABEL:
        sys.exit(f"mode must be one of {list(MODE_LABEL)}")
    problems = []
    # structural + writing validation
    sys.path.insert(0, str(HERE))
    import validate
    problems += validate.validate(spec, mode)
    html_doc = build_html(spec, mode)
    out = Path(out or Path(spec_path).with_suffix(".pdf"))
    html_path = out.with_suffix(".html")
    html_path.write_text(html_doc, encoding="utf-8")
    if html_only:
        print(f"HTML: {html_path}")
        return problems
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 794, "height": 1123})
        pg.emulate_media(media="print")
        pg.goto(html_path.resolve().as_uri())
        pg.wait_for_function("window.__epLayoutDone === true", timeout=15000)
        overflow = pg.evaluate("window.__epOverflow || []")
        for o in overflow:
            if not spec.get("meta", {}).get("skeleton"):
                problems.append(f"OVERFLOW: {o}")
        if mode in FULLBLEED:
            pg.pdf(path=str(out), format="A4", print_background=True, display_header_footer=False,
                   margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"})
        else:
            pg.pdf(path=str(out), format="A4", print_background=True, display_header_footer=True,
                   header_template="<div></div>", footer_template=footer_template(spec, mode),
                   margin={"top": "13mm", "bottom": "13mm", "left": "0mm", "right": "0mm"})
        b.close()
    from pypdf import PdfReader
    n = len(PdfReader(str(out)).pages)
    lo, hi = PAGE_BUDGET[mode]
    ov = spec.get("meta", {}).get("page_budget")
    if ov:  # an override can only tighten the mode's budget, never widen it
        lo, hi = max(lo, int(ov[0])), min(hi, int(ov[1]))
    src_pages = spec.get("meta", {}).get("paper", {}).get("pages")
    if mode == "deep-dive" and src_pages:
        half = int(src_pages) // 2
        hi = min(hi, half)
        if half < 5:  # short papers: half the paper wins over the 5-page minimum
            lo = max(2, half)
    if mode == "vocab-treasure" and src_pages:  # one page of treasure per ~10 pages of article
        lo = hi = min(2, max(1, round(int(src_pages) / 10)))
    if not (lo <= n <= hi) and not spec.get("meta", {}).get("skeleton"):
        problems.append(f"PAGE BUDGET: {n} pages, target {lo}-{hi}")
    import layout_check
    if not spec.get("meta", {}).get("skeleton"):   # skeletons are placeholders, not real pages
        for d in layout_check.check(str(out), mode):
            problems.append(f"LAYOUT: {d}")
    print(f"PDF: {out}  ({n} pages)")
    return problems

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--out")
    ap.add_argument("--mode")
    ap.add_argument("--html-only", action="store_true")
    a = ap.parse_args()
    probs = render(a.spec, a.out, a.html_only, a.mode)
    if probs:
        print("\nPROBLEMS TO FIX:")
        for p in probs:
            print(" -", p)
        sys.exit(2)
    print("OK: no problems found")
