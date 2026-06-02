# SteFi Services — Site web

Site statique (HTML/CSS/JS). Aucune dépendance à installer, aucun build.

## Pages
```
index.html              Accueil
services.html           Services + méthode
realisations.html       Réalisations (chargées depuis Supabase)
tarifs.html             Tarifs (Vitrine / Boutique / Sur-mesure)
a-propos.html           À propos + valeurs
contact.html            Contact + FAQ
mentions-legales.html   Mentions légales
admin.html              Espace privé : ajouter/supprimer des réalisations
```

## Dossiers
```
css/style.css           Tout le design (couleurs dans :root en haut)
js/main.js              Interactions communes (menu, animations, formulaire)
supabase-config.js   ← À REMPLIR avec vos clés Supabase
js/realisations.js      Affichage public des réalisations
js/admin.js             Connexion + ajout/suppression (admin)
img/logo.png            Logo
robots.txt / sitemap.xml  SEO
GUIDE-SUPABASE.md       Pas-à-pas pour activer Réalisations + Admin
```

## 1. Déploiement Vercel
1. Pousser tout le contenu de ce dossier à la racine d'un dépôt GitHub.
2. vercel.com → New Project → importer le dépôt.
3. Framework Preset : **Other**. Pas de build command.
4. Deploy.

Le site fonctionne immédiatement. La page Réalisations affichera
"bientôt disponibles" tant que Supabase n'est pas configuré (étape 2).

## 2. Activer Réalisations + Admin (Supabase)
Suivre **GUIDE-SUPABASE.md** (~10 min). En résumé :
1. Créer un projet Supabase (gratuit).
2. Créer la table `realisations` (script SQL fourni dans le guide).
3. Créer votre compte admin (email + mot de passe).
4. Coller votre URL + clé `anon` dans `supabase-config.js`.
5. Aller sur `/admin.html`, se connecter, ajouter vos travaux.

## Modifier les coordonnées
Téléphone / email / WhatsApp apparaissent dans le footer de chaque page,
dans contact.html et mentions-legales.html, et le numéro WhatsApp dans
js/main.js (constante WHATSAPP).

## Changer les couleurs
Variables CSS dans css/style.css (bloc :root en haut du fichier).
