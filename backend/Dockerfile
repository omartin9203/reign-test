## Use a lighter version of Node as a parent image
#FROM node:14-alpine AS builder
#
## Set the working directory to /app
#WORKDIR /app
#
## copy package.json into the container at /app
#COPY package*.json /app/
#
## install dependencies
#RUN npm install
#
## Copy the current directory contents into the container at /app
#COPY . /app/
#
## Make port 4000 available to the world outside this container
#EXPOSE 4000
#
## Run the app when the container launches
#CMD ["npm", "start"]

#
#FROM node:14-alpine AS builder
#
## Create the working directory, including the node_modules folder for the sake of assigning ownership in the next command
#RUN mkdir -p /app/node_modules
#
## For handling Kernel signals properly
#RUN apk add --no-cache tini
#
## Change ownership of the working directory to the node:node user:group
## This ensures that npm install can be executed successfully with the correct permissions
#RUN chown -R node:node /app
#
## Set the user to use when running this image
## Non previlage mode for better security (this user comes with official NodeJS image).
#USER node
#
## Set the default working directory for the app
## It is a best practice to use the /usr/src/app directory
#WORKDIR /app
#
## Copy package.json, package-lock.json
## Copying this separately prevents re-running npm install on every code change.
#COPY --chown=node:node package*.json .
#
## Install dependencies.
## RUN npm i -g @nestjs/cli
## RUN if [ "$NODE_ENV" = "development" ]; \
##       then npm install; \
##       else npm install --only=production; \
##       fi;
## RUN npm install;
#
## Necessary to run before adding application code to leverage Docker cache
## RUN npm cache clean --force
#
## Bundle app source
#COPY --chown=node:node . .
#
## Install dependencies.
## RUN npm i -g @nestjs/cli
## RUN if [ "$NODE_ENV" = "development" ]; \
##       then npm install; \
##       else npm install --only=production; \
##       fi;
#RUN rm -rf node_modules
#RUN npm install;
#RUN npm run build
#
## FROM node:14-alpine
#
#
## Set necessary environment variables.
#ENV PORT=4000 \
#    NPM_CONFIG_PREFIX=/home/node/.npm-global \
#    PATH=$PATH:/home/node/.npm-global/bin:/home/node/node_modules/.bin:$PATH
#
#
## Expose API port
#EXPOSE 4000
#
#ENTRYPOINT ["/sbin/tini", "--"]
#
## Run the web service on container startup
#CMD [ "npm","run", "start:prod" ]


FROM node:14-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]