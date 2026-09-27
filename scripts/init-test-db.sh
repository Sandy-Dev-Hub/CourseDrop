#!/bin/bash
# Creates the coursedrop_test database used by tests
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE coursedrop_test;
    GRANT ALL PRIVILEGES ON DATABASE coursedrop_test TO $POSTGRES_USER;
EOSQL
echo "Test database 'coursedrop_test' created."
