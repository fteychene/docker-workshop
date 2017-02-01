# Basics

## Overview
This section is dedicated to the build of your own docker images.
We will compile a web application, run it on our desk and push it to a docker registry.

## Steps

### Dive in the image (source [docker-labs](https://github.com/docker-training/labs/blob/master/beginner/chapters/webapps.md))
Docker images are the basis of containers. In the previous example, you pulled some images from the registry and asked the Docker client to run a container based on that image. To see the list of images that are available locally on your system, run the docker images command.
```
$ docker images
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
seqvence/static-site   latest              92a386b6e686        2 hours ago        190.5 MB
nginx                  latest              af4b3d7d5401        3 hours ago        190.5 MB
python                 2.7                 1c32174fd534        14 hours ago        676.8 MB
postgres               9.4                 88d845ac7a88        14 hours ago        263.6 MB
containous/traefik     latest              27b4e0c6b2fd        4 days ago          20.75 MB
node                   0.10                42426a5cba5f        6 days ago          633.7 MB
redis                  latest              4f5f397d4b7c        7 days ago          177.5 MB
mongo                  latest              467eb21035a8        7 days ago          309.7 MB
alpine                 3.3                 70c557e50ed6        8 days ago          4.794 MB
java                   7                   21f6ce84e43c        8 days ago          587.7 MB
```
Above is a list of images pulled from the registry and those created on my machine. You will have a different list of images on your machine. The TAG refers to a particular snapshot of the image and the ID is the corresponding unique identifier for that image.

For simplicity, you can think of an image akin to a git repository - images can be committed with changes and have multiple versions. When you do not provide a specific version number, the client defaults to latest.

For example you could pull a specific version of ubuntu image as follows:
```
$ docker pull ubuntu:12.04
```
If you do not specify the version number of the image then, as mentioned, the Docker client will default to a version named latest.

So for example, the docker pull command given below will pull an image named `ubuntu:latest`:
```
$ docker pull ubuntu
```
To get a new Docker image you can either get it from a registry (such as the Docker Hub) or create your own. There are hundreds of thousands of images available on Docker hub. You can also search for images directly from the command line using docker search.

An important distinction with regard to images is between base images and child images.

 * Base images are images that have no parent images, usually images with an OS like `ubuntu`, `alpine` or `debian`.
 * Child images are images that build on base images and add additional functionality.

Another key concept is the idea of official images and user images. (Both of which can be base images or child images.)

 * Official images are Docker sanctioned images. Docker, Inc. sponsors a dedicated team that is responsible for reviewing and publishing all Official Repositories content. This team works in collaboration with upstream software maintainers, security experts, and the broader Docker community. These are not prefixed by an organization or user name. In the list of images above, the `python`, `node`, `alpine` and `nginx` images are official (base) images. To find out more about them, check out the Official Images Documentation.
 * User images are images created and shared by users like you. They build on base images and add additional functionality. Typically these are formatted as user/image-name. The user value in the image name is your Docker Hub user or organization name.


## How to build an image
To build a docker image we use a [`Dockerfile`](https://docs.docker.com/engine/reference/builder/) that describe all the step from a base image to reach the desired state and provide all the needed informations to use it.

Here's a quick summary of the few basic commands we used in our Dockerfile.

 * `FROM` starts the Dockerfile. It is a requirement that the Dockerfile must start with the `FROM` command. Images are created in layers, which means you can use another image as the base image for your own. The `FROM` command defines your base layer. As arguments, it takes the name of the image. Optionally, you can add the Docker Hub username of the maintainer and image version, in the format `username/imagename:version`.
 * `RUN` is used to build up the Image you're creating. For each `RUN` command, Docker will run the command then create a new layer of the image. This way you can roll back your image to previous states easily. The syntax for a `RUN` instruction is to place the full text of the shell command after the RUN (e.g., `RUN mkdir /user/local/foo`). This will automatically run in a `/bin/sh` shell. You can define a different shell like this: `RUN /bin/bash -c 'mkdir /user/local/foo'`
 * `COPY` copies local files into the container.
 * `CMD` defines the commands that will run on the Image at start-up. Unlike a RUN, this does not create a new layer for the Image, but simply runs the command. There can only be one `CMD` per a Dockerfile/Image. If you need to run multiple commands, the best way to do that is to have the `CMD` run a script. `CMD` requires that you tell it where to run the command, unlike `RUN`. So example `CMD` commands would be:
 ```
  CMD ["python", "./app.py"]

  CMD ["/bin/bash", "echo", "Hello World"]
 ```
 * `EXPOSE` opens ports in your image to allow communication to the outside world when it runs in a container.

### Build your first image
We're going to build a static website served by a nginx server. The important thing to understand is that we will build a docker image that containers all the library needed to serve our static website, that means all the page but also the webserver to respond to http requests.  
To build this project we have to build this [`Dockerfile`](./staticsite/Dockerfile)
```dockerfile
# Define the base image to extend (in this case a nginx webserver on a alpine distribution)
FROM nginx:alpine

# RUN execute a shell command in the container
RUN echo 'Hi, I am in your container' \
    > /usr/share/nginx/html/index.html
```

To build the image you just have to add a Docker file oin a folder and launch the `docker build` command.
```
$ vi Dockerfile # edit the Dockerfile or download it from this repository
$ docker build -t local/staticwebsite .
Sending build context to Docker daemon 2.048 kB
Step 1/2 : FROM nginx:alpine
 ---> c24ab147adf9
Step 2/2 : RUN echo 'Hi, I am in your container'     > /usr/share/nginx/html/index.html
 ---> Running in b2c1552849a2
 ---> d3f37b380143
Removing intermediate container b2c1552849a2
Successfully built d3f37b380143
```
This command launch a build in docker in the current directory (by defining `.` as parameter) and `-t local/staticwebsite` tag the generated image with the name **local/staticwebsite**.  

You can now launch your generated website with `docker run -p 8000:80 -d local/staticwebsite`.

### A more complex image
Now we've seen how to build a simple image, we're going to build a more complex one.  
For example a React front-end available in the [reactapp](./reactapp) folder.

Go to the [reactapp](./reactapp) folder and look at the [Dockerfile](./reactapp/Dockerfile)
```
# Start from a base image with node 6 installed
FROM node:6-slim
# Register the container will have an app listening on port 3000 of the container
EXPOSE 3000
# Add source from the host folder in the container
ADD package.json /app/package.json
ADD src /app/src
ADD public /app/public
# Define the default working directory of the container
WORKDIR /app
# Run a npm install command to download all the libraries for the project
RUN npm install
# Define the command to be launched by the container when doing a docker run
CMD ["npm", "start"]
```
Note that it's an example and you should not do the same at home... please... really... compile it for production.

Build the application.
```
$ docker build -t local/reactapp .
Step 1/8 : FROM node:6-slim
 ---> 4d8411ec1363
Step 2/8 : EXPOSE 3000
 ---> Running in 07eb8907e09e
 ---> a00e0b9b85b9
Removing intermediate container 07eb8907e09e
Step 3/8 : ADD package.json /app/package.json
 ---> f208dbc011f3
Removing intermediate container e1ca6c6ffb34
Step 4/8 : ADD src /app/src
 ---> aa3d678d1f12
Removing intermediate container 9357d7d3491b
Step 5/8 : ADD public /app/public
...
...
npm info ok
 ---> e170f49180c9
Removing intermediate container 73474322b9e2
Step 8/8 : CMD npm start
 ---> Running in 7fa5345e715e
 ---> 7f768905ebed
Removing intermediate container 7fa5345e715e
Successfully built 7f768905ebed
```
The application wan now be run in a container by doing `docker run -p <port>:3000 local/reactapp`.  
We have created a container with a `node` installed and we injected our application to be launched inside. With the node included in the container, everybody with a docker on his machine can run your app.

### Push an image on a registry
Now we have build our own image, let's see how to push it and make it available.  
the most common way is to use the [DockerHub](https://hub.docker.com/) registry of Docker Inc but for our case we will launch a registry on your machine because it's a docker container :)

Let's start the `registry`:
```
$ docker run -d -p 5000:5000 --restart always --name registry registry:2
```
Ok now you have a docker registry running on your machine on port *5000*.  
To be able to push images on it we have to retag our local images to defined the registry we want to associate our image.
```
$ docker tag local/staticwebsite localhost:5000/local/staticwebsite
```
And now we just have to `push`.
```
$ docker push localhost:5000/local/staticwebsit
The push refers to a repository [localhost:5000/local/staticwebsit]
852275a9ae25: Pushed
49dd0a971ced: Pushed
8bc1567a538e: Pushed
af3e66087d79: Pushed
7cbcbac42c44: Pushed
latest: digest: sha256:d35a8630bff004fd1d7b2e9c4121ed586c1d012cd58f44f928ee23d5feb638d4 size: 1361
```
The image `local/staticwebsite` is now available to everyone that connect to your registry.


## Exercise
Try to dockerize one of your project.  
Check standard library on [DockerHub](https://hub.docker.com/) to find base image for your language and create an image of an app.

## References :
 * [Dockerfile reference](https://docs.docker.com/engine/reference/commandline/docker/)
 * [docker build reference](https://docs.docker.com/engine/reference/commandline/build/)



___

Previous | Next
:---: | :---:
← [Basics](../01_Basics) |  →
