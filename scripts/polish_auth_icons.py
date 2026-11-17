from pathlib import Path

import numpy as np
from PIL import Image

BACKUP = Path(r"D:\source\codefend-user\scripts\auth-icon-backups")
DEST = Path(r"D:\source\codefend-user\public\codefend")
FILES = ["Grupo-1.png", "icono-leaks.png", "icono-bicho.png"]
TARGET = np.array([114.0, 215.0, 245.0])  # #72d7f5
DARK = np.array([22.0, 130.0, 165.0])
OUT_SIZE = 128
SUBJECT_RATIO = 0.78
ALPHA_CUT = 160


def process(name: str) -> None:
    arr = np.asarray(Image.open(BACKUP / name).convert("RGBA")).astype(np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    solid = a >= ALPHA_CUT
    is_white = solid & (r > 200) & (g > 200) & (b > 200)

    out = np.zeros_like(arr)
    t = np.clip((r - 150.0) / 105.0, 0.0, 1.0)[..., None]
    color = DARK * (1.0 - t) + TARGET * t
    color = np.where(is_white[..., None], np.array([248.0, 252.0, 255.0]), color)
    out[:, :, :3] = color
    out[:, :, 3] = np.where(solid, 255.0, 0.0)

    ys, xs = np.where(out[:, :, 3] > 0)
    cropped = Image.fromarray(out.astype(np.uint8), "RGBA").crop(
        (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    )

    canvas = Image.new("RGBA", (OUT_SIZE, OUT_SIZE), (0, 0, 0, 0))
    max_dim = int(OUT_SIZE * SUBJECT_RATIO)
    cw, ch = cropped.size
    scale = min(max_dim / cw, max_dim / ch)
    nw = max(1, int(round(cw * scale)))
    nh = max(1, int(round(ch * scale)))
    resized = cropped.resize((nw, nh), Image.Resampling.LANCZOS)

    # Flatten LANCZOS fringe so edges stay crisp without glow
    ra = np.asarray(resized).astype(np.float32)
    keep = ra[:, :, 3] >= 96
    ra[:, :, 3] = np.where(keep, 255.0, 0.0)
    # Un-premultiply fringe tint: only keep RGB where opaque
    ra[:, :, :3] = np.where(keep[..., None], ra[:, :, :3], 0.0)
    resized = Image.fromarray(ra.astype(np.uint8), "RGBA")

    canvas.paste(resized, ((OUT_SIZE - nw) // 2, (OUT_SIZE - nh) // 2), resized)
    canvas.save(DEST / name)
    print(f"updated {name}: {cw}x{ch} -> {nw}x{nh}")


def main() -> None:
    for name in FILES:
        process(name)
    print("done")


if __name__ == "__main__":
    main()
