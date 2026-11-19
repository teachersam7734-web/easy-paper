#!/usr/bin/env python3
"""Build a scene timeline, an exact narration track and captions from the authored script."""

import argparse
import asyncio
import json
import math
import shutil
import subprocess
import wave
from array import array
from pathlib import Path


ROOT = Path(__file__).resolve().parent
RATE = 44100
FPS = 24
EDGE_RATES = {"agiel": "+0%", "confessor": "-3%", "seeker": "+2%"}


async def narrate_edge(work, stories, voice):
    """Synthesize each caption cue through Edge TTS and prepare PCM for the timeline."""
    import edge_tts

    slots = asyncio.Semaphore(4)

    async def cue(directory, theme, line, name):
        track = directory / f"{name}.mp3"
        speech = edge_tts.Communicate(line, voice, rate=EDGE_RATES[theme])
        async with slots:
            await asyncio.wait_for(speech.save(str(track)), timeout=45)
            await asyncio.to_thread(subprocess.run, [
                "ffmpeg", "-y", "-v", "error", "-i", str(track), "-ar", str(RATE),
                "-ac", "1", "-c:a", "pcm_s16le", str(directory / f"{name}.wav"),
            ], check=True)

    jobs = []
    for theme, story in stories.items():
        directory = work / theme
        directory.mkdir(parents=True, exist_ok=True)
        for scene, section in enumerate(story["scenes"]):
            for index, line in enumerate(section["speech"]):
                jobs.append(cue(directory, theme, line, f"{scene}-{index}"))
    await asyncio.gather(*jobs)
    print(f"Edge TTS voice: {voice}")


def wav_samples(path):
    with wave.open(str(path), "rb") as voice:
        if (voice.getframerate(), voice.getsampwidth(), voice.getnchannels()) != (RATE, 2, 1):
            raise ValueError(f"Expected 44.1 kHz 16-bit mono narration: {path.name}")
        output = array("h")
        output.frombytes(voice.readframes(voice.getnframes()))
        return output


def stamp(seconds):
    milliseconds = round(seconds * 1000)
    minutes, remaining = divmod(milliseconds, 60000)
    whole, fractional = divmod(remaining, 1000)
    return f"{minutes // 60:02d}:{minutes % 60:02d}:{whole:02d}.{fractional:03d}"


def assemble(directory, theme, story):
    master = array("h")
    cues = []
    frame = 0
    for scene_number, scene in enumerate(story["scenes"]):
        scene["frame"] = frame
        samples = array("h", [0]) * round(RATE * .58)
        for cue_number, line in enumerate(scene["speech"]):
            start = (len(master) + len(samples)) / RATE
            samples.extend(wav_samples(directory / f"{scene_number}-{cue_number}.wav"))
            end = (len(master) + len(samples)) / RATE
            cues.append({"start": round(start, 3), "end": round(end, 3), "text": line})
            samples.extend(array("h", [0]) * round(RATE * .23))
        required = math.ceil((len(samples) / RATE + .98) * FPS)
        scene["frames"] = max(round(scene["seconds"] * FPS), required)
        frame += scene["frames"]
        pad = round(RATE * frame / FPS) - len(master) - len(samples)
        master.extend(samples)
        master.extend(array("h", [0]) * pad)

    seconds = frame / FPS
    if not 60 <= seconds <= 120:
        raise ValueError(f"{theme} summary length is outside 1–2 minutes: {seconds:.2f}s")
    with wave.open(str(directory / "narration.wav"), "wb") as audio:
        audio.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
        audio.writeframes(master.tobytes())
    story.update(duration=seconds, frames=frame, cues=cues)
    (directory / "timeline.json").write_text(json.dumps(story, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    captions = "\n\n".join(f'{stamp(cue["start"])} --> {stamp(cue["end"])}\n{cue["text"]}' for cue in cues)
    (directory / "captions.vtt").write_text("WEBVTT\n\n" + captions + "\n", encoding="utf-8")
    print(f"{theme}: {seconds:.2f}s, {len(cues)} captions")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("work", type=Path, help="Temporary folder for narration and render input")
    source = parser.add_mutually_exclusive_group()
    source.add_argument("--edge-voice", help="Edge TTS voice name, for example en-US-AriaNeural")
    source.add_argument("--reuse-cues", action="store_true", help="Reuse the existing per-cue WAV files")
    args = parser.parse_args()
    work = args.work.resolve()
    work.mkdir(parents=True, exist_ok=True)
    script = ROOT / "stories.json"
    stories = json.loads(script.read_text(encoding="utf-8"))
    if args.edge_voice:
        asyncio.run(narrate_edge(work, stories, args.edge_voice))
    elif not args.reuse_cues:
        powershell = shutil.which("pwsh") or shutil.which("powershell")
        if not powershell:
            parser.error("Windows PowerShell or PowerShell 7 with System.Speech is needed for local narration")
        subprocess.run([powershell, "-NoProfile", "-File", str(ROOT / "narrate.ps1"),
                        "-Stories", str(script), "-OutputDirectory", str(work)], check=True)
    for theme, story in stories.items():
        assemble(work / theme, theme, story)


if __name__ == "__main__":
    main()
