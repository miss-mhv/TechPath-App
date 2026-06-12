# 🧭 Gehmit TechPath

> **Plateforme d'orientation, de diagnostic et de parcours d'apprentissage personnalisés pour les carrières dans les TIC en Afrique francophone.**  
> Une initiative éducative et technologique de **Gehmit** ([gehmit.org](https://gehmit.org)).

---

## 🌟 Aperçu du Projet

**Gehmit TechPath** est une application full-stack moderne conçue pour accompagner et guider les élèves et étudiants d'Afrique Francophone vers les métiers porteurs des Technologies de l'Information et de la Communication (TIC). Grâce à un **Auto-Calculateur de Potentiel** innovant, un profilage basé sur les aptitudes réelles, et des recommandations éducatives ciblées, elle démystifie l'informatique en démontrant qu'elle ne se limite pas aux mathématiques théoriques.

---

## 🚀 Fonctionnalités Clés

- **⚡ Auto-Calculateur de Potentiel & Profilage** : Évaluation dynamique des aptitudes numériques (Curiosité, Logique, Sens Visuel et Esprit Pratique) avec animations interactives de barres de progression.
- **🗺️ Espaces d'Orientation Dédiés** :
  - **Espace Élèves** : Diagnostic simplifié adaptatif, détection intuitive de profil (UI/UX, Créateur de contenu, Génie Logiciel, Admins/Systèmes/Sécurité) et fiches métiers pédagogiques.
  - **Espace Professionnels/Parents** : Outils de conseil, ressources d'apprentissage et accompagnement stratégique.
- **📊 Tableau de Bord d'Aptitudes** : Visualisation claire et ergonomique des forces d'apprentissage en temps réel.
- **📄 Export de Profil en PDF** : Génération instantanée d'un bilan d'orientation personnalisé au format PDF grâce à l'intégration de `jsPDF`.
- **🎨 Design Ultra-Polis (Dark Theme)** : Interface utilisateur soignée avec de généreux espaces négatifs, des micro-transitions fluides animées par `motion`, et une icône de navigateur à bords arrondis dynamiques.

---

## 🛠️ Stack Technique

- **Frontend** : 
  - [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) (Type-safe & Modulaire)
  - [Tailwind CSS v4](https://tailwindcss.com) (Stylisation via utilitaires natifs ultra-rapides)
  - [Motion](https://motion.dev) (Animations et micro-interactions haut de gamme)
- **Backend / Serveur** :
  - [Express (Node.js)](https://expressjs.com) (Serveur d'API & Proxy sécurisé, configuré sur le port `3000`)
  - [esbuild](https://esbuild.github.io) (Pour la compilation et la mise en bundle optimisée de l'ensemble du serveur en format Single-file CJS dans `/dist`)
  - [tsx](https://tsx.is) (En mode développement pour exécuter directement le serveur TypeScript à la volée)
- **IA & Services tiers** :
  - [SDK Google GenAI](https://github.com/google/generai-js) (Prêt pour des interactions intelligentes avancées à l'aide de l'API Gemini)
  - [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html) (Moteur pour l'exportation des PDF d'orientation directement dans le navigateur)

---

## 📂 Structure du Répertoire

```bash
├── package.json          # Déclaration des scripts de build et dépendances npm
├── server.ts             # Serveur Express principal (développement et proxy de production)
├── index.html            # Point d’accès HTML avec intégration favicon adaptatif
├── metadata.json         # Métadonnées de l'application (titre, description et permissions)
├── public/               # Ressources d'images statiques (Logos officiels Gehmit et TechPath)
│   ├── logo_gehmit.png
│   ├── logo_techpath.png
│   └── logo_techpath_white_bg
└── src/                  # Composants et logique d'application React
    ├── App.tsx           # Composant Racine et initialisation du favicône arrondi dynamique
    ├── main.tsx          # Point d'entrée de montage React + TypeScript
    ├── index.css         # Thème global Tailwind CSS v4 customisé
    └── components/       # Dossier rassemblant les espaces élèves, logos et coaches d'orientation
```

---

## ⚙️ Installation & Lancement Local

### Prérequis
Assurez-vous d'avoir installé **Node.js** (v18 ou supérieur conseillé) et **npm** sur votre machine.

### 1. Cloner le dépôt GitHub
```bash
git clone https://github.com/votre-compte/gehmit-techpath.git
cd gehmit-techpath
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` ou `.env.local` à la racine du projet et ajoutez-y la clé API Gemini (si des fonctionnalités de recommandation IA avancées sont activées) :
```env
GEMINI_API_KEY=votre_cle_api_ici
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
Le serveur démarrera sur [http://localhost:3000](http://localhost:3000) (mode développement avec rechargement à chaud et proxy Node intégré).

---

## 📦 Production & Déploiement

Pour générer une build optimisée prête à être mise en ligne sur Cloud Run, Heroku, VPS ou autre hébergeur Node.js :

### 1. Compiler l'application
```bash
npm run build
```
Cette commande va :
- Compiler l'application Frontend React optimisée dans le dossier `dist/`.
- Packager le fichier TypeScript `server.ts` de façon isolée en un unique bundle optimisé `dist/server.cjs` à l'aide d'**esbuild**.

### 2. Démarrer le serveur de production
```bash
npm run start
```
Le serveur servira automatiquement les fichiers statiques déjà compilés de façon extrêmement performante.

---

## 🤝 Contribution

Les contributions pour enrichir les fiches de carrières, améliorer l'algorithme d'orientation de l'**Auto-Calculateur de Potentiel**, ou étendre les ressources pour les parents sont les bienvenues !
1. Créez une branche de fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
2. Commitez vos modifications (`git commit -m 'Ajout d'une fonctionnalité'`)
3. Poussez la branche (`git push origin feature/nouvelle-fonctionnalite`)
4. Ouvrez une **Pull Request** sur GitHub.

---

*Gehmit TechPath — Tracer la voie de l'excellence numérique en Afrique Francophone.*
