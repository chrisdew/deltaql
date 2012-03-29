Notice
------

This project is under heavy development and does not yet do anything other than pass some tests.


DeltaQL
-------

Imagine a database (like MySQL or SQLServer) whose 'result sets' automatically update as the underlying data changes.  Add to this a facility to extend these 'deltas' all the way to the browser.

That's right, the results of query, displayed in a web page which changes when (and only when) a change the underlying data alters the result of a particular query.

Welcome to DeltaQL - no more F5, no more polling the DB.



Deliverables
------------

DeltaQL has five deliverables:

1. The Bootstrap App.  https://github.com/chrisdew/deltaql-bootstrap#readme  A minimal NodeJS web app with just one live page - ideal to build upon.

2. The Server Library.  This is written in Javascript for NodeJS and is used by both your NodeJS web applications and any (optional) separate databases.  DeltaQL can be run both in-process and as separate server process(es).

3. The Browser Library.  This runs on the browser and builds on top of KnockoutJS.

4. The Blog App.  A working example of a web app built with DeltaQL, possibly demonstrating best practises.

All will be available on GitHub under the MIT license.


Persistance
-----------

DeltaQL operates in memory.  It has hooks to add persistence to MySQL, Postgres or any other NodeJS supported database.  Use DeltaQL for all your 'live' clients, yet persist your data in a database which you trust.

The two hooks are a 'save state' (i.e. on controlled shutdown) and a 'delta log' to recover data after a power outage.

The only built-in Persistor is the simple, but inefficient, JsonFilePersistor.  Any others will need to be written (for MySQL, Postgres, etc.) but it's not hard.


Origins
-------

When I found myself solving the same 'data freshness' and pub/sub issues in NodeJS for the third time, I recognised the need for a solution to the general case and so created the DeltaQL project.


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
* Filter - a transform from a ResultSet to a possibly smaller ResultSet
* Sort - a transform from a ResultSet to a ResultList
* Head - a transform from a ResultList to a possibly smaller ResiltList
* Tail - a transfrom from a ResultList to a possibly smaller ResultList


Licence
-------

DeltaQL is available under the MIT licence:

Copyright (C) 2012 Chris Dew.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
