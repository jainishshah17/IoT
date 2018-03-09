FROM resin/raspberry-pi-alpine-node

#RUN [ "cross-build-start" ]

# Enable OpenRC
#ENV INITSYSTEM on

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app
ENV PORT 3000

# Install app dependencies
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]