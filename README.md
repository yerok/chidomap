Voici un README.md complet et détaillé pour ton projet, basé sur les informations que tu m'as fournies :

---

# Chido Map - Cartographie Interactive de Mayotte

Chido Map est une application web de cartographie interactive conçue pour fournir des informations géolocalisées précises et fiables sur la situation à Mayotte suite au passage de Chido.

---

## Technologies utilisées

- **Langages** : TypeScript
- **Frameworks et bibliothèques** : React, Leaflet, Express
- **Outils** : Vite, ESLint
- **Base de données** : MongoDB
- **Services** : OpenStreetMaps

---

## Installation

### Prérequis

- **npm** 
- **le serveur backend qui tourne**
- **MongoDB** 

### Étapes d'installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/chido-map.git
   cd chido-map
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez la base de données :
   - Assurez-vous que MongoDB est installé et en cours d'exécution.
   - Configurez l'URL du backend dans le fichier `src/api/geojsonApi.ts`. Par défaut, l'URL est `http://127.0.0.1:3000/api`.

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Accédez à l'application :
   Ouvrez votre navigateur et accédez à `http://localhost:5173`.

---

## Utilisation

### Chargement des données

L'application tente de charger un fichier GeoJSON depuis la base de données MongoDB. Si elle n'y parvient pas, elle récupère les données directement dans le fichier `partial_chido_map.json` (incomplet, nécessite d'ajouter la catégorie de chaque point manquant ) 


### Dossiers

- **`/src`** : Contient le code source de l'application.
  - **`/api`** : Gestion des appels API.
  - **`/components`** : Composants React réutilisables.
  - **`/data`** : Fichiers GeoJSON locaux.
  - **`/store`** : Gestion de l'état avec Redux.
  - **`/types`** : Définitions TypeScript.
- **`/public`** : Fichiers statiques (ex : favicon, images).
- **`/node_modules`** : Dossier contenant toutes les dépendances du projet.

---

