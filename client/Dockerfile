# stage 1 we need an image with the build tools (npm)
FROM node:9.5-alpine AS build-env

# set the working directory in the image as "app"
WORKDIR /app

# copy in our package.json to restore our dependencies
COPY ./package.json .

# install the app dependencies
RUN npm install

# copy the rest of our code into the image
COPY . .

# create a production build of the vuejs app
RUN npm run build

# stage 2 we need a lean runtime optimized nginx image to run our app in
FROM nginx:1.12-alpine

# copy the compiled code from the /dist folder (where npm build output our code) of the "build stage" into this image
COPY --from=build-env ./app/dist /usr/share/nginx/html
