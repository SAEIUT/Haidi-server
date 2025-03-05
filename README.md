# SAE501 - Backend - Solution de Transport Multimodal pour PMR | CMF

## Description

Ce dépôt contient le backend de la solution de transport multimodal pour les personnes à mobilité réduite (PMR). Il gère l'ensemble des fonctionnalités liées à la planification, la réservation et l'assistance des trajets, en garantissant la sécurité et la protection des données des utilisateurs.
Le deployment est automatisé tout les matins à 6h sur un serveur Azure.


# Architecture

- Développé en Node.js avec Express

- Gestion des bases de données SQL/NoSQL

- 4 bases de données SQL et 1 base de données NoSQL



- Exposition des endpoints REST pour :


    - Création et gestion des utilisateurs

    - Planification et réservation des trajets

    - Suivi en temps réel

    - Notifications et assistance

### Affiche Architecture

![Logo du projet](docs/images/Affiche_Archi.png)

## Installation & Déploiement

### Déploiement avec Docker-Compose

1. Configurer l'environnement
    Crée ou importer le .env
    Modifier les variables nécessaires (ex: connexion DB, clés API...)

2. Construire et démarrer les services

    ``` docker-compose up -d --build ``` 


## Technologies Utilisées

- Backend : Node.js, Express

- Base de données : SQL / NoSQL

- Authentification : Firebase

- Déploiement : Docker 

- Web : Vite, React

## Tests
Le dossier __tests__ contient les tests automatisés de l'application. Ils permettent de garantir que les différentes fonctionnalités du backend fonctionnent comme prévu.

### Types de tests :
Tests unitaires : Vérifient que chaque fonction ou module se comporte correctement de manière isolée.
Tests d'intégration : Vérifient que les différents composants de l'application interagissent correctement entre eux.
Les tests peuvent être exécutés avec des outils comme Jest ou Mocha. 

Pour exécuter les tests, tu peux utiliser la commande suivante :

    ``` npm test ```

## Documentation API

La documentation des endpoints est disponible via Swagger sur :

- [Swagger UI](http://localhost/api/api-docs/) *(si lancé en local)*

- http://4.233.60.46/api/api-docs/ en production

La documentation des endpoints est disponible via Swagger/Postman (ajouter le lien si disponible).


## Méthodologie

- SCRUM
- Développement itératif
- Intégration continue
- User stories et backlog produit

## Contact

Pour toute bug trouver reponder au formulaire :
https://docs.google.com/forms/d/e/1FAIpQLSei8YiyMIK9xrtztVOtCzH63iptOHNJ0IZ4yiKkAa_sbn_Fqg/viewform?usp=dialog
