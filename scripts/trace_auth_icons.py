from PIL import Image

def load_mask(path, alpha=120, light=False):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    mask = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            is_light = a > 80 and r > 200 and g > 180 and b > 180
            if light:
                mask[y][x] = is_light
            else:
                mask[y][x] = a > alpha and not is_light
    return mask, w, h


def contours(mask, w, h):
    def filled(x, y):
        return 0 <= x < w and 0 <= y < h and mask[y][x]

    segs = {}
    for y in range(h):
        for x in range(w):
            if not mask[y][x]:
                continue
            edges = [
                ((x, y), (x + 1, y), (x, y - 1)),
                ((x + 1, y), (x + 1, y + 1), (x + 1, y)),
                ((x + 1, y + 1), (x, y + 1), (x, y + 1)),
                ((x, y + 1), (x, y), (x - 1, y)),
            ]
            for a, b, nb in edges:
                if not filled(*nb):
                    segs[a] = b
    loops = []
    unused = set(segs)
    while unused:
        start = min(unused)
        loop = [start]
        cur = start
        while True:
            nxt = segs.get(cur)
            unused.discard(cur)
            if nxt is None or nxt == start:
                break
            loop.append(nxt)
            cur = nxt
        if len(loop) > 8:
            loops.append(loop)
    return loops


def rdp(points, eps):
    if len(points) < 3:
        return points

    def dist(p, a, b):
        x, y = p
        x1, y1 = a
        x2, y2 = b
        dx, dy = x2 - x1, y2 - y1
        if dx == 0 and dy == 0:
            return ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
        t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
        t = max(0, min(1, t))
        px, py = x1 + t * dx, y1 + t * dy
        return ((x - px) ** 2 + (y - py) ** 2) ** 0.5

    dmax, idx = 0, 0
    for i in range(1, len(points) - 1):
        d = dist(points[i], points[0], points[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(points[: idx + 1], eps)[:-1] + rdp(points[idx:], eps)
    return [points[0], points[-1]]


def norm(loop, bbox, size=64, pad=4):
    x0, y0, x1, y1 = bbox
    bw, bh = x1 - x0, y1 - y0
    scale = (size - pad * 2) / max(bw, bh)
    ox = pad + (size - pad * 2 - bw * scale) / 2
    oy = pad + (size - pad * 2 - bh * scale) / 2
    return [((x - x0) * scale + ox, (y - y0) * scale + oy) for x, y in loop]


def to_path(loop, eps):
    pts = rdp(loop + [loop[0]], eps)[:-1]
    parts = [f"M{pts[0][0]:.2f} {pts[0][1]:.2f}"]
    for x, y in pts[1:]:
        parts.append(f"L{x:.2f} {y:.2f}")
    parts.append("Z")
    return " ".join(parts), len(pts)


def bbox_of(loops):
    xs = [p[0] for loop in loops for p in loop]
    ys = [p[1] for loop in loops for p in loop]
    return min(xs), min(ys), max(xs), max(ys)


base = r"D:\source\codefend-user\scripts\auth-icon-backups\\"
for name in ["Grupo-1.png", "icono-bicho.png"]:
    mask, w, h = load_mask(base + name)
    loops = contours(mask, w, h)
    box = bbox_of(loops)
    print("\n==", name, "loops", [len(l) for l in loops])
    for i, loop in enumerate(loops):
        scaled = norm(loop, box)
        d, n = to_path(scaled, 0.85)
        print(i, "pts", n)
        print(d)
