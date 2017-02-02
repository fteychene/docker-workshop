# Basics

## Overview
This section is dedicated to the tool `docker-compose` to manager multiple containers at the same time

## Steps

### Introduction to docker-compose
Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a Compose file to configure your application’s services. Then, using a single command, you create and start all the services from your configuration. To learn more about all the features of Compose see the list of features.

Compose is great for development, testing, and staging environments, as well as CI workflows. You can learn more about each case in Common Use Cases.

Using Compose is basically a three-step process.

1. Define your app’s environment with a Dockerfile so it can be reproduced anywhere.
2. Define the services that make up your app in docker-compose.yml so they can be run together in an isolated environment.
3. Lastly, run docker-compose up and Compose will start and run your entire app.

### Start a wordpress with compose
A wordpress stack is composed by a wordpress server and a mysql database linked to it.  
Theses two containers are linked together and `docker-compose` allow us to start it and define this stack easily.

We define the following [docker-compose.yml](./wordpress/docker-compose.yml) to start a wordpress and its database.
```
docker-compose up
```
You shall see the execution of the two containers database and worpress and you can access to the installation by accessing `localhost:8000`.  
![execution_wordpress](./wordpress/compose.gif)


## References :
 * [docker-compose.yml reference](https://docs.docker.com/compose/compose-file/)


___

Previous | Next
:---: | :---:
← [Link](../03_Link) |   →
