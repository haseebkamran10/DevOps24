#!/bin/bash
until pg_isready -h "$1" -p "$2"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 2
done

>&2 echo "Postgres is up - executing command"
exec "$@"
