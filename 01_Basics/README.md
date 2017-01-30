# Basics

## Overview
This section is dedicated to the basics of the docker-engine.  
We will run some images, stop, restart containers and test some images available on [dockerhub](https://hub.docker.com/).

## Steps

### Let's pull some images
To get started, let's run the following in our terminal:
```
$ docker pull alpine
```

The `pull` command fetches the alpine **image** from the **[dockerhub](https://hub.docker.com/) docker registry** and saves it in our system.

Use the `docker images` command to see a list of all images on your system.
```
$ docker images
REPOSITORY              TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
alpine                  latest              c51f86c28340        4 weeks ago         1.109 MB
hello-world             latest              690ed74de00f        5 months ago        960 B
```
You have now downloaded your first docker image, it's a tiny Linux distribution named *alpine* optimised for docker.

### Running your first containers
Now that we downloaded an image it's time to run some containers.  
Let's now run a Docker **container** based on this image. To do that you are going to use the `docker run` command.
```
$ docker run alpine ls -l
total 48
drwxr-xr-x    2 root     root          4096 Mar  2 16:20 bin
drwxr-xr-x    5 root     root           360 Mar 18 09:47 dev
drwxr-xr-x   13 root     root          4096 Mar 18 09:47 etc
drwxr-xr-x    2 root     root          4096 Mar  2 16:20 home
drwxr-xr-x    5 root     root          4096 Mar  2 16:20 lib
......
......
```
Behind the scenes, a lot of stuff happened. When you call `run` creates the container based on the image defined, *alpine* in this case, and then runs a command in that container (`ls -l`).  

Let's try something else.
```
$ docker run alpine echo "hello from alpine"
hello from alpine
```
In this case, the Docker client dutifully ran the `echo` command in our alpine container and then exited it.

Ok now, let's try to run a shell in that container.
```
$ docker run -i -t alpine sh
```
Let's focus on two thing :
 * the `-i -t` is the use of options from the `run` command to keep open the input stream of our console in the container and allocate a pseudo terminal. It allow us to send command and see results of the shell in your container.
 * the shell you'r in is in the container. Try some commands like `hostname`, `ifconfig` to see that you don't see your machine informations.

When you want `exit` the shell.

### Run a container in the background
You don't always have to run containers in the foreground.  
When you want to run a database, for example, in a container, you want to launch it in the background.

Let's start a **MySQL** database.
```
$ docker run -d -p 3300:3306 -e MYSQL_ROOT_PASSWORD=root mysql
```

`-d` is the option that allow to detach the container from your shell.  
`-p 3300:3306` is a port binding, it bind the port **3300** of your host to the port **3306** of the container.  
`-e MYSQL_ROOT_PASSWORD=root` is the definition of the environment variable in **MYSQL_ROOT_PASSWORD** is the container (in this case to set the mysql root password).  
Also note that the `pull` of the `mysql` image has been done automatically as the `mysql` image wasn't on your machine.

### Show running container
Now you know how to run containers in the background, the right question is : *How the hell can I know what is running in a running container ?*

```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
0f9efadd0778        mysql               "docker-entrypoint.sh"   2 seconds ago       Up 1 seconds        0.0.0.0:3300->3306/tcp   stoic_roentgen
```
You can see your running **MySQL** container, it's status and also some minimal informations like the port binding and the uptime.

Let's now add the option `-a` to the command.
```
$docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS                          PORTS                    NAMES
48c262f14407        mysql               "docker-entrypoint..."   4 seconds ago        Up 2 seconds                    0.0.0.0:3300->3306/tcp   silly_bose
71d85a4eeaf2        alpine              "sh"                     About a minute ago   Exited (0) 19 seconds ago                                zen_pike
9e522f5e7b13        alpine              "echo 'hello from ..."   About a minute ago   Exited (0) About a minute ago                            dazzling_thompson
d99dd89f3fca        alpine              "ls -l"                  About a minute ago   Exited (0) About a minute ago                            musing_curran
```
We see all the containers launched durant this workshop.  
But with the status exited for all the previous containers.

Let's try to restart the container with the shell !
```
$ docker start <container with sh command name|zen_pike here>

$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
48c262f14407        mysql               "docker-entrypoint..."   6 minutes ago       Up 6 minutes        0.0.0.0:3300->3306/tcp   silly_bose
71d85a4eeaf2        alpine              "sh"                     7 minutes ago       Up 40 seconds                                zen_pike
```
Well, seems like our container with a shell has started again !  
It's time to stop it again
```
$ docker stop <container with sh command name|zen_pike here>
```
We could also have `kill` it with the command `docker kill`. The kill is a more radical command that kill the process in the container, it should only be used when a stop isn't effective.

## Recap
 * `pull` : Download a docker image from a registry
 * `run`: Start a new container based on a image
 * `ps`: Show containers
 * `images`: List images available on the system
 * `start`: Start a existing container
 * `stop`: Stop a existing running container
 * `kill`: Kill a existing running container

## Exercise
Docker image to use :
 * [emilevauge/whoami](https://hub.docker.com/r/emilevauge/whoami/)
 * [postgres](https://hub.docker.com/_/postgres/)

Start a container of the `emilevauge/whoami` image with the port *80* of the container exposed as port *8000* of your host.  
Start a `postgres` container exposing the port *5432* as *5432* on your host and with a root password set to *password01*



Previous | Next
:------- | ---:
← [Introduction](..) | [Build](../02_Build) →
