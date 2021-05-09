FROM node as base
RUN mkdir -p /app
WORKDIR /app
COPY . .

FROM base as production
ENV NODE_ENV=production

FROM base as dev
ENV NODE_ENV=development
