A simple node.js client for the EDDN service

## Introduction

This client subscribes to commodity messages published by EDDN-enabled tools. When commodity information is published for a particular station, the data is updated in simple MySQL table.

This client is not intended for production use; it is meant only as an example and proof-of-concept.

## Synopsis

Assumes bash and requires: git, node, npm & mysql

    $ git clone https://github.com/psema4/node-eddn-client
    $ cd node-eddn-client
    $ npm install
    $ mysql -u ${DBADMIN} -p < setup.sql
    $ node app.js

## License

MIT (see LICENSE)

## Issues

Found a bug? Something else? Please enter an issue at https://github.com/psema4/node-eddn-client/issues

## About EDDN
The Elite: Dangerous Data Network is a volunteer-driven network for sharing data from the Elite: Dangerous universe.

EDDN is not run by or affiliated with [Frontier Developments](http://www.frontier.co.uk/).

## EDDN Extras

* [Home](https://github.com/jamesremuscat/EDDN/wiki)
* [Discussion](https://forums.frontier.co.uk/showthread.php?t=5798)

