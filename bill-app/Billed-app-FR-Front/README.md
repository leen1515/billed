
# BILLED
https://github.com/leen1515/billed/

Il est prévu que l'application "Billed" soit lancée pour être utilisée dans le cadre de la gestion des notes de frais des employés au sein d'une entreprise. L'administrateur constate les notes et les valide ou les invalide, sachant que ces notes sont par défaut en attente.
Deux comptes se diffèrent ainsi l'un de l'autre : l'employé rédige ses notes et les soumets tandis que le compte administrateur les analyses, les commentes puis les valide ou non.

# Contexte
Suite au départ d'un membre de l'équipe des développeurs, la correction des bugs trouvés de l'application, la rédaction d'un plan de test "End-to-End" du parcours "Employé" ainsi que l'écriture des tests unitaires et d'intégrations du fichier Bills.js ainsi que de NewBill.js sont les objectifs principaux pour mener à son terme le projet.






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
il se connecte avec l'api. Quant tout se passe comme prêvu, le fond du formulaire sera bleu, sinon il sera blanc => problème avec le server coté back.

```bash
  live-server
```

L'application est enfin visible en local sur le port 8080
http://127.0.0.1:8080/

(Pour live-server, prendre soin à ce qu'il n'y ai pas de nombreuses pages d'ouvertes de Billed => provoque un "change detected" constant qui se résoud sans difficulté en relançant vs-code, les servers etc...)


## Screenshots

En analysant tous les fichiers confondus, la couverture des tests sur le script atteint 89,47% en "Statement"

![App Screenshot](https://raw.githubusercontent.com/leen1515/billed/main/bill-app/annexes/resultat-test.PNG)


Avec une douzaine de tests unitaires et d'intégrations écrite, Bills.js ainsi que NewBill.js dépassent les 90% d'état du script couvert par les tests.

## Usage/Examples
Pour lancer Jest et ainsi tester les scripts afin qu'ils retournent son résultat

```bash
npm run test
```

Pour un rendu graphique des résultats statistiques des tests
Il y a besoin d'accéder en locale au chemin de coverage

http://127.0.0.1:8080/coverage/lcov-report


![App Screenshot](https://raw.githubusercontent.com/leen1515/billed/main/bill-app/annexes/2-after-test-coverage.jpg)



L'avenir de cette application, ses mises à jour, l'experience des utilisateur, sont ainsi assurés gràce à une large couverture des tests sur son script

## License

OpenClassrooms

