FROM node:latest

MAINTAINER Francis Bota

ENV NODE_ENV=development

ENV PORT=8080

LABEL authors="FrancisBota"
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 8080

ENTRYPOINT ["npm", "start"]