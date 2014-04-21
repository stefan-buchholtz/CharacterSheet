#!/bin/bash

$LIQUIBASE_HOME/liquibase --changeLogFile=databasechangelog.xml --username=root --password= --url=jdbc:mysql://localhost/liquibase $@
