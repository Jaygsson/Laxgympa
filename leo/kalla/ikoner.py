"""Ritar ikonerna till Lekgympan (grön ruta med fotboll) med Pillow. Körs en gång: python3 ikoner.py"""
from PIL import Image, ImageDraw
from pathlib import Path
import math
ut = Path(__file__).parent / 'pwa'

def ikon(storlek, maskable):
    s = storlek * 4  # rita stort och förminska för mjuka kanter
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if maskable:
        d.rectangle([0, 0, s, s], fill='#2DB36A')
    else:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.23), fill='#2DB36A')
    # Vita planlinjer
    lw = max(4, s // 48)
    d.rectangle([int(s * 0.1), int(s * 0.1), int(s * 0.9), int(s * 0.9)], outline='#FFFFFF', width=lw)
    d.line([int(s * 0.1), s // 2, int(s * 0.9), s // 2], fill='#FFFFFF', width=lw)
    # Bollen
    cx, cy, r = s // 2, s // 2, int(s * (0.26 if maskable else 0.3))
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill='#FFFFFF', outline='#1E3A2A', width=lw)
    # Femkant i mitten och fem runtom
    def femkant(x, y, rr, rot):
        return [(x + rr * math.cos(rot + i * 2 * math.pi / 5), y + rr * math.sin(rot + i * 2 * math.pi / 5)) for i in range(5)]
    d.polygon(femkant(cx, cy, r * 0.33, -math.pi / 2), fill='#1E3A2A')
    for i in range(5):
        a = -math.pi / 2 + i * 2 * math.pi / 5
        px, py = cx + r * 0.86 * math.cos(a), cy + r * 0.86 * math.sin(a)
        d.polygon(femkant(px, py, r * 0.25, a + math.pi), fill='#1E3A2A')
        d.line([cx + r * 0.33 * math.cos(a), cy + r * 0.33 * math.sin(a), px, py], fill='#1E3A2A', width=lw)
    return im.resize((storlek, storlek), Image.LANCZOS)

ikon(192, False).save(ut / 'icon-192.png')
ikon(512, False).save(ut / 'icon-512.png')
ikon(512, True).save(ut / 'icon-maskable-512.png')
print('ikoner klara')
