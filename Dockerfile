FROM node as base

WORKDIR /src
COPY package*.json /
COPY yarn.lock /

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["yarn", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN yarn
COPY . /
CMD ["yarn", "dev"]
