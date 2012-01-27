var Db = require ('mongodb/db').Db,
		ObjectID = require('mongodb/bson/bson').ObjectID,
		Server = require ('mongodb/connection').Server;
		
QueueProvider = function (host, port) {
	this.db = new Db('join-the-queue', new Server (host, port, {auto_reconnect: true}));
	this.db.open(function (){});
};

QueueProvider.prototype.getCollection = function (callback) {
	this.db.collection('queues', function (error, queue_collection) {
		if (error) {
			callback(error);
		} else {
			callback(null, queue_collection);
		}
	});
};

QueueProvider.prototype.findAll = function (callback) {
	this.getCollection(function (error, queue_collection) {
		if (error) {
			callback(error);
		} else {
			cursor.toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

QueueProvider.prototype.findById = function(id, callback) {
    this.getCollection(function (error, queue_collection) {
      if (error) {
				callback(error);
			} else {
        queue_collection.findOne({_id: ObjectID.createFromHexString(id)}, function (error, result) {
          if (error) {
						callback(error);
					} else {
						callback(null, result);
					}
        });
      }
    });
};

QueueProvider.prototype.save = function (queues, callback) {
	var i, j,
	queue = null;
	
	this.getCollection(function (error, queue_collection) {
		if (error) {
			callback(error);
		} else {
			if (typeof(queues.length) == 'undefined') {
				queues = [queues];
			}
	
			for(i = 0; i < queues.length; i++) {
				queue = queues[i];
				queue.created_at = new Date();
		
				if (queue.people === undefined) {
					queue.people = [];
				}
		
				for (j = 0; j < queue.people.length; j++) {
					queue.people[j].created_at = new Date();
				}
			}
					
			queue_collection.insert(queues, function () {
				callback(null, queues);
			});
		}
	});
};

exports.QueueProvider = QueueProvider;