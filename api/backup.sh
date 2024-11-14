#!/bin/bash

TIMESTAMP=$(date +"%F")  # Only include the date (YYYY-MM-DD)
BACKUP_DIR="/backup"
MYSQL_USER="user"
MYSQL_PASSWORD="admin"
MYSQL_HOST="88.222.245.88"
MYSQL_DB="bill_tracker"
LOG_FILE="/backup.log"

# Create the backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Log the start of the backup
echo "$(date +"%F %H:%M:%S") - Starting backup for database: $MYSQL_DB" >> "$LOG_FILE"

# Grant necessary privileges to the user
echo "$(date +"%F %H:%M:%S") - Granting privileges to user: $MYSQL_USER" >> "$LOG_FILE"
mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "
  GRANT PROCESS, SELECT, SHOW DATABASES, LOCK TABLES ON *.* TO '$MYSQL_USER'@'%';
  FLUSH PRIVILEGES;
"

# Define the backup file
BACKUP_FILE="$BACKUP_DIR/${MYSQL_DB}-${TIMESTAMP}.sql"

# Perform the MySQL dump
mysqldump -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DB" > "$BACKUP_FILE"

# Check if the backup was successful and log the result
if [ $? -eq 0 ]; then
  echo "$(date +"%F %H:%M:%S") - Backup completed successfully: $BACKUP_FILE" >> "$LOG_FILE"
else
  echo "$(date +"%F %H:%M:%S") - Backup failed: $BACKUP_FILE" >> "$LOG_FILE"
fi
