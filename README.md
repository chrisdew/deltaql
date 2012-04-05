Notice
------

This project is under heavy development and does not yet do anything other than pass some tests, and make the DeltaQL Bootstrap project work.

I'm currently working on the DeltaQL site web application, which will showcase many different queries across a half-dozen pages.


DeltaQL
-------

Imagine a database (like MySQL or SQLServer) whose 'result sets' automatically update as the underlying data changes.  Add to this a facility to extend these 'deltas' all the way to the browser.

The results of query, displayed in a web page.  They change when (and only when) a change the underlying data alters the result of a particular query.  All done *without* 're-executing' the query.

Welcome to DeltaQL - no more F5, no more polling the DB.


Using DeltaQL
-------------

DeltaQL systems begin with Silos.  These are simply unordered sets of rows, similar to a database.

Components, such as Filter, Join, Sort, Union and Head are used to build a query whose results can be displayed in a browser.

For example:

    var silo = new Silo();
    var users = silo.filter(function(row) { return row.table === 'users'; });
    var loggedIn = user.filter(function(row) { return row.loggedIn; });
    var numLoggedIn = loggedIn.count();

to send it to a browser, along with all later changes, it's as simple as:

    // render the page
    app.get('/', function(req, res) {
      var dqlSess = dql.register(req);
      dqlSess.add('users', users);
      dqlSess.add('numLoggedIn', numLoggedIn);
      res.render('index', { layout: 'layouts/base',
                            title: 'a DeltaQL page'
                            } );
    });

These components can be joined either in-process or via TCP connections.  As soon as an application is suspected of getting too busy for one NodeJS process, the Silo(s) can be moved out to their own process(es).

A TCP link is a simple as:

    // silo process
    var silo = new Silo();
    var users = silo.filter(function(row) { return row.table === 'users'; });
    silo.listen(1234, '127.0.0.1');
    users.listen(1235, '127.0.0.1');

    // web server process
    var loggedIn = remoteRSet(1235, '127.0.0.1').filter(function(row) { return row.loggedIn; });
    var numLoggedIn = loggedIn.count();

As demostrated above, frequently used filters can be placed in the silo process, to help limit unnecessary 

All updates are done to Silos, never to intermediate results, otherwise observering components further 'up' the tree (more accurately a DAG) would not see the change. 


Deliverables
------------

DeltaQL has five deliverables:

1. The Bootstrap App.  https://github.com/chrisdew/deltaql-bootstrap#readme  A minimal NodeJS web app with just one live page - ideal to build upon.

2. The Server Library.  This is written in Javascript for NodeJS and is used by both your NodeJS web applications and any (optional) separate databases.  DeltaQL can be run both in-process and as separate server process(es).

3. The Browser Library.  This runs on the browser and builds on top of KnockoutJS.

4. The Site App.  A working example of a web app built with DeltaQL, possibly demonstrating best practises.

All will be available on GitHub under the MIT license.


Persistance
-----------

DeltaQL operates in memory.  It has hooks to add persistence to MySQL, Postgres or any other NodeJS supported database.  Use DeltaQL for all your 'live' clients, yet persist your data in a database which you trust.

The two hooks are a 'save state' (i.e. on controlled shutdown) and a 'delta log' to recover data after a power outage.

Currently the only Persistor is the simple, but inefficient, JsonFilePersistor.


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
* Head - a transform from a ResultList to a possibly smaller ResultList
* Tail - a transform from a ResultList to a possibly smaller ResultList


Shortcommings
-------------

This project is about building something for people to play with and critique in a few tens of hours.

Some of the aspects of the project which could do with major improvement include:

* Testing - there is a test suite, but coverage is very far from 100%
* Examples - is would be good to have a whole directory of exmaples, rather than just a couple of example projects.
* IE - I'm not putting any effort into making anything work on IE, yet.  I expect to support IE8+ later.
* Persistors - Add code to save state in MySQL, Postgres.
* Protocol adapters, E.g.
  * Adapt an in-process SMTP server makes email available as a Silo.
  * How about IRC channels as Silos?
  * Perhaps a DNS server, serving data from a Silo, for locating RemoteRSet's ports and addresses via srv records?
  * Twitter/RSS feeds as Silos?
* Failover remote Silos - at some point there will be need to be master/slave replication for when a remote Silo's hardware breaks.  Could instead go with a more fine-grained event-oriented multi-master system.
* Webserver Affinity - At the moment the system relies on clients connecting back to the same server when using SocketIO.  At the moment I have disabled all awkward transports, such as websockets, as they break this design when used with a load balancer.  This needs to be solved, wither by better session affinity or storing dqlSessions in a remote Silo (rather than them being in-process).
* API documents - that would be nice
* Use https://github.com/chrisdew/multicast-eventemitter for RemoteRSets after the initial state has been gained via TCP - this would be hugely more efficient on local clusters.  (We could add a sequence number to the multicast packets, and trigger a full reload (after a random interval, to stop thundering herds) via TCP if a sequence number was missed.)
* Add some geospatial filters, i.e. isWithinPolygon(), or isWithinXMetres().
* Add some chronologically aware filters, i.e. arrivedWithinX() and rowFieldNotOlderThanX() - these require setTimeouts to be set to remove rows X after they arrive (or similar condition) - rather than polling.  I've done this before, so I know it's practical.  I've (due to a bug) once had a result set which introduced a 5 hour delay in sending data to browser, due to a MySQL backlog.  NodeJS is very resiliant with regard to callbacks and timeouts.
* Time should be milliseconds since epoch UTC, everywhere - let your browser-side code deal with its display (in localtime).
* Safety - at the moment most updates are done through simple event emitters.  These provide no feedback on (for example) failure to write to disk.
* Efficiency - E.g.
  * Pushing Filters Upstream - if a filter function captures no variables, and it has a remote parent, then it can be pushed across a network connection to reduce the number of number of ops sent over the wire.

These issues are all fixable, given a few weeks of work.  I'm not even going to think about that until I know that I'm solving a problem that exists for more than just me.


Licence
-------

DeltaQL is available under the MIT licence:

Copyright (C) 2012 Chris Dew.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
