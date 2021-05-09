FROM node as base
RUN mkdir /cache
WORKDIR /cache
COPY package*.json ./
COPY yarn.lock .

FROM base as production
ENV NODE_ENV=production
RUN npm ci
RUN mkdir /app
WORKDIR /app
CMD ["yarn", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN yarn
RUN mkdir /app
WORKDIR /app
CMD ["yarn", "dev"]
