FROM node:slim
WORKDIR /usr/app/acessivel

COPY . ./

RUN npm install

CMD [ "cd", "/usr/app/acessivel" ]
CMD [ "npm", "run", "start" ]