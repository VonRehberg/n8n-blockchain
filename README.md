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
docker-compose -p node1 up -t 20 -d
docker-compose -p node2 up -t 20 -d
docker-compose -p node3 up -t 20 -d

docker-compose -p node1 ps
docker-compose -p node2 ps
docker-compose -p node3 ps

docker-compose -p node1 stop
docker-compose -p node2 stop
docker-compose -p node3 stop

docker-compose -p node1 rm
docker-compose -p node2 rm
docker-compose -p node3 rm
```