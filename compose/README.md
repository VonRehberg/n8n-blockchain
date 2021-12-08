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

docker-compose -p node1 up -d
docker-compose -p node2 up -d
docker-compose -p node3 up -d

docker-compose -p node1 ps
docker-compose -p node2 ps
docker-compose -p node3 ps