# Matthieu Delapoterie — Portfolio

Portfolio de Product Designer (Lille, +10 ans). Site statique : HTML, CSS, JS vanilla, sans build.

## Lancer en local

Servir le dossier en HTTP (recommandé : les polices locales ne se chargent pas toujours en `file://`) :

```bash
python3 -m http.server 8000
```

## Typographie

- **Titres** : [Archivo](https://fonts.google.com/specimen/Archivo) (OFL), police variable réglée en largeur 125
  (`font-stretch: 125%`) et graisse 800 — modifiable via `--display-weight` dans `styles.css`.
- **Textes** : JetBrains Mono (OFL), auto-hébergée dans `fonts/`.

## Interaction du hero

Quand la souris bouge sur le hero, une traînée de gélules apparaît sous le curseur, puis chaque
gélule retombe en s'effaçant. Elles contiennent les mots-clés (Product Design, UX Research, Design Systems,
Prototypage, UI Design, Stratégie produit). En thème sombre, le nom passe en `mix-blend-mode: difference`
au-dessus des gélules. Désactivé sur écrans tactiles et si « réduire les animations » est activé.
Réglages dans `script.js`, section « Hero : traînée de gélules » : mots-clés, couleurs, taille du pool,
espacement, durée.

## Personnaliser

- Projets, parcours et expertises : `index.html` (sections `#work`, `#about`, `#services`).
- Couleurs : variables CSS dans `:root` (`styles.css`) — thème sombre par défaut, clair via le bouton en haut à droite.
- Les visuels de projets sont des maquettes en CSS ; remplacez le contenu de `.project__media` par vos images.
- Liens réseaux (LinkedIn, Dribbble, Behance) : à compléter dans la section `#contact`.
