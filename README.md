# Matthieu Delapoterie — Portfolio

Portfolio de Product Designer (Lille, +10 ans). Site statique : HTML, CSS, JS vanilla, sans build.

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8000
```

## Typographie

- **Titres** : pile `"WT Gothic", "Anton"`. WT Gothic est une police commerciale : déposez votre fichier
  sous `fonts/WTGothic.woff2` et décommentez le bloc `@font-face` en haut de `styles.css`.
  En attendant, Anton (gothique condensée, OFL) est utilisée.
- **Textes** : JetBrains Mono (OFL), auto-hébergée dans `fonts/`.

## Personnaliser

- Projets, parcours et expertises : `index.html` (sections `#work`, `#about`, `#services`).
- Couleurs : variables CSS dans `:root` (`styles.css`) — thème sombre par défaut, clair via le bouton en haut à droite.
- Les visuels de projets sont des maquettes en CSS ; remplacez le contenu de `.project__media` par vos images.
- Liens réseaux (LinkedIn, Dribbble, Behance) : à compléter dans la section `#contact`.
