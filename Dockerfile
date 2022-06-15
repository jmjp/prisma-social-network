# Dockerfile

FROM node:16.15
ARG DB_URL
ENV DATABASE_URL ${DB_URL}
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN yarn install
EXPOSE 8080
CMD [ "yarn","start" ]
