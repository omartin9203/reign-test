## Use a lighter version of Node as a parent image
#FROM mhart/alpine-node:14

## Set the working directory to /app
#WORKDIR /app
#
#ENV PATH /app/node_modules/.bin:$PATH
#
## copy package.json into the container at /app
#COPY package*.json /app/
#
## install dependencies
#RUN npm install --silent
#RUN npm install react-scripts -g --silent
#
## Copy the current directory contents into the container at /app
#COPY . /app/
#
## Make port 3000 available to the world outside this container
#EXPOSE 3000
#
## Run the app when the container launches
#CMD ["npm", "run", "start"]

# build environment
FROM node:14-alpine as build
WORKDIR /app
COPY . .
RUN npm install --silent
RUN npm install react-scripts -g --silent
RUN npm run build
# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
