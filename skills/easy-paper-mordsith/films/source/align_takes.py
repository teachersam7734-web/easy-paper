#!/usr/bin/env python3
"""Align three continuous ElevenLabs takes with the authored captions using Whisper."""
import argparse
import difflib
import json
import math
import re
import subprocess
import tempfile
import wave
from array import array
from pathlib import Path

from prepare import FPS, RATE, ROOT, stamp, wav_samples


def tokens(text):
    substitutions = {
        "36": "thirty six", "19": "nineteen", "33": "thirty three",
        "57": "fifty seven", "2024": "twenty twenty four",
    }
    return [word for token in re.findall(r"[a-z0-9]+", text.lower())
            for word in substitutions.get(token, token).split()]


def timings(transcript):
    words = []
    spans = []
    for segment in transcript["transcription"]:
        block = tokens(segment["text"])
        if not block:
            continue
        start, end = (segment["offsets"][key] / 1000 for key in ("from", "to"))
        step = (end - start) / len(block)
        for index, token in enumerate(block):
            words.append(token)
            spans.append((start + step * index, start + step * (index + 1)))
    return words, spans


def align_take(directory, story, audio, transcript, narrator):
    expected = []
    phrases = []
    for scene, info in enumerate(story["scenes"]):
        for cue, text in enumerate(info["speech"]):
            start = len(expected)
            expected.extend(tokens(text))
            phrases.append((scene, cue, start, len(expected), text))
    recognized, spans = timings(transcript)
    comparison = difflib.SequenceMatcher(a=expected, b=recognized, autojunk=False)
    if comparison.ratio() < .81:
        raise ValueError(f"Narration differs from the script ({comparison.ratio():.1%} agreement): {directory.name}")
    matched = {}
    for left, right, length in comparison.get_matching_blocks():
        matched.update((left + index, right + index) for index in range(length))

    ranges = []
    for scene, cue, start, end, text in phrases:
        indices = [matched[index] for index in range(start, end) if index in matched]
        if len(indices) < (end - start) * .58:
            raise ValueError(f"Narration cue could not be matched: {directory.name} {scene}-{cue} {text}")
        first = min(index for index in range(start, end) if index in matched)
        last = max(index for index in range(start, end) if index in matched)
        lo = max(0, indices[0] - (first - start))
        hi = min(len(spans) - 1, indices[-1] + (end - last - 1))
        ranges.append((scene, cue, spans[lo][0], spans[hi][1], text))

    # Keep the full take intact. Whisper timings drive edits and caption boundaries.
    lead = .68
    duration = len(audio) / RATE + lead
    frames = math.ceil((duration + 2.45) * FPS)
    if not 60 <= frames / FPS <= 120:
        raise ValueError(f"{directory.name}: film runs outside 1–2 minutes")
    scene_frames = [0]
    cues = []
    for i, (scene, cue, start, end, text) in enumerate(ranges):
        boundary = ranges[i + 1][2] if i + 1 < len(ranges) else duration - lead
        if scene and cue == 0:
            scene_frames.append(round((lead + start) * FPS))
        cues.append({
            "start": round(lead + start, 3),
            "end": round(lead + min(max(start + .15, end), boundary), 3),
            "text": text,
        })
    for scene, a, b in zip(story["scenes"], scene_frames, scene_frames[1:] + [frames], strict=True):
        scene.update(frame=a, frames=b - a)
    samples = array("h", [0]) * round(lead * RATE)
    samples.extend(audio)
    samples.extend(array("h", [0]) * (round(frames / FPS * RATE) - len(samples)))
    with wave.open(str(directory / "narration.wav"), "wb") as output:
        output.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
        output.writeframes(samples.tobytes())
    story.update(duration=frames / FPS, frames=frames, cues=cues, narrator=narrator)
    (directory / "timeline.json").write_text(json.dumps(story, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    captions = "\n\n".join(f'{stamp(cue["start"])} --> {stamp(cue["end"])}\n{cue["text"]}' for cue in cues)
    (directory / "captions.vtt").write_text("WEBVTT\n\n" + captions + "\n", encoding="utf-8")
    print(f"{directory.name}: {frames / FPS:.2f}s, {len(cues)} cues, Whisper script agreement {comparison.ratio():.1%}", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("work", type=Path, help="Film render work folder")
    parser.add_argument("takes", type=Path, help="Folder with agiel.mp3, confessor.mp3 and seeker.mp3")
    parser.add_argument("--whisper", type=Path, required=True, help="whisper-cli binary")
    parser.add_argument("--model", type=Path, required=True, help="English model used by whisper-cli")
    parser.add_argument("--narrator", default="Emilia / ElevenLabs", help="Narration credit")
    args = parser.parse_args()
    stories = json.loads((ROOT / "stories.json").read_text(encoding="utf-8"))
    for theme, story in stories.items():
        directory = args.work / theme
        directory.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="alignment-", dir=directory) as scratch:
            scratch = Path(scratch)
            raw = scratch / "narration.wav"
            probe = scratch / "whisper.wav"
            track = args.takes / f"{theme}.mp3"
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(track), "-af", "atempo=.88", "-ar", str(RATE),
                            "-ac", "1", "-c:a", "pcm_s16le", str(raw)], check=True)
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-ar", "16000",
                            "-ac", "1", "-c:a", "pcm_s16le", str(probe)], check=True)
            prefix = scratch / "transcript"
            result = subprocess.run([str(args.whisper), "-m", str(args.model), "-f", str(probe), "-l", "en",
                                     "-t", "4", "-ml", "1", "-sow", "-oj", "-of", str(prefix), "-np"],
                                    capture_output=True, text=True, encoding="utf-8")
            if result.returncode:
                raise RuntimeError(result.stderr)
            transcript = json.loads(prefix.with_suffix(".json").read_text(encoding="utf-8-sig"))
            (directory / "whisper-alignment.json").write_text(
                json.dumps(transcript, ensure_ascii=False) + "\n", encoding="utf-8")
            align_take(directory, story, wav_samples(raw), transcript, args.narrator)


if __name__ == "__main__":
    main()
