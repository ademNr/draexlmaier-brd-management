## Visual Management & Reclamations internes (BRD / KSK)

Application Next.js (App Router) orientée tablette pour suivre les défauts par BRD et KSK, avec 6 sections physiques, saisie temps réel et analytics rapides.

### Démarrage

1) Installer les dépendances
```bash
pnpm install
```

2) Configurer l'environnement
- Copier `env.example` en `.env.local`
- Renseigner `MONGODB_URI` vers votre cluster MongoDB

3) Lancer le serveur de dev
```bash
pnpm dev
```
L'interface est disponible sur http://localhost:3000.

### Pile technique
- Next.js 16 (App Router) + TypeScript + Tailwind (v4)
- Mongoose pour l'ODM MongoDB
- API routes /app/api pour BRD, défauts, analytics

### Architecture (src/)
- `app/page.tsx` : tableau de bord BRD/KSK + analytics
- `app/brd/[id]/page.tsx` : saisie détaillée KSK + suivi section par section
- `components/` : carte BRD, grille des 6 sections, formulaires, analytics
- `lib/` : connexion Mongo, modèles Mongoose, validation Zod, requêtes data
- `app/api/` : endpoints `brds`, `defects`, `analytics/summary`

### Flot utilisateur
- Dashboard : liste des BRD, résumé des sections (1 à 6), totaux KSK avec défauts, analytics.
- Détail BRD : saisie KSK (numéro obligatoire), sélection d'une section, choix multi-défauts, shift/ligne/agent + commentaire. Historique des défauts et analytics filtrées sur le BRD.

### Scripts utiles
- `pnpm dev` : mode développement
- `pnpm build && pnpm start` : build + production
- `pnpm lint` : linting

### Notes
- UI en français, boutons larges et contrastés pour usage tablette.
- Les données sont dynamiques (pas de cache) et rafraîchies périodiquement côté client.
