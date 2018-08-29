# Define from what image we want to build from. 
# we will use the latest LTS (long term support) version 8 of node.
FROM node:8
# Create app directory.
WORKDIR ./build
# Install app dependencies.
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+).
COPY package*.json ./
# If you are building your code for production.
# RUN npm install --only=production
RUN npm install
# Bundle app source code inside the Docker image.
COPY . .
# Bind the app to port 8080.
EXPOSE 8080
# Define the command to run your app using CMD which defines your runtime.
CMD [ "npm", "start" ]