#!/bin/bash

TIMESTAMP=$(date +"%F_%H-%M")
BACKUP_DIR="/backup"
MYSQL_USER="user"
MYSQL_PASSWORD="admin"
MYSQL_HOST="mysql"
MYSQL_DB="bill_tracker"

mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/${MYSQL_DB}-${TIMESTAMP}.sql"
mysqldump -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DB" > "$BACKUP_FILE"
