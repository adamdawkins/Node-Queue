
/**
 * Module dependencies.
 */

var express = require('express');
require('mongodb');
var app = module.exports = express.createServer();
var QueueProvider = require('./models/queue.js').QueueProvider;
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var queueProvider = new QueueProvider();

var channel = function () {
	this.query = function (slug, since, callback){
			var i,
			people = [],
			callbacks = [],
			matching = [];
			
			queueProvider.find('slug', slug, function (error, queue) {
				people = queue.people
			});
			
			for(i = 0; i < people.length; i++) {
				var person = people[i];
				if(person.created_at > since){
					matching.push(person);
				} else {
					callbacks.push({callback: callback});
				}
			}
	}
};

// Routes
app.get('/', function (req, res){
	queueProvider.all(function (error, docs) {
		res.render('queues/index', {
			locals: {
				title: 'Queues',
				queues: docs
			}
		})
	});
});

// Show
app.get('/queues/:slug', function (req, res) {
	queueProvider.find('slug', req.params.slug, function (error, queue) {
		if (error) return next(error);
		res.render('queues/show', {
			locals: {
				title: 'Queue',
				queue: queue
			}
		});
	});
});

// New

app.get('/queue/new', function (req, res){
	res.render('queues/new', {
		locals: {
			title: 'New Queue'
		}
	})
});

// Create

app.post('/queue/new', function (req, res){
	queueProvider.save({
		creator: req.param('creator')
	}, function (error, docs) {
		res.redirect('/')
	});
});

// Join Queue
app.post('/queues/:slug', function (req, res) {
		queueProvider.find('slug', req.params.slug, function (error, queue) {
			if (error) return next(error);
			var person = {
				name: req.param('name'),
				description: req.param('description'),
				created_at: (new Date()),
				timestamp: (new Date()).getTime()
			};
			
			queueProvider.addPerson(queue._id, person, function (error, queue, person) {
					res.render('queues/show', {
						locals: {
							title: 'Queue',
							queue: queue
						}
					});
			});
			
		});
});

app.get('/json-people', function (req, res) {
	queueProvider.query(req.param('slug'), req.param('since'), function (people){
				res.send({people: people}, 200);
		});
	
});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
