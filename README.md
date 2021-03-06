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



## CodeBuild
In this chapter, we'll configure CodeBuild for building Docker images.

### CodeBuild Setup

CodeBuild is a managed continuous integration service used for building and testing code.

Curious about the difference between continuous integration, continuous delivery, and continuous deployment? Check out the Continuous Delivery Explained guide.

Within the AWS Console, navigate to the CodeBuild dashboard and click **"Create Build Project"**.



Let's create a new project for building the Docker images.

#### Project configuration

    * "Project name" - web-app-build
    * "Description" - Build and deploy docker images
    * "Build badge" - check the flag to "Enable build badge"


#### Source

    * Use "GitHub" for the "Source provider". 
    * Select "Connect using OAuth", and click "Connect to Github" and allow access to your GitHub repos.
    * After authenticating, under "Repository", select "Repository in my GitHub account".  
    * Add the GitHub repository you created for this project.
    * Under "Additional configuration", check the box to "Report build statuses to source provider when your builds start and finish" under "Build Status".



Under "Primary source webhook events", check "Rebuild every time a code change is pushed to this repository". So, any time code is checked in, GitHub will ping the CodeBuild service, which will trigger a new build.

#### Environment
    * "Environment image" - use the "Managed image"
    * "Operating system" - "Ubuntu"
    * "Runtime" - "Standard"
    * "Image" - "aws/codebuild/standard:5.0"
    * "Image version" - "Always use the latest image for this runtime version"
    * "Privileged" - check the flag
    * "Service role" - "New service role"
    * "Role name" - webapp-build-role



Under "Additional configuration":

    * set the "Timeout" to 10 minutes
    * add your AWS account ID as an environment variable called AWS_ACCOUNT_ID in plaintext




#### Buildspec, Artifacts, and Logs
    * Under "Build specifications", select "Use a buildspec file"
    * Skip the "Artifacts" section
    * Dump the logs to "CloudWatch"



Click "Create build project". Once created, click "Start build" to trigger a new build.



#### Use the default build configuration.

This should fail since we have not added a buildspec file to the repo.

Scroll down to the logs. You should see the following, which indicates the build failed because the buildspec file does not exist.

Create the buildspec.yml file in the project root:

```
version: 0.2

env:
  variables:
    AWS_REGION: "ap-southeast-2"
    <!-- REACT_APP_API_SERVICE_URL: "http://localhost:5004" -->

phases:
  install:
    runtime-versions:
      docker: 18
  pre_build:
    commands:
      - echo logging in to ecr...
      - >
        aws ecr get-login-password --region $AWS_REGION \
          | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
  build:
    commands:
      - echo building images...
      - >
        docker build \
          -f services/frontend/Dockerfile \
          -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/frontend \
          ./services/frontend

  post_build:
    commands:
    - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/frontend:prod
   
```

Here, we authenticate the Docker CLI to use the ECR registry, build the Docker images, and push them to ECR.

Commit and push your code to GitHub to trigger a new build. This time you should see the following error as the service role, flask-react-build-role, does not have the correct permissions:

An error occurred (AccessDeniedException) when calling the GetAuthorizationToken operation:
User: <omitted> is not authorized to perform: ecr:GetAuthorizationToken on resource: *
To fix, add the AmazonEC2ContainerRegistryPowerUser policy to the service role in the IAM dashboard.


## Elastic Load Balancer

In the chapter, we'll add a load balancer to distribute traffic and create a more reliable app with automatic scaling and failover.


### ELB
The Elastic Load Balancer (ELB) distributes incoming application traffic and scales resources as needed to meet traffic needs.

A load balancer is one of (if not) the most important parts of your application since it needs to always be up, routing traffic to healthy services, and ready to scale at a moment???s notice.

### Load balancers:

    * Enable horizontal scaling
    * Improve throughput, which can help decrease latency
    * Prevent the overloading of a single service
    * Provide a framework for updating service on the fly
    * Improve tolerance for back-end failures
  
There are currently three types of Elastic Load Balancers to choose from. We???ll be using the Application Load Balancer since it works at layer 7 of the OSI networking model, so it's designed for web applications that accept HTTP and HTTPS traffic. It provides support for path-based routing and dynamic port-mapping and it also enables zero-downtime deployments and support for A/B testing. The Application Load Balancer is one of those AWS services that makes ECS so powerful. In fact, before it???s release, ECS was not a viable container orchestration solution.

##### Configure ALB
Navigate to Amazon EC2, click "Load Balancers" on the sidebar, and then click the "Create Load Balancer" button. Select the "Create" button under "Application Load Balancer".

##### Step 1: Configure Load Balancer

    * "Name": frontend
    * "Scheme": internet-facing
    * "IP address type": ipv4
    * "Listeners": HTTP / Port 80
    * "VPC": Select the default VPC to keep things simple
    * "Availability Zones": Select at least two available subnets

```
Availability Zones are clusters of data centers.
```


##### Step 2: Configure Security Groups
Select an existing Security Group or create a new Security Group (akin to a firewall) called default, making sure at least HTTP 80 and SSH 22 are open.

##### Step 3: Configure Routing
    * "Name": frontend-tg
    * "Target type": Instance
    * "Port": 80
    * "Path": /

##### Step 4: Register Targets

Do not assign any instances manually since this will be managed by ECS. Review and then create the new load balancer.



With that, we also need to set up Target Groups and Listeners:


#### Target Groups

Target Groups are attached to the Application Load Balancer and are used to route traffic to the containers found in the ECS Service.

You may not have noticed, but a Target Group called flask-react-client-tg was already created (which we'll use for the client app) when we set up the Application Load Balancer, so we just need to set up one more for the users service.

Within the EC2 Dashboard, click "Target Groups", and then create the following Target Group:

    "Target type": Instances
    "Target group name": frontend-tg
    "Port": 5000
    Then, under "Health check settings" set the "Path" to /.



You should now have the following Target Groups:


#### Listeners
Back on the "Load Balancers" page within the EC2 Dashboard, select the flask-react-alb Load Balancer, and then click the "Listeners" tab. Here, we can add Listeners to the load balancer, which are then forwarded to a specific Target Group.

There should already be a listener for "HTTP : 80". Click the "View/edit rules" link, and then insert a new rule that forwards to flask-react-users-tg with the following conditions: IF Path is /.
Update CodeBuild
Finally, navigate back to the Load Balancer and grab the "DNS name" from the "Description" tab:



Commit and push your code to trigger a new build. Make sure new images are added to ECR once the build is done.


## Elastic Container Service

Let's configure a Task Definition along with a Cluster and a Service within Elastic Container Service (ECS).

## ECS
ECS is a container orchestration system used for managing and deploying Docker-based containers.

It has four main components:

    * Task Definitions
    * Tasks
    * Services
    * Clusters
  

In short, Task Definitions are used to spin up Tasks that get assigned to a Service, which is then assigned to a Cluster.




### Task Definition

    * Task Definitions define which containers make up the overall app and how much resources are allocated to each container. 
    * You can think of them as blueprints, similar to a Docker Compose file.

Navigate to Amazon ECS, click "Task Definitions", and then click the button "Create new Task Definition". Then select "EC2" in the "Select launch type compatibility" screen.

#### Frontend

    * First, update the "Task Definition Name" to frontend-td and then add a new container:

    * "Container name": client
    * "Image": YOUR_AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com/test-frontend:latest
    * "Memory Limits (MB)": 300 soft limit
    * "Port mappings": 0 host, 80 container
    * We set the host port for the service to 0 so that a port is dynamically assigned when the Task is spun up.









## Cluster
Clusters are where the actual containers run. They are just groups of EC2 instances that run Docker containers managed by ECS. To create a Cluster, click "Clusters" on the ECS Console sidebar, and then click the "Create Cluster" button. Select "EC2 Linux + Networking".

Add:

    "Cluster name": flask-react-cluster
    "Provisioning Model": It's recommended to stick with On-Demand Instance instances, but feel free to use Spot if that's what you prefer.
    "EC2 instance type": t2.micro
    "Number of instances": 4
    "Key pair": Select an existing Key Pair or create a new one (see below for details on how to create a new Key Pair)


Select the default VPC and the previously created Security Group along with the appropriate subnets.


It will take a few minutes to set up the EC2 resources.

### Key Pair
To create a new EC2 Key Pair, so we can SSH into the EC2 instances managed by ECS, navigate to Amazon EC2, click "Key Pairs" on the sidebar, and then click the "Create Key Pair" button.

Name the new key pair ecs and add it to "~/.ssh".

### Service
Services instantiate the containers from the Task Definitions and run them on EC2 boxes within the ECS Cluster. Such instances are called Tasks. To define a Service, on the "Services" tab within the newly created Cluster, click "Create".

Create the following Services...

### Frontend

Configure service:

    "Launch type": EC2
    "Task Definition":
    "Family": flask-react-client-td
    "Revision: LATEST_REVISION_NUMBER
    "Service name": flask-react-frontend-service
    "Number of tasks": 1


Leave the "Deployment type" setting at Rolling update.

Review the Updating a Service guide to learn more about rolling vs blue/green deployments.

You can configure how and where new Tasks are placed in a Cluster via "Task Placement" Strategies. We will use the basic "AZ Balanced Spread" in this course, which spreads Tasks evenly across Availability Zones (AZ), and then within each AZ, Tasks are spread evenly among Instances. For more, review Amazon ECS Task Placement Strategies

Click "Next step".

### Configure network:

Select the "Application Load Balancer" under "Load balancer type".

"Load balancer name": flask-react-alb
"Container name : port": client:80:80




Click "Add to load balancer".

"Production listener port": 80:HTTP
"Target group name": frontend-tg


### Elastic Beanstalk

    $ eb init
    option selected: 8,2,default,y,1,y,
    $ eb create
    option selected: default,default,2n,y,t2.micro,enter