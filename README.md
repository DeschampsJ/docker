# Docker Introduction

This collection of exercises is designed to discover Docker and containerization, these exercises cover a range of topics from basic container creation to more advanced Docker features.
  
## Prerequisites

Connect to the practice lab:

- [Labs: Play with Docker](https://labs.play-with-docker.com/)
> [!NOTE]
> You will need a personal Docker, Github or Google account.

> [!TIP]
> To paste in the lab use `ctrl+maj+v`.
> To copy in the lab use either `ctrl+fn+e` or `ctrl+fn+inser`

-----------------
## I - First container

Let's create our first container running a Linux image.  
Begin by adding a new instance in the lab to start working with Docker.
The following command will run a Docker container based on the Alpine Linux image and start an interactive shell `/bin/sh` within that container.
The `-it` option asks for an interactive terminal session inside the Docker container.
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

-----------------
## II - Deploying a web app

Now we will deploy a personalized web app in a container.
Previously we used the Alpine Linux image which was already built and included. We now have a javascript application so we need to build the image.
First clone the github repo:
```bash
git clone https://github.com/DeschampsJ/docker
cd container
```

You have now acces to the app files `app.js` & `package.json` alongside with the `Dockerfile`.
Let's build the web app image:
```bash
docker image build -t dockertuto:cpe .
```
The `-t` parameter specify a name and an optional tag for the image being built. The format is typically `<name>:<tag>`.
Do not forget the `.`, it specifies that the Dockerfile is in the current directory.

The following command will run a Docker container based on the image we just built.
```bash
docker container run -d --name web -p 8000:8080 dockertuto:cpe
```
The `-d` option is used to run a Docker container in detached mode, meaning that the container runs in the background, so you can keep using the terminal.  
We use `--name web` to name our running container which will allow us to simply run commands on it.  
We also need to specify which ports will be used with the `-p` option. Port 8000 on the host machine will be mapped to port 8080 on the Docker container. 

  
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

-----------------
## III - Docker Swarm, a step into orchestration

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
If you read the docker-compose.yml file, you'll notice that the line indicating which image to use is image: jlbw/docker-swarm-node-app:latest. I've previously pushed the application image to my Docker Hub repository (GitHub equivalent for Docker images). This configuration ensures that the image is pulled from Docker Hub whenever a container is deployed.  
It's important to note that Docker Swarm cannot build images as it deploys; thus, the application should be pre-built and tested before deployment.

You can try some of the basic commands:
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
**Access the web app by clicking the "3000" button now showing.**
If not, click "Open Port" and type "3000".

### Exercise 1: Rescaling the App in Docker Swarm

In this exercise, we'll explore how to dynamically adjust the number of replicas for a service in Docker Swarm to meet changing requirements.

1. Open the Docker Compose configuration file for editing on Node1:
    ```bash
    vi docker-compose.yml
    ```

   - **Quick Reminder for Vi:**
     - Press "i" to enter insertion mode.
     - Make your changes.
     - Press "Esc" to exit insertion mode.
     - Write changes and quit typing `:wq`.

2. Deploy the updated configuration to the Docker Swarm:
    ```bash
    docker stack deploy -c docker-compose.yml my-swarm-app
    ```
    
3. Verify that the Swarm has adapted to the changes:
    ```bash
    docker service ls
    docker stack ps my-swarm-app
    ```
  
### Exercise 2: Exploring Docker's Self-Healing in Docker Swarm
Let's explore Docker's self-healing capabilities. Docker Swarm automatically detects and replaces failed containers, ensuring continuous service availability.  
1. Find on which container is running your app on at the moment. Then go look in the worker nodes wich worker is running this one container.
    ```bash
    docker container ls
    ```
    
2. Delete the container:
    ```bash
    docker container rm <container_id> -f
    ```
    
3. Now observe the changes:
    ```bash
    docker container ls
    ```
    
You will notice that the Swarm automatically establishes a new container running the app to meet the specified number of replicas. 
After refreshing your web app, observe that it remains operational but on a different host and that your data (visit count) is intact.  
This self-healing capability is crucial for high availability and resilience in containerized environments.
