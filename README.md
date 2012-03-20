DeltaQL
-------

Imagine a database (like MySQL or SQLServer) whose 'result sets' automatically update as the underlying data changes.  Add to this a facility to extend these 'deltas' all the way to the browser.

Welcome to DeltaQL - no more F5, no more polling the DB.


Deliverables
------------

DeltaQL has five deliverables:

1. The Bootstrap App.  A minimal NodeJS web app with just one live page - ideal to build upon.

2. The Server Library.  This is written in Javascript for NodeJS and is used by both your NodeJS web applications and any (optional) separate databases.  DeltaQL can be run both in-process and as separate server process(es).

3. The Browser Library.  This runs on the browser and builds on top of KnockoutJS.

4. The eBook.  Income from this $9 ebook will support the development of DeltaQL.

5. The Blog App.  A working example of a web app built with DeltaQL, possibly demonstrating best practises.

All except the eBook will be available on GitHub under the MIT license.


Persistance
-----------

DeltaQL operates in memory.  It has hooks to add persistence to MySQL, Postgres or any other NodeJS supported database.  Use DeltaQL for all your 'live' clients, yet persist your data in a database which you trust.

The only built-in Persistor is the simple, but inefficient, JSONFilePersistor.  Any others will need to be written (for MySQL, etc.) but it's not hard.


Origins
-------

When I found myself solving the same 'data freshness' and pub/sub issues in NodeJS for the third time, I recognised it as a need and created the DeltaQL project.


Built on the Shoulders of Giants
--------------------------------

DeltaQL uses NodeJS, Express, Socket.IO, Mocha, KnockoutJS and much other uncredited work from the open source community.  Thanks to all of those who've made DeltaQL achievable in only tens-of-hours of design and coding.


Jargon
------

This may be useful if you start diving into the code.

* Lop - a List OPeration.  This is a delta which keeps a two ResultLists in sync.
* ResultList - an *ordered* list of rows.
* ResultSet - a set of rows.
* Row - a JSON object with an 'id' field containing an unique string (often a UUID) and zero or more further fields.
* Sop - a Set OPeration.  This is a delta which keeps a two ResultSets in sync.
* LivePage - any web page containing one or more ResultLists.

