FROM node:10.14.1

ENV USER=app

ENV SUBDIR=appDir

RUN useradd --user-group --create-home --shell /bin/false $USER &&\
    npm install --global npm

ENV HOME=/home/$USER

COPY package.json $HOME/$SUBDIR/

RUN chown -R $USER:$USER $HOME/*

USER $USER

WORKDIR $HOME/$SUBDIR

RUN npm install

RUN npm run tsc

CMD ["node", "dist/server.js"]