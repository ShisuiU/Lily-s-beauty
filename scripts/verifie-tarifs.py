#!/usr/bin/env python3
"""
Compare la grille du site à celle de Planity, et signale tout écart.

Pourquoi un script plutôt qu'une relecture à l'œil : **la page Planity
n'affiche que les cinq premières prestations de chaque catégorie**, le
reste attendant un clic sur « voir les N autres ». Une reprise à la main
s'était donc arrêtée à 44 prestations sur 77, sans que rien ne le
signale — chaque catégorie paraissait complète, et sept d'entre elles
comptaient exactement cinq lignes.

La liste entière est pourtant dans la page, mais ailleurs : dans l'état
de l'application, un objet JSON `"services"` que le navigateur utilise
pour déplier la suite. C'est lui qu'on lit ici, et non le HTML affiché.

Une entrée y est vivante si elle n'est pas supprimée (`deletedAt`), pas
masquée sur le web (`webHidden`) et réservable (`bookable`). Le salon
garde en effet ses anciennes grilles : au dernier relevé, 167 entrées
étaient stockées pour 77 réellement proposées.

    python3 scripts/verifie-tarifs.py

Sortie 0 si tout concorde, 1 sinon. Aucune écriture : le script dit ce
qui diffère, la correction se fait dans `src/data/site.ts`.
"""
import json
import pathlib
import re
import sys
import unicodedata
import urllib.request

SOURCE = 'https://www.planity.com/lilys-beauty-30290-laudun-lardoise'
DONNEES = pathlib.Path('src/data/site.ts')


def telecharge(url: str) -> str:
    requete = urllib.request.Request(url, headers={'User-Agent': 'lilysbeauty-verif/1.0'})
    with urllib.request.urlopen(requete, timeout=60) as reponse:
        return reponse.read().decode('utf-8', 'replace')


def objet_json(page: str, cle: str) -> dict:
    """Extrait l'objet qui suit `"cle":` en équilibrant les accolades."""
    depart = page.find(f'"{cle}":')
    if depart < 0:
        raise SystemExit(f'« {cle} » est introuvable dans la page : Planity a changé de format.')
    i = depart + len(cle) + 3
    prof, dans_chaine, echappe = 0, False, False
    for j in range(i, len(page)):
        c = page[j]
        if dans_chaine:
            if echappe:
                echappe = False
            elif c == '\\':
                echappe = True
            elif c == '"':
                dans_chaine = False
        elif c == '"':
            dans_chaine = True
        elif c == '{':
            prof += 1
        elif c == '}':
            prof -= 1
            if prof == 0:
                return json.loads(page[i : j + 1])
    raise SystemExit('accolade jamais refermée : la page est tronquée.')


def vivant(entree: dict) -> bool:
    return (
        not entree.get('deletedAt')
        and not entree.get('webHidden')
        and entree.get('bookable') is not False
    )


def repere(nom: str) -> str:
    """Clé de comparaison : casse, accents et espaces ne comptent pas."""
    sans = unicodedata.normalize('NFD', nom.lower())
    sans = ''.join(c for c in sans if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', sans).strip()


def chez_planity() -> dict:
    """{clé : [(nom, minutes, prix, catégorie), …]}.

    Une liste et non une valeur : le même intitulé existe des deux côtés
    du catalogue avec des tarifs différents — « Aisselles » vaut 12 € en
    15 min chez la femme et 14 € en 20 min chez l'homme. Écrasées sur une
    seule clé, ces paires se seraient annulées et un écart aurait pu
    passer inaperçu.
    """
    services = objet_json(telecharge(SOURCE), 'services')
    grille: dict = {}
    for parent in services.values():
        if not vivant(parent):
            continue
        for enfant in (parent.get('children') or {}).values():
            if not vivant(enfant):
                continue
            nom = re.sub(r'\s+', ' ', enfant['name']).strip()
            centimes = (enfant.get('prices') or {}).get('default')
            grille.setdefault(repere(nom), []).append(
                (nom, enfant.get('duration'), (centimes or 0) / 100, parent.get('name', ''))
            )
    return grille


def chez_nous() -> dict:
    texte = DONNEES.read_text()
    grille: dict = {}
    for m in re.finditer(
        r"\{ name: '((?:[^'\\]|\\.)*)', minutes: (\d+), price: ([\d.]+)", texte
    ):
        nom = m.group(1).replace("\\'", "'")
        grille.setdefault(repere(nom), []).append((nom, int(m.group(2)), float(m.group(3))))
    return grille


def main() -> None:
    planity, nous = chez_planity(), chez_nous()
    cote_planity = sum(len(v) for v in planity.values())
    cote_site = sum(len(v) for v in nous.values())
    print(f'Planity : {cote_planity} prestations   |   site : {cote_site}\n')

    manquantes, en_trop, differentes = [], [], []
    for cle in planity.keys() | nous.keys():
        cote_p = sorted((m, p) for _, m, p, *_ in planity.get(cle, []))
        cote_s = sorted((m, p) for _, m, p in nous.get(cle, []))
        if cote_p == cote_s:
            continue

        # Ce qui concorde des deux côtés sort du calcul ; ne restent que
        # les paires orphelines.
        reste_p, reste_s = list(cote_p), list(cote_s)
        for paire in list(reste_s):
            if paire in reste_p:
                reste_p.remove(paire)
                reste_s.remove(paire)

        def nomme(source, paire, defaut=''):
            for entree in source.get(cle, []):
                if (entree[1], entree[2]) == paire:
                    return entree[0], (entree[3] if len(entree) > 3 else defaut)
            return defaut, defaut

        # Un même intitulé des deux côtés mais des chiffres différents :
        # c'est une correction, pas une disparition suivie d'un ajout.
        while reste_p and reste_s:
            cp, cs = reste_p.pop(0), reste_s.pop(0)
            nom, cat = nomme(planity, cp)
            differentes.append((cat, nom, cp, cs))
        for paire in reste_p:
            nom, cat = nomme(planity, paire)
            manquantes.append((cat, nom, paire))
        for paire in reste_s:
            nom, _ = nomme(nous, paire)
            en_trop.append((nom, paire))

    if manquantes:
        print(f'▸ {len(manquantes)} prestation(s) sur Planity, absente(s) du site :')
        for cat, nom, (m, p) in sorted(manquantes):
            print(f'    [{cat}] {nom} — {m} min, {p:g} €')
        print()
    if differentes:
        print(f'▸ {len(differentes)} prestation(s) au tarif ou à la durée différents :')
        for cat, nom, (pm, pp), (sm, sp) in sorted(differentes):
            print(f'    [{cat}] {nom} — site : {sm} min, {sp:g} €   '
                  f'≠   Planity : {pm} min, {pp:g} €')
        print()
    if en_trop:
        print(f'▸ {len(en_trop)} prestation(s) sur le site, introuvable(s) sur Planity :')
        for nom, (m, p) in sorted(en_trop):
            print(f'    {nom} — {m} min, {p:g} €')
        print()

    ecarts = len(manquantes) + len(differentes) + len(en_trop)
    if ecarts:
        print(f'{ecarts} écart(s). Corriger `universes` dans {DONNEES}, '
              'puis la date de `pricesCheckedOn`.')
        sys.exit(1)
    print('Aucun écart : la grille du site est celle de Planity.')


if __name__ == '__main__':
    main()
