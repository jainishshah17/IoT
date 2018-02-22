FROM resin/raspberry-pi-alpine-node

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN pwd

RUN ls -alt
# Install app dependencies
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]