#!/bin/sh
set -eu

datadir=/data/mysql
mkdir -p /run/mysqld "$datadir"
chown -R mysql:mysql /run/mysqld "$datadir"

if [ ! -d "$datadir/mysql" ]; then
  mariadb-install-db --user=mysql --datadir="$datadir" >/tmp/mariadb-install.log
fi

mariadbd --user=mysql --datadir="$datadir" --bind-address=127.0.0.1 --port=3306 \
  --socket=/run/mysqld/mysqld.sock \
  --pid-file=/run/mysqld/mysqld.pid \
  --innodb-buffer-pool-size=64M \
  --performance-schema=OFF \
  --skip-log-bin &

i=0
while [ "$i" -lt 60 ]; do
  if mariadb-admin --socket=/run/mysqld/mysqld.sock ping --silent; then
    break
  fi
  i=$((i + 1))
  sleep 1
done

if ! mariadb-admin --socket=/run/mysqld/mysqld.sock ping --silent; then
  echo "MariaDB no arrancó" >&2
  exit 1
fi

mariadb --socket=/run/mysqld/mysqld.sock -u root <<EOF
CREATE DATABASE IF NOT EXISTS \`POO_proyecto_ciencias\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'poo'@'127.0.0.1' IDENTIFIED BY '${MYSQL_APP_PASSWORD}';
ALTER USER 'poo'@'127.0.0.1' IDENTIFIED BY '${MYSQL_APP_PASSWORD}';
GRANT ALL PRIVILEGES ON \`POO_proyecto_ciencias\`.* TO 'poo'@'127.0.0.1';
FLUSH PRIVILEGES;
EOF

export DATABASE_URL="mysql://poo:${MYSQL_APP_PASSWORD}@127.0.0.1:3306/POO_proyecto_ciencias"
export SEED_IF_EMPTY=true
cd /app
npm run deploy:release
exec node dist/server.js
