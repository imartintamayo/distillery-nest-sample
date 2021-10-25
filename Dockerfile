FROM node:14.16.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install -g npm
RUN npm i -g @nestjs/cli
RUN npm install
RUN npm run prebuild
CMD [ "npm", "run", "start:dev" ]