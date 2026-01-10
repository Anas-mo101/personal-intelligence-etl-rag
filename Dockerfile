FROM node:18

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

# COPY .env ./
COPY src/ ./src/

EXPOSE 8050

CMD ["dockerize", "-wait", "tcp://db:6432", "/bin/bash","-c","chmod +x ./scripts/entrypoint.sh && ./scripts/entrypoint.sh"]
