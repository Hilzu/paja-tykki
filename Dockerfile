FROM node:6

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /data

COPY package.json .
RUN npm install

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]
