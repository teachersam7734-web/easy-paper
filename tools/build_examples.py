#!/usr/bin/env python3
"""Build all bundled Mord'Sith templates and, optionally, the handout editions."""

import argparse
import json
from pathlib import Path
import sys
from tempfile import NamedTemporaryFile


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "easy-paper-mordsith"
sys.path.insert(0, str(SKILL / "scripts"))
from build import MODES, THEMES, render, validate


PAPERS = {"agiel": "ai-plagiarism", "confessor": "mixed-methods", "seeker": "ai-publishing"}


def prepare(name, handouts):
    data = json.loads((SKILL / "examples" / f"{name}.json").read_text(encoding="utf-8"))
    validate(data)
    filename = THEMES[name] + ".html"
    yield SKILL / "templates" / filename, render(data, name, {})
    if not handouts:
        return
    folder = handouts / PAPERS[name]
    pdfs = {}
    for mode, label in MODES.items():
        files = list(folder.glob(f"* - {label}.pdf"))
        if len(files) != 1:
            raise ValueError(f"Expected one approved {label} PDF in {folder}")
        with files[0].open("rb") as stream:
            if stream.read(5) != b"%PDF-":
                raise ValueError(f"Invalid PDF {files[0]}")
        pdfs[mode] = files[0]
    yield folder / filename, render(data, name, pdfs)


def publish(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile(dir=path.parent, suffix=".tmp", delete=False) as stream:
        temporary = Path(stream.name)
        stream.write(content.encode("utf-8"))
    try:
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    print(path.resolve())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--handouts", type=Path, help="Workspace Outputs directory for the PDF editions")
    parser.add_argument("--theme", choices=THEMES, action="append", help="Build only this theme")
    args = parser.parse_args()
    try:
        outputs = [item for theme in args.theme or THEMES for item in prepare(theme, args.handouts)]
        for path, content in outputs:
            publish(path, content)
    except (ValueError, OSError) as error:
        parser.exit(2, f"{error}\n")


if __name__ == "__main__":
    main()
