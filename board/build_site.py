# Builds the free GitHub Pages site into ../docs:
#   docs/index.html        the team board (same code as the Claude artifact)
#   docs/party/index.html  the party game (phones by default, #host for the big screen)
#   docs/config.js         Firebase + mentor settings, edited without rebuilding
# Usage: python board/build_site.py
import pathlib
import shutil
import subprocess
import sys

HERE = pathlib.Path(__file__).parent
DOCS = HERE.parent / "docs"
tmp = HERE / "site" / "_bundle.html"
import os
subprocess.run([sys.executable, str(HERE / "build.py"), str(tmp)], check=True, env={**os.environ, "P9_NO_FONTS": "1"})
bundle = tmp.read_text(encoding="utf-8")
tmp.unlink()
shim = (HERE / "site" / "shim.js").read_text(encoding="utf-8")


def page(config_src, extra=""):
    # The artifact host normally adds this skeleton; on GitHub Pages we write it ourselves.
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
        "body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>"
        # Open-licensed fonts for the public site (Beanzo is personal-use only)
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap">'
        '<style>:root{--display:"Archivo Black","Atkinson Hyperlegible",sans-serif !important}</style>'
        f'<script src="{config_src}"></script>{extra}<script>{shim}</script>'
        f"</head><body>{bundle}</body></html>"
    )


DOCS.mkdir(exist_ok=True)
(DOCS / "party").mkdir(exist_ok=True)
(DOCS / "index.html").write_text(page("config.js"), encoding="utf-8")
(DOCS / "party" / "index.html").write_text(page("../config.js", '<script>window.P9_PARTY_DEFAULT="play"</script>'), encoding="utf-8")
if not (DOCS / "config.js").exists():
    shutil.copy(HERE / "site" / "config.js", DOCS / "config.js")
(DOCS / ".nojekyll").write_text("", encoding="utf-8")
print("site built in", DOCS)
