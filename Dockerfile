FROM node:0.10.33

COPY *.js *.json /data/
COPY app /data/app
COPY test /data/test
RUN cd /data && npm install
RUN git config --global url.https://github.com/.insteadOf git://github.com/
RUN cd /data && ./node_modules/.bin/bower --allow-root install
RUN cd /data && ./node_modules/.bin/grunt --force build

WORKDIR /data

EXPOSE 9000

CMD ["./node_modules/.bin/grunt", "serve"]
