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

# The starter game's files, for the board's "Ask for help" (it quotes real line numbers)
import json
STARTER = HERE.parent / "escape-room-starter"
files = {name: (STARTER / name).read_text(encoding="utf-8").replace("\r\n", "\n") for name in ("rooms.js", "game.js", "style.css", "index.html")}
src = src.replace("/*@STARTER@*/{}", json.dumps(files).replace("</", "<\\/"))

# The Discord kit's posts go into Live on the private Claude board only. The public site (P9_NO_FONTS)
# never gets them: they're notes about the girls, and that site's code is public on GitHub.
import re
kit_js = ""
KIT = HERE / "discord-kit.src.html"
if src_name == "quest-board.src.html" and not os.environ.get("P9_NO_FONTS") and KIT.exists():
    kit = KIT.read_text(encoding="utf-8")
    consts = "\n".join(re.findall(r'^\s*const (?:BOARD|PARTY|FIGMA|SLIDES) = ".*?";', kit, re.M))
    a = kit.index("  const GROUPS = [")
    b = kit.index("\n  ];\n", a) + len("\n  ];\n")
    fields = []
    for label, k, attrs in re.findall(r'<label for="f-[\w-]+">([^<]+)<input id="f-[\w-]+" data-k="(\w+)"([^>]*)>', kit):
        val = re.search(r'value="([^"]*)"', attrs)
        ph = re.search(r'placeholder="([^"]*)"', attrs)
        fields.append({"k": k, "label": label.strip(), "value": val.group(1) if val else "", "placeholder": ph.group(1) if ph else ""})
    kit_js = (f"window.P9_KIT_FIELDS = {json.dumps(fields)};\n"
              f"window.P9_KIT = ({{ v, lines }}) => {{\n{consts}\n{kit[a:b]}  return GROUPS;\n}};")
    kit_js = re.sub(r"</(script)", r"<\\/\1", kit_js, flags=re.I)
src = src.replace("/*@KIT_JS@*/", kit_js)

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
