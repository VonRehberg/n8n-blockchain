<<<<<<< HEAD
# n8n blockchain

Starts n8n blockchain node.


## Start

```
docker-compose up -d
```

To stop it execute:

```
docker-compose stop
```

## Configuration

The default name of the database, user and password for PostgreSQL can be changed in the [`.env`](.env) file in the current directory.

## Spinning up multiple nodes
```
=======
# NoCode Blockchain

This is a working blockchain implementation using the nocode tool [n8n](https://github.com/n8n-io/n8n).
It consists of 5 docker components:
- n8n as the core with administrative and protocol workflows
- postgresql (to store n8n workflows and execution details)
- mongodb (to store blockchain data like blocks, nodes and identities)
- nodejs to close the feature gap of n8n
- nginx (to overcome CORS issues in the web UI)

You can find a running demo [here](https://vonrehberg.consulting/blockchain).
![NoCode](https://user-images.githubusercontent.com/8611608/151714423-38d489b6-0ef6-45e3-a303-7011ffa5387f.png)

## Development / Starting a single node

Starting a single node can be achieved using the following commands
```
cd compose
docker-compose up -d
```
At first all docker images will be downloaded. Afterwards all single docker containers are started. Especially the n8n container will take some time to import the existing workflows.

In order to access n8n run
```
$ docker-compose ps
          Name                        Command               State           Ports
-----------------------------------------------------------------------------------------
compose_mongodb_1          docker-entrypoint.sh mongod      Up      27017/tcp
compose_n8n_1              tini -- /docker-entrypoint ...   Up      5678/tcp
compose_nginx_1            /docker-entrypoint.sh ngin ...   Up      0.0.0.0:61648->80/tcp
compose_nodeworkaround_1   docker-entrypoint.sh sh st ...   Up
compose_postgres_1         docker-entrypoint.sh postgres    Up      5432/tcp
```
Copy the nginx port (here it's 61648), open a browser and navigate to http://YOUR_IP:PORT (It's important to use your IP, localhost will not work)
Enter the username and password from the [`.env`](.env) file ( a / b ) and you will access the n8n UI.

![image](https://user-images.githubusercontent.com/8611608/151718016-e84123cc-0f72-4f51-b7bd-dbca89c69a34.png)

Now you can easily create new workflows or extend existing ones.
To synchronize your workflows into your filesystem / git repository open the workflow "11 - Backup Workflows" and execute it.
Afterwards you can commit the changes into your repository.

To stop and delete it execute:

```
docker-compose stop
docker-compose rm
```

In order to update a running node with the latest workflows from the repository just restart the n8n container.

## Spinning up multiple nodes
```
cd compose
docker-compose -p node1 up -t 20 -d
docker-compose -p node2 up -t 20 -d
docker-compose -p node3 up -t 20 -d

docker-compose -p node1 ps
docker-compose -p node2 ps
docker-compose -p node3 ps
```

To stop and delete all nodes run:
```
docker-compose -p node1 stop
docker-compose -p node2 stop
docker-compose -p node3 stop

docker-compose -p node1 rm
docker-compose -p node2 rm
docker-compose -p node3 rm
```

The simplest way to setup and connect the nodes is using the included UI (see the UI section below).
It's also possible to setup the nodes using the postman collection. In case you changed the default user and password, make sure you adapted the username and password variables of the collection accordingly.
Additionally you have to adapt the node IP addresses and ports.
![image](https://user-images.githubusercontent.com/8611608/151714461-e6f7a78b-7c94-4c34-b938-945b62b11492.png)


## Configuration

The default name of the database, user and password for PostgreSQL can be changed in the [`.env`](.env) file in the current directory.

## Starting the UI

In order to start the web UI open the console and run the following commands.
```
cd ui
npm install
npm start
```

Afterwards open your browser and navigate to http://localhost:4200
In order to connect to a node you have to type in the IP address (not localhost!) of your PC and the port of the first node.
You will find the port when running the following command:
```
docker-compose -p node1 ps
```
