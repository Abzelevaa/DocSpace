#!/bin/bash

set -e

cat<<EOF

#######################################
#  INSTALL APP 
#######################################

EOF
apt-get -y update

if [ "$DOCUMENT_SERVER_INSTALLED" = "false" ]; then
	DS_PORT=${DS_PORT:-8083};

	DS_DB_HOST=localhost;
	DS_DB_NAME=$DS_COMMON_NAME;
	DS_DB_USER=$DS_COMMON_NAME;
	DS_DB_PWD=$DS_COMMON_NAME;
	
	DS_JWT_ENABLED=${DS_JWT_ENABLED:-true};
	DS_JWT_SECRET="$(cat /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)";
	DS_JWT_HEADER="AuthorizationJwt";

	if ! su - postgres -s /bin/bash -c "psql -lqt" | cut -d \| -f 1 | grep -q ${DS_DB_NAME}; then
		su - postgres -s /bin/bash -c "psql -c \"CREATE USER ${DS_DB_USER} WITH password '${DS_DB_PWD}';\""
		su - postgres -s /bin/bash -c "psql -c \"CREATE DATABASE ${DS_DB_NAME} OWNER ${DS_DB_USER};\""
	fi

	echo ${package_sysname}-documentserver $DS_COMMON_NAME/ds-port select $DS_PORT | sudo debconf-set-selections
	echo ${package_sysname}-documentserver $DS_COMMON_NAME/db-pwd select $DS_DB_PWD | sudo debconf-set-selections
	echo ${package_sysname}-documentserver $DS_COMMON_NAME/db-user select $DS_DB_USER | sudo debconf-set-selections
	echo ${package_sysname}-documentserver $DS_COMMON_NAME/db-name select $DS_DB_NAME | sudo debconf-set-selections
	echo ${package_sysname}-documentserver $DS_COMMON_NAME/jwt-enabled select ${DS_JWT_ENABLED} | sudo debconf-set-selections
	echo ${package_sysname}-documentserver $DS_COMMON_NAME/jwt-secret select ${DS_JWT_SECRET} | sudo debconf-set-selections
	echo ${package_sysname}-documentserver $DS_COMMON_NAME/jwt-header select ${DS_JWT_HEADER} | sudo debconf-set-selections
	
	apt-get install -yq ${package_sysname}-documentserver
elif [ "$UPDATE" = "true" ] && [ "$DOCUMENT_SERVER_INSTALLED" = "true" ]; then
	apt-get install -y --only-upgrade ${package_sysname}-documentserver
fi

if [ "$PRODUCT_INSTALLED" = "false" ]; then
	echo ${product} ${product}/db-pwd select $MYSQL_SERVER_PASS | sudo debconf-set-selections
	echo ${product} ${product}/db-user select $MYSQL_SERVER_USER | sudo debconf-set-selections
	echo ${product} ${product}/db-name select $MYSQL_SERVER_DB_NAME | sudo debconf-set-selections
	
	apt-get install -y ${product} || true #Fix error 'Failed to fetch'
	apt-get install -y ${product}
elif [ "$UPDATE" = "true" ] && [ "$PRODUCT_INSTALLED" = "true" ]; then
	apt-get install -o DPkg::options::="--force-confnew" -y --only-upgrade ${product} elasticsearch=${ELASTIC_VERSION}
fi

echo ""
echo "$RES_INSTALL_SUCCESS"
echo "$RES_QUESTIONS"
echo ""
