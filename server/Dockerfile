# stage 1 we need an image with the build tools (npm)
FROM node:9.5-alpine

# set the working directory in the image as "app"
WORKDIR /app

# copy in our package.json to restore our dependencies
COPY ./package.json .

# install the app dependencies
RUN npm install

# copy the rest of our code into the image
COPY . .

# Start the server when the container is created
CMD npm run start
