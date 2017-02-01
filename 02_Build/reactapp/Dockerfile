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
