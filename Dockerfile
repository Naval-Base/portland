FROM node:10-alpine

LABEL name "portland"
LABEL version "0.1.0"
LABEL maintainer "iCrawl <icrawltogo@gmail.com>"

WORKDIR /usr/src/portland

COPY package.json yarn.lock .yarnclean ./

RUN apk add --update \
&& apk add --no-cache --virtual .build-deps git curl \
\
&& yarn install \
\
&& apk del .build-deps

COPY . .

EXPOSE 9901

ENV NODE_ENV= \
	PORT= \
	MANGADEX_RSS= \
	DISCORD_TOKEN= \
	CLOUDINARY_URL=

CMD ["node", "src/index.js"]
