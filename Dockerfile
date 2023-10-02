FROM docker.io/node:14.18.1-slim as builder
RUN apt-cache policy python
RUN apt-cache policy build-essential

COPY . /app
COPY ./src/custom-static /app/src/static
WORKDIR /app

RUN yarn install
RUN yarn run build

FROM docker.io/nginx:1.16.1-alpine

COPY docker/nginx.conf /etc/nginx/
COPY docker/entrypoint.sh /
RUN chmod 755 /entrypoint.sh
COPY config.template.json /etc/config.template.json
COPY --from=builder /app/dist /var/www/html
ENV ENABLE_HTTPS_FORCE=False

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx-daemon"]
