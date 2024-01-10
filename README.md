# Docker Introduction

This collection of exercises is designed to discover Docker or improve your skills, these exercises cover a range of topics from basic container creation to more advanced Docker features.

### Prerequisites

Connect to the practice lab:

- [Labs: Play with Docker](https://labs.play-with-docker.com/)

### I - First container

```bash
docker run -it alpine /bin/sh
cat /etc/os-released
exit
docker ls -a
```

### II - Deploying a web app

```bash
mkdir app
cd app
docker image build -t dockertuto:cpe .
docker container run -d --name web -p 8000:8080 dockertuto:cpe
```
start/stop/rm

### III - Docker Swarm, a step into orchestration

Créer 5 instances

Node1 (leader) :
Git clone, cd swarm et 
	- docker swarm init --advertise-addr 192.168.x.xx (adresse de la node)
	- docker swarm join-token manager

Création d'un cluster : 
	- docker swarm join --token SWMTKN-…
-> 3 managers : join avec le token manager
-> 2 workers : join avec le token worker

Dans les deux workers :
Git clone et 
	- cd swarm
	- docker image build -t docker-swarm-node-app:latest .

Dans le leader :
	- docker node update --availability drain nodeX (1,2,3 les managers)
	- docker stack deploy -c docker-compose.yml my-swarm-app

Voir services :
	- docker service ls
	- docker node ls
	- docker stack ls

Voir web app (si pas affichée : open port 3000)

Idée exo :
	- modifier nb de replicas dans compose.yml et deploy puis voir les modif
	- Aller chercher dans les worker le container affiché dans la page web, le supprimer (docker container rm xxxx -f) et voir que la web app est toujours la avec le bon nombre de refresh et un nouveau container puis voir qu'un nouveau container a été créé pour garder le bon nombre de replica

TODO :
	- Faire un pdf/github pour les exercices
	- Code au propre
Pas avoir a build dans les workers (push sur mon dockerhub en public)![image](https://github.com/DeschampsJ/docker/assets/72499926/bc69df17-7473-4246-919d-e08aef9385a7)

