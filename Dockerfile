FROM node:16-alpine AS build

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
        udev \
        ttf-freefont \
        chromium \
    && yarn add puppeteer@20.2.1

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:16-alpine AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
