# Matthieu Delapoterie — Portfolio

Portfolio de Product Designer (Lille, +10 ans). Site statique : HTML, CSS, JS vanilla, sans build.

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8000
```

## Typographie

- **Titres** : [Archivo](https://fonts.google.com/specimen/Archivo) (OFL), police variable réglée en largeur 125
  (`font-stretch: 125%`) et graisse 800 — modifiable via `--display-weight` dans `styles.css`.
- **Textes** : JetBrains Mono (OFL), auto-hébergée dans `fonts/`.

## Personnaliser

- Projets, parcours et expertises : `index.html` (sections `#work`, `#about`, `#services`).
- Couleurs : variables CSS dans `:root` (`styles.css`) — thème sombre par défaut, clair via le bouton en haut à droite.
- Les visuels de projets sont des maquettes en CSS ; remplacez le contenu de `.project__media` par vos images.
- Liens réseaux (LinkedIn, Dribbble, Behance) : à compléter dans la section `#contact`.
