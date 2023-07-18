
# BILLED
https://github.com/leen1515/billed/

Il est prévu que cette application de "Billed" soit lancée pour être utilisée, entre-autres fonctionnalités, au sein d'une équipe de ressources humaines.
La fonctionnalité consacrée à la gestion des notes de frais des employés doit être présenté au sein de l'entreprise pour pouvoir être lancée en production.
Son rôle : Deux comptes se diffèrent l'un de l'autre au sein d'une interface permettant le partage et la validation de note de frais. 
Celui de l'employé, il rédige ses notes et les soumets (l'état de ses notes sont par défaut "En attente"). 
Ainsi que celui de l'administrateur, il les analyses, les commentes puis les valide ou non.

# Contexte
Suite au départ d'un membre de l'équipe des développeurs de Billed (spécialisé des solutions Saas destinées aux équipes de ressources humaines),
la correction des bugs trouvés de l'application, la rédaction d'un plan de test "End-to-End" du parcours "Employé" ainsi que l'écriture des tests unitaires et d'intégrations avec le framework Jest (le fichier Bills.js ainsi que de NewBill.js) sont les objectifs principaux pour mener à son terme ce projet.

## Installation

Pour installer les dépendances du projet, dont Jest, à partir du repertoire bill-app, il y a 2 étapes: 
1 - il faut cibler le repertoire Billed-app-FR-Back et lancer l'installation de ses dépendances

```bash
  npm i
```

Ensuite lancer le server directement

```bash
  node server.js
```
Le server lancé se verifie sur le port 5678
http://127.0.0.1:5678/


2 - Il faut cibler le repertoire Billed-app-FR-Front et utiliser npm

```bash
  npm i
```

Ensuite avec l'extension live-server, il faut demarrer le Front,
il se connecte avec l'api. Quant tout se passe comme prêvu, le fond du formulaire est bleu, sinon il est blanc => problème avec le server coté back.

```bash
  live-server
```

L'application est enfin visible en locale sur le port 8080
http://127.0.0.1:8080/

* *Pour live-server, prendre soin à ce qu'il n'y ai pas de nombreuses pages d'ouvertes de Billed => provoque un "change detected" constant qui se résoud sans difficulté en relançant vs-code, les servers etc...* *

## Connexion à l'application
utilisateur : **admin@test.tld**  
mot de passe : **admin** 

utilisateur : **employee@test.tld** 
mot de passe : **employee** 

## Screenshots

En analysant tous les fichiers confondus, la couverture des tests sur le script atteint 89,47% en "Statements"

![App Screenshot](https://raw.githubusercontent.com/leen1515/billed/main/bill-app/annexes/resultat-test.PNG)


Avec une douzaine de tests unitaires et d'intégrations écrites, Bills.js ainsi que NewBill.js dépassent les 90% d'état de leur script couvert par les tests.

## Usage/Examples
Pour lancer Jest et ainsi tester le code JS afin qu'ils retournent son résultat

```bash
npm run test
```

Pour un rendu graphique des résultats statistiques des tests
Il y a besoin d'accéder en locale au chemin de coverage

http://127.0.0.1:8080/coverage/lcov-report


![App Screenshot](https://raw.githubusercontent.com/leen1515/billed/main/bill-app/annexes/2-after-test-coverage.jpg)



L'avenir de cette application, ses mises à jour, l'experience des utilisateur, sont ainsi assurés gràce à une large couverture des tests sur son code

## License

OpenClassrooms

