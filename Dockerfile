FROM node as base
RUN mkdir -p /temp
WORKDIR /temp
COPY package*.json .
COPY yarn.lock .
RUN npm install --force -g yarn
RUN yarn
RUN mkdir -p /app
WORKDIR /app

FROM base as production
ENV NODE_ENV=production
COPY . .

FROM base as dev
ENV NODE_ENV=development
COPY . .
