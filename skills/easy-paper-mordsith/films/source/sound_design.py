#!/usr/bin/env python3
"""Create stereo Foley and transition effects from the film's authored scene timings."""

import argparse
import json
import math
import random
import wave
from array import array
from pathlib import Path


RATE = 44100
FPS = 24
SOUNDS = {
    "scan": (.82, .23), "relay": (.16, .17), "coil": (.68, .17),
    "paper": (.46, .21), "glass": (.84, .19), "stylus": (.24, .13),
    "shuttle": (.59, .24), "roller": (.78, .18), "ratchet": (.23, .18),
}

# Offsets in seconds from each chapter start. Sound marks on-screen actions and cuts.
SCORES = {
    "agiel": (
        ("scan", ((.23, "coil", 0), (1.1, "scan", -.45), (4.52, "scan", .38), (7.6, "relay", -.32))),
        ("relay", ((.71, "relay", -.4), (1.59, "relay", -.12), (2.7, "coil", .29))),
        ("coil", ((.55, "relay", -.32), (3.45, "relay", -.14), (4.13, "scan", .15), (9.25, "relay", .38))),
        ("scan", ((.45, "relay", -.45), (.95, "relay", .45), (4.2, "scan", 0))),
        ("relay", ((.46, "coil", -.3), (2.71, "coil", 0), (5.09, "scan", .3))),
        ("coil", ((.4, "relay", -.45), (1.75, "relay", -.15), (3.1, "relay", .15), (4.45, "relay", .45))),
    ),
    "confessor": (
        ("paper", ((.48, "stylus", -.4), (3.18, "glass", .23), (5.1, "glass", -.08))),
        ("paper", ((.42, "stylus", -.22), (1.46, "stylus", .04), (4.5, "glass", -.35), (5.41, "glass", .38))),
        ("paper", ((.35, "stylus", -.4), (1.9, "stylus", -.2), (3.45, "stylus", 0),
                   (5, "stylus", .2), (6.55, "stylus", .4))),
        ("glass", ((1.8, "stylus", -.32), (4, "glass", 0), (8, "stylus", .38))),
        ("paper", ((.6, "glass", -.27), (1.3, "glass", .31), (4.4, "glass", -.32), (5.31, "glass", .32))),
        ("paper", ((.68, "paper", .3), (4.6, "glass", -.17))),
    ),
    "seeker": (
        ("shuttle", ((.44, "roller", -.34), (1.35, "roller", .22), (4.72, "shuttle", -.38), (6.3, "ratchet", .37))),
        ("ratchet", ((.28, "shuttle", -.32), (1.78, "roller", .28), (4.8, "ratchet", -.1))),
        ("shuttle", ((.4, "shuttle", -.26), (1.83, "roller", .22), (4.04, "shuttle", -.35), (5.66, "ratchet", .26))),
        ("ratchet", ((.45, "shuttle", -.24), (1.85, "roller", .22), (4.8, "ratchet", .1))),
        ("shuttle", ((.44, "shuttle", -.24), (1.78, "roller", .22), (4.8, "ratchet", .2))),
        ("roller", ((.42, "shuttle", -.3), (1.8, "roller", .23), (4.8, "ratchet", .34))),
    ),
}


def add_effect(track, position, sound, pan, seed):
    length, level = SOUNDS[sound]
    noise = random.Random(seed)
    left = (1 - pan) ** .5
    right = (1 + pan) ** .5
    count = round(RATE * length)
    slow = fast = 0.0
    sin = math.sin
    turn = math.tau
    for index in range(count):
        dest = 2 * (position + index)
        if dest + 1 >= len(track):
            break
        time = index / RATE
        phase = index / count
        sample = noise.uniform(-1, 1)
        slow += .06 * (sample - slow)
        fast += .29 * (sample - fast)
        texture = fast - slow
        attack = min(1, time / .014)
        release = (1 - phase) ** 2
        if sound == "scan":
            value = .40 * sin(turn * (192 * time + 481 * time ** 2)) + .45 * texture
            envelope = sin(math.pi * phase) ** 1.35
        elif sound == "relay":
            value = .45 * sin(turn * 176 * time) + texture
            envelope = attack * math.exp(-27 * time)
        elif sound == "coil":
            value = .55 * sin(turn * (148 * time - 52 * time ** 2)) + .40 * slow
            envelope = attack * release
        elif sound == "paper":
            value = texture * (.8 + .22 * sin(turn * 21 * time)) + .20 * slow
            envelope = sin(math.pi * phase) ** 1.7
        elif sound == "glass":
            value = .40 * sin(turn * 392 * time) + .26 * sin(turn * 588 * time)
            envelope = attack * math.exp(-5.6 * time) * release
        elif sound == "stylus":
            value = .86 * texture + .20 * sin(turn * 512 * time)
            envelope = attack * math.exp(-13 * time)
        elif sound == "shuttle":
            value = .62 * texture + .40 * sin(turn * (92 * time + 59 * time ** 2))
            envelope = sin(math.pi * phase) ** 1.35
        elif sound == "roller":
            value = .42 * sin(turn * 92 * time) + .75 * slow * (1 + .45 * sin(turn * 18 * time))
            envelope = attack * release
        else:
            value = .9 * texture + .3 * sin(turn * 169 * time)
            envelope = attack * math.exp(-10 * time) * (.38 + .62 * abs(sin(turn * 14 * time)) ** 8)
        levelled = 32767 * level * envelope * value
        for channel, gain in enumerate((left, right)):
            new = track[dest + channel] + round(gain * levelled)
            track[dest + channel] = max(-32767, min(32767, new))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("theme", choices=SCORES)
    parser.add_argument("timeline", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    story = json.loads(args.timeline.read_text(encoding="utf-8"))
    track = array("h", [0]) * (2 * round(RATE * story["frames"] / FPS))
    for index, (scene, (transition, actions)) in enumerate(zip(story["scenes"], SCORES[args.theme])):
        start = scene["frame"] / FPS
        end = start + scene["frames"] / FPS
        for offset, sound, pan in ((0.02, transition, 0), *actions):
            if start + offset < end:
                add_effect(track, round((start + offset) * RATE), sound, pan, 1291 * index + round(125 * offset))
    with wave.open(str(args.output), "wb") as output:
        output.setparams((2, 2, RATE, 0, "NONE", "not compressed"))
        output.writeframes(track.tobytes())


if __name__ == "__main__":
    main()
