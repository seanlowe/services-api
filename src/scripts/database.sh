#!/bin/bash

SERVER='seanlowe_takehome_server'
DB='kong_takehome'
PW='password'
USER='postgres'

# if $SERVER exists, stop, remove and rebuild
CONTAINER=$(docker container ls -a --format '{{.Names}} -- {{.Status}}' | grep $SERVER)
if [[ ! -z $CONTAINER ]] ; then
    echo "Existing container found"
    IS_RUNNING=$(echo $CONTAINER | grep -i 'up')
    if [[ ! -z $IS_RUNNING ]] ; then
        echo "Stopping $SERVER"
        docker container stop $SERVER
    fi

    echo "Removing $SERVER"
    docker container rm $SERVER
fi

# build the container
echo "Building a new container"
docker run -d -p 5432:5432 -e POSTGRES_USER=$USER -e POSTGRES_PASSWORD=$PW --name $SERVER postgres

echo "Waiting to make sure $SERVER is running before continuing"
SLEEP 3

echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres
