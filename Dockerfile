FROM node:16-alpine AS base

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

COPY . .

RUN yarn install && yarn build
EXPOSE 3000
CMD ["node", "dist/main"]

