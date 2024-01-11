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

There are some commands you can try on your container:
```bash
docker container stop web
```
```bash
docker container start web
```
```bash
docker container rm web
```
If you wanna remove a running container, you can force it using the -f option.

### III - Docker Swarm, a step into orchestration

Create 5 new instances to create a cluster.
We will set up 3 managers and 2 workers.

On the Node1 wich will be the leader:
Start by getting the Swarm files
```bash
git clone https://github.com/DeschampsJ/docker
cd docker 
cd swarm
```
First be sure you find the IP address wich will be used by your node to communicate with others. On this lab, it's the one starting by 192.168.
Then initialise the swarm with this address.
```bash
docker swarm init --advertise-addr 192.168.x.xx
```
By doing this, Docker will return you a command to use in other nodes to join the Swarm as workers.
Run it in Node 4 and Node 5:
```bash
docker swarm join --token SWMTKN-1-xxx
```
Now go back in the leader node and run the following command to get the manager token:
```bash
docker swarm join-token manager
```
Run the given command in Node 2 and Node 3 to make them join as managers.
```bash
docker swarm join --token SWMTKN-1-xxx
```
You have now configured a cluster with 3 managers and 2 workers.
Usually, you want the work to be done only by the workers, to achieve this run in a manager:
```bash
docker node update --availability drain node1
docker node update --availability drain node2
docker node update --availability drain node3
```
This will prevent the app to be deployed in the 3 managers.
The deployment is managed by a pre-written config file (.yml).
Run the following command:
```bash
docker stack deploy -c docker-compose.yml my-swarm-app
```
Dans les deux workers :
Git clone et 
	- cd swarm
	- docker image build -t docker-swarm-node-app:latest .

Try some of the basic commands:
```bash
docker service ls
```
```bash
docker node ls
```
```bash
docker stack ls
```
```bash
docker stack ps my-swarm-app
```
You can access the web app by clicking the "3000" button now showing.
If not, click "Open Port" and type "3000".

# Ex1
Let's say we need to rescale the app, the amount of replicas isn't enough.
On Node1, edit the config file to change that number and deploy it again.
```bash
vi docker-compose.yml
docker stack deploy -c docker-compose.yml my-swarm-app
```
(Quick reminder for vi: enter insertion mode with "i", do your changes then "esc" and write ":wq" to save and quit.)
Now go check that the Swarm adapted to your needs:
```bash
docker service ls
docker stack ps my-swarm-app
```

# Ex2
Let's observe self-healing now.
Find on which container is running you open webapp at the moment. Then go look in the worker nodes wich worker is running this one container.
```bash
docker container ls
```
Delete it:
```bash
docker container rm xxxx -f
```
Now let's see what happened:
```bash
docker container ls
```
You can observe that the Swarm automatically established a new container running the app to meet the specified number of replicas. 
After refreshing your web app, you'll notice that it is still operational but on a different host and that your data (visit count) remains intact.
