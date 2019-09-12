FROM node:10

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install -g serverless
RUN npm install

COPY . /home/node/app

USER root

RUN curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
RUN unzip awscli-bundle.zip
RUN ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws

EXPOSE 4000

CMD ["sls", "offline"]