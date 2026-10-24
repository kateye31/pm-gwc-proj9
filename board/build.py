# Builds quest-board.html from quest-board.src.html by embedding the fonts in fonts/.
# The artifact host only allows Google Fonts, so custom fonts have to be inlined as data URIs.
# Usage: python board/build.py [output path]
import base64
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
FONTS = [
    ("Beanzo", "beanzo.ttf", "truetype"),
    ("Newstan", "newstan.ttf", "truetype"),
    ("Road Hunter", "road-hunter.otf", "opentype"),
]

faces = []
# P9_NO_FONTS=1 leaves the personal-use fonts out (the public GitHub Pages site uses open fonts instead)
import os
for family, file, fmt in ([] if os.environ.get("P9_NO_FONTS") else FONTS):
    data = base64.b64encode((HERE / "fonts" / file).read_bytes()).decode()
    mime = "font/ttf" if fmt == "truetype" else "font/otf"
    faces.append(
        f'@font-face{{font-family:"{family}";src:url(data:{mime};base64,{data}) format("{fmt}");font-display:block}}'
    )

src_name = sys.argv[2] if len(sys.argv) > 2 else "quest-board.src.html"
src = (HERE / src_name).read_text(encoding="utf-8")
src = src.replace("/*@FONTS@*/", "\n".join(faces))
src = src.replace("/*@COUNCIL_CSS@*/", (HERE / "council.css").read_text(encoding="utf-8"))
src = src.replace("/*@COUNCIL_JS@*/", (HERE / "council.js").read_text(encoding="utf-8"))
src = src.replace("<!--@COUNCIL_HTML@-->", (HERE / "council.html").read_text(encoding="utf-8"))
src = src.replace("<!--@PARTY_HTML@-->", (HERE / "party.html").read_text(encoding="utf-8"))
src = src.replace("/*@PARTY_CSS@*/", (HERE / "party.css").read_text(encoding="utf-8"))
src = src.replace("/*@PARTY_JS@*/", (HERE / "party.js").read_text(encoding="utf-8"))

# Artwork: "@ART:name@" becomes a data URI for art/name.jpg
for img in sorted((HERE / "art").iterdir()):
    if img.suffix.lower() not in (".jpg", ".png", ".webp"):
        continue
    mime = {".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}[img.suffix.lower()]
    data = base64.b64encode(img.read_bytes()).decode()
    src = src.replace(f"@ART:{img.stem}@", f"data:{mime};base64,{data}")

out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "quest-board.html"
out.write_text(src, encoding="utf-8")
print(f"wrote {out} ({out.stat().st_size // 1024} KB)")
