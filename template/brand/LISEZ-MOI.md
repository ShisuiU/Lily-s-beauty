# Les originaux

Déposer ici les photos livrées, en pleine résolution, sous les noms
attendus par `scripts/prepare-photos.py` :

```
accueil-large.jpg      la façade, ou la pièce vue en entier  → bandeau, ordinateur
accueil-vertical.jpg   une photo verticale                   → bandeau, téléphone
lieu-1…4.jpg           l'intérieur                           → le ruban « Le lieu »
travail-1…8.jpg        des réalisations                      → la grille « Le travail »
```


Puis :

```bash
pip install Pillow
python3 scripts/prepare-photos.py
```

Le script écrit dans `src/assets/` des versions recadrées, réduites et
**débarrassées de leurs métadonnées**. Les originaux restent ici : ce
dossier n'est pas publié, il n'est là que pour pouvoir refaire une
découpe sans redemander les fichiers.

Un nom absent n'arrête rien : l'image d'exemple correspondante reste en
place, et le script dit lesquelles il n'a pas trouvées.

Penser aussi au droit à l'image : une photo où une personne est
reconnaissable demande son accord, à l'écrit si possible.
