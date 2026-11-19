#!/usr/bin/env python3
"""Package the full plugin and its six standalone skills."""

import argparse
import re
import tempfile
import zipfile
from contextlib import contextmanager
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
MODES = ("deep-dive", "critique", "review-guide", "vocab-treasure", "adhd-student")
MORDSITH = "easy-paper-mordsith"
EXCLUDED = {"dist", "__pycache__", "examples-draft", ".git", ".venv", ".DS_Store"}


def files(root):
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root)
        if not path.is_file() or path.suffix == ".pyc" or EXCLUDED.intersection(relative.parts):
            continue
        yield path, relative


@contextmanager
def archive(destination):
    with tempfile.NamedTemporaryFile(dir=destination.parent, suffix=".tmp", delete=False) as handle:
        temp = Path(handle.name)
    try:
        with zipfile.ZipFile(temp, "w", zipfile.ZIP_DEFLATED) as package:
            yield package
        temp.replace(destination)
    finally:
        temp.unlink(missing_ok=True)


def rewrite(text, mode):
    text = text.replace("${CLAUDE_PLUGIN_ROOT}/skills/easy-paper-core", "easy-paper-core")
    text = text.replace("${CLAUDE_PLUGIN_ROOT}/", "")
    text = text.replace("../easy-paper-core/", "easy-paper-core/").replace(
        "`../easy-paper-core`", "`easy-paper-core`")
    text = re.sub(r"\bCORE\b(?=/)", "easy-paper-core", text)
    text = text.replace("skills/easy-paper-core/", "easy-paper-core/")
    text = text.replace(f"skills/{mode}/", "")
    text = re.sub(
        r"\b(?:skills/)?(deep-dive|critique|review-guide|vocab-treasure)/references/",
        lambda match: "references/" if match[1] == mode else f"(the {match[1]} skill) references/",
        text,
    )
    return text.replace("skills/adhd-student/", "adhd-student/").replace(
        "../adhd-student/", "adhd-student/")


def add_skill_files(package, source, root, mode=None, owner=False):
    for file, relative in files(source):
        target = (root / relative).as_posix()
        if mode and file.suffix == ".md" and relative.parts[0] != "examples":
            content = rewrite(file.read_text(encoding="utf-8"), mode)
            if owner and relative.as_posix() == "SKILL.md":
                content = content.replace(f"name: {mode}\n", f"name: easy-paper-{mode}\n", 1)
                editions = "the Easy Paper core and persona cards"
                if mode != "adhd-student":
                    editions += ", plus the ADHD Student companion"
                note = (f"\n> **Standalone edition.** Includes {editions}. In a chat without "
                        "subagents, use the relay protocol in "
                        "`easy-paper-core/references/persona-system.md`.\n")
                content = content.replace("---\n\n# ", "---\n" + note + "\n# ", 1)
            package.writestr(target, content)
        else:
            package.write(file, target)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT / "dist")
    out = parser.parse_args().out.resolve()
    if out == ROOT or (out.is_relative_to(ROOT) and out != ROOT / "dist"):
        parser.error("Use the default dist/ directory or an output directory outside the plugin source.")
    out.mkdir(parents=True, exist_ok=True)

    with archive(out / "easy-paper.plugin") as package:
        for file, relative in files(ROOT):
            package.write(file, (Path("easy-paper") / relative).as_posix())

    for mode in MODES:
        name = f"easy-paper-{mode}"
        root = Path(name)
        with archive(out / f"{name}.skill") as package:
            add_skill_files(package, SKILLS / mode, root, mode, owner=True)
            add_skill_files(package, SKILLS / "easy-paper-core", root / "easy-paper-core", mode)
            if mode != "adhd-student":
                add_skill_files(package, SKILLS / "adhd-student", root / "adhd-student", mode)
            add_skill_files(package, ROOT / "agents", root / "agents", mode)
            theme = SKILLS / mode / "assets" / "theme.css"
            if theme.is_file():
                destination = root / "easy-paper-core" / "assets" / "themes" / f"{mode}.css"
                package.write(theme, destination.as_posix())

    with archive(out / f"{MORDSITH}.skill") as package:
        add_skill_files(package, SKILLS / MORDSITH, Path(MORDSITH))
    print(f"Packaged Easy Paper and six standalone skills in {out}.")


if __name__ == "__main__":
    main()
