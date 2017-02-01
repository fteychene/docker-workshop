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

### Multiple container of image
Now we have launched some containers, it's time to run multiple containers of the same image.
```
$ docker run -d -p 8000:80 --name whoami1 emilevauge/whoami
466f026965fbba51f1fb5232a1e1cd762dbf4a7371f636439528a89273b93266
$ docker run -d -p 8001:80 --name whoami1 emilevauge/whoami
43de1ad97a06a059c0292236309fea7f613527a48d0564422a473b6d71977644
```

Try to acces to the apps to see the differents informations for each container.
![display_whoami](./whoami.gif)

We can also check the running containers with a `docker ps`
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                  NAMES
43de1ad97a06        emilevauge/whoami   "/whoamI"           16 seconds ago      Up 15 seconds       0.0.0.0:8001->80/tcp   whoami1
466f026965fb        emilevauge/whoami   "/whoamI"           27 seconds ago      Up 26 seconds       0.0.0.0:8000->80/tcp   whoami2
```
Stop the containers and go to the [exercise section](#Exercise)

## Clean the containers
As you can see when running a `docker ps -a`, when a container stop or exit normally, it's not destroyed.  
It allow us to relaunch this container but while it's not running it still keep some space on your host. To delete these stopped containers you have to run `docker rm <container id>`.
```
$ docker stop whoami1
$ docker rm whoami1
```
Since Docker 1.13 there is also a way to clean the system of all the stopped containers by running a new command.
```
$ docker container prune
WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] y
Deleted Containers:
6fdb8fc3091a2728d9cdccdb69799a28048a4fc321a9f6544707a970b43ad85a
3eeb1d78da327c301c9a609db5f06a094ef26fcf961b296e2bc1f31e1702b149
cc8c94621bdfc91ef1fc78af224ad14aeec7b49ebe8ec32b41582c252bc6c240
f75e0c9bced9ee06b94dcd43caa68254617c6b9901dd5d08811086c28c41ec1e
e0bc0fd3a99cf95ade86f8dd8180f82ee118e7223bf83a1373195cc71da41954
fba72e6a770c5b12585eb8dbde673e1aa88446915f3a713dff58d9a7bc8f432d
d15e832bf5eacf07b9a8f066eadc973f123f3ad5b204fb40f422b5a8f222ca4d
adbf8c20806aaa2227071dec52e7553f1d58109fdcd4c347ba20ddf21e80cb60
41d29fd8bb1b42740239c1396581d97e7228121e77613d4b16d8c28834ea3611
6661a164a049742d339d4598bc74d45bacf65d0e758dcf2ee49f2291485d4e37

Total reclaimed space: 1.351 kB
```

## Recap
 * `pull` : Download a docker image from a registry
 * `run`: Start a new container based on a image
 * `ps`: Show containers
 * `images`: List images available on the system
 * `start`: Start a existing container
 * `stop`: Stop a existing running container
 * `kill`: Kill a existing running container
 * `rm` : Delete a container from the system

## Exercise
Docker image to use :
 * [nginx](https://hub.docker.com/_/nginx/)
 * [postgres](https://hub.docker.com/_/postgres/)

Start a container of the `nginx` image with the port *80* of the container exposed as port *8000* of your host.  
Start a `postgres` container exposing the port *5432* as *5432* on your host and with a root password set to *password01*

## References :
 * [docker CLI reference](https://docs.docker.com/engine/reference/commandline/docker/)
 * [docker run reference](https://docs.docker.com/engine/reference/run/)
 * [docker-engine documentation](https://docs.docker.com/engine/)


 ___

Previous | Next
:---: | :---:
← [Introduction](../../..) | [Build](../02_Build/) →
