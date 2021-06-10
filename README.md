# MOVIE PROJECT
User guide of the- [movie project](http://13.238.217.15)
# Backend
## How to deploy
First clone the repository and navigate to `services/backend` and install all packages with `npm install` command.

To install serverless in your computer run the command -

`npm install -g serverless`

To deploy the service in aws lambda, run the command-

`sls deploy`

You can check the logs from cloud watch.

# Frontend
## How to deploy
To deploy the front end service in an ububtu EC2 instance, first clone the repository and install docker and docker-compose using the command below-

Docker:

`sudo apt-get install docker.io`

docker-compose

`sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`

`sudo chmod +x /usr/local/bin/docker-compose`

Then navigate to `services/frontend` and make the front end service up and running using this command-

`docker-compose up -d --build`

Now go to security group and allow all trafic in the inbound and outbound rules.