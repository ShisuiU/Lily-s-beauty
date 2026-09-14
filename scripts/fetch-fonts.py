#!/usr/bin/env python3
"""
Télécharge les polices depuis Google Fonts et les installe dans le dépôt.

Pourquoi : servir les polices depuis fonts.googleapis.com fait contacter un
serveur tiers à chaque visite — c'est le dernier point RGPD ouvert du site,
et c'est aussi la première ressource bloquante du rendu. Hébergées ici, la
requête externe disparaît et la page s'affiche plus tôt.

    pip install Pillow    # seulement pour scripts/generate-og.py
    python3 scripts/fetch-fonts.py

Écrit les .woff2 dans public/fonts/ et la feuille @font-face dans
src/styles/fonts.css. Relancer après avoir ajouté une graisse.

Seules les plages latin et latin-ext sont conservées : le cyrillique, le
grec et le vietnamien que sert Google ne servent à rien sur un site français.

ATTENTION : vercel.json met /fonts/ en cache immuable pour un an. Les noms
produits ici ne portent pas d'empreinte ; si vous remplacez le contenu d'une
fonte sans changer son nom, les visiteurs garderont l'ancienne. Renommez le
fichier dans ce cas.
"""
import pathlib
import re
import urllib.request

CSS_URL = (
    'https://fonts.googleapis.com/css2'
    '?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400'
    '&family=Instrument+Sans:wght@400;500;600'
    '&family=Pinyon+Script'
    '&display=swap'
)
# Un navigateur moderne obtient du woff2 ; un vieil agent obtiendrait du ttf.
UA = ('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36')

GARDEES = ('U+0000-00FF', 'U+0100-02BA')     # latin, latin-ext
FONTS_DIR = pathlib.Path('public/fonts')
CSS_OUT = pathlib.Path('src/styles/fonts.css')


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def main() -> None:
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    css = get(CSS_URL).decode('utf-8')

    blocs = re.findall(r'@font-face\s*\{[^}]*\}', css)
    sortie, gardes, vus = [], 0, set()

    for bloc in blocs:
        plage = re.search(r'unicode-range:\s*([^;]+);', bloc)
        if not plage or not plage.group(1).strip().startswith(GARDEES):
            continue

        famille = re.search(r"font-family:\s*'([^']+)'", bloc).group(1)
        poids = re.search(r'font-weight:\s*(\d+)', bloc).group(1)
        style = 'italic' if "font-style: italic" in bloc else 'normal'
        url = re.search(r'url\((https://[^)]+\.woff2)\)', bloc).group(1)

        suffixe = 'ext' if plage.group(1).strip().startswith('U+0100-02BA') else 'lat'
        nom = f"{famille.lower().replace(' ', '-')}-{poids}{'-i' if style == 'italic' else ''}-{suffixe}.woff2"
        if nom in vus:
            continue
        vus.add(nom)

        (FONTS_DIR / nom).write_bytes(get(url))
        sortie.append(bloc.replace(url, f'/fonts/{nom}'))
        gardes += 1
        print(f'  {nom}')

    entete = (
        '/* Polices hébergées par le site — généré par scripts/fetch-fonts.py.\n'
        '   Ne pas modifier à la main : relancer le script.\n'
        '   Aucune requête vers Google : le visiteur ne contacte que ce domaine. */\n\n'
    )
    CSS_OUT.write_text(entete + '\n'.join(sortie) + '\n', encoding='utf-8')

    poids_total = sum(f.stat().st_size for f in FONTS_DIR.glob('*.woff2'))
    print(f'\n{gardes} fontes gardées sur {len(blocs)} · {poids_total / 1024:.0f} Ko')
    print(f'→ {CSS_OUT}')


if __name__ == '__main__':
    main()
