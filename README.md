# Docker Introduction

This collection of exercises is designed to discover Docker or improve your skills, these exercises cover a range of topics from basic container creation to more advanced Docker features.

### Prerequisites

Connect to the practice lab:

- [Labs: Play with Docker](https://labs.play-with-docker.com/)

### I - First container

First, add a new instance in the lab to start working with Docker.
The following command will run a Docker container based on the Alpine Linux image and start an interactive shell (/bin/sh) within that container.
The -it option asks for an interactive terminal session inside the Docker container.
```bash
docker run -it alpine /bin/sh
```

You can check which Linux version you're using running that command:
```bash
cat /etc/os-released
```

Exit the interactive terminal:
```bash
exit
```

Check the list of running containers:
```bash
docker ls
```

Nothing is there, right? This is because when you ended the /bin/sh command, the container stopped. Now, let's try...
```bash
docker ls -a
```
You can see the exited container here.

### II - Deploying a web app

Now we will deploy a web app in a container.
First clone the github repo :
```bash
git clone https://github.com/DeschampsJ/docker
cd container
```

Now you have acces to the app files : app.js, package.json & Dockerfile
```bash
docker image build -t dockertuto:cpe .
```

```bash
docker container run -d --name web -p 8000:8080 dockertuto:cpe
```

You can try on the container the following commands:
```bash
docker container stop web
```
```bash
docker container start web
```
```bash
docker container rm web
```
If you wanna force remove a container you can use the -f option.

### III - Docker Swarm, a step into orchestration

Create 5 new instances to create a cluster.
We will set up 3 managers and 2 workers.

On the Node1 wich will be the leader:
Start by 
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
