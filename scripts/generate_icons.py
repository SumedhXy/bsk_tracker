from PIL import Image, ImageDraw
from pathlib import Path

output_dir = Path("public")
output_dir.mkdir(exist_ok=True)

for size in (192, 512):
    img = Image.new("RGBA", (size, size), (10, 15, 31, 255))
    draw = ImageDraw.Draw(img)
    radius = size * 0.42
    center = (size / 2, size / 2)
    draw.ellipse(
        [
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        ],
        fill=(231, 111, 81, 255),
    )
    width = max(1, size // 20)
    draw.line(
        [
            (center[0] - radius * 0.7, center[1] - radius * 0.7),
            (center[0] + radius * 0.7, center[1] + radius * 0.7),
        ],
        fill=(30, 30, 30, 255),
        width=width,
    )
    draw.line(
        [
            (center[0] - radius * 0.7, center[1] + radius * 0.7),
            (center[0] + radius * 0.7, center[1] - radius * 0.7),
        ],
        fill=(30, 30, 30, 255),
        width=width,
    )
    draw.arc(
        [
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        ],
        45,
        135,
        fill=(30, 30, 30, 255),
        width=width,
    )
    draw.arc(
        [
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        ],
        225,
        315,
        fill=(30, 30, 30, 255),
        width=width,
    )
    img.save(output_dir / f"icon-{size}.png")
