# Basics

## Overview
This section is dedicated to the link anc communication between containers.

## Steps

### Link containers
To see how containers can work with others, we will launch a **MySQL** database in a container and connect to it from another container.
```
$ docker run -d -e MYSQL_ROOT_PASSWORD=root --name database mysql
```
Note that I haven't register the *3306* port of my container on my host.  
Since we will dicuss between containers, there is not need to expose the mysql database on my host.

Now, start another container of the `mysql` image linked to the running `database` container but with an interactive shell to connect to the running database.
```
$ docker run -it --link database mysql sh
# mysql -h database -p
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
...
...
mysql>
```
Connect to the database with password `root` as defined in env var of the *database* container.  
You can exit the shell and the container. What we need to focus on is that we just started a container with a mysql database running and we launched another container with a link to the database.  
By this way we had two containers communicating without any impact on our host.

Stop the containers :
```
$ docker stop database
$ docker rm database
```


### Networks
Another way to communicate between containers is by using the docker networks.  
You can try this feature by running the same example with network.
```
$ docker network create test_network
$ docker run -d -e MYSQL_ROOT_PASSWORD=root --net=test_network --name database mysql
$ docker run -it --net=test_network mysql sh
# mysql -h database -p
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
...
...
mysql>
```
The main advantage of the network is that you can attach on the fly containers to a network.  
Links are using by default environment variables and configuration in container where network use some feature external to the container.

## References :
 * [links](https://docs.docker.com/engine/userguide/networking/default_network/dockerlinks/)
 * [docker network](https://docs.docker.com/engine/userguide/networking/)



___

Previous | Next
:---: | :---:
← [Build](../02_Build) | [Compose](../04_Compose)  →
