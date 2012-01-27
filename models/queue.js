var queueCounter = 1;

QueueProvider = function (){};
QueueProvider.prototype.dummyData = [];
QueueProvider.prototype.callbacks = [];
QueueProvider.prototype.peopleCounter = 1;

QueueProvider.prototype.all = function (callback) {
	callback(null, this.dummyData);
};

QueueProvider.prototype.find = function (id, callback) {
	var i,
		result = null;
	for (i = 0; i < this.dummyData.length; i++) {
		if (this.dummyData[i]._id == id) {
			result = this.dummyData[i];
			break;
		}
	}
	
	callback(null, result);
}

QueueProvider.prototype.findWithIndex = function (id, callback) {
	var i,
		result = null;
	for (i = 0; i < this.dummyData.length; i++) {
		if (this.dummyData[i]._id == id) {
			result = this.dummyData[i];
			break;
		}
	}
	
	callback(null, result, i);
}

QueueProvider.prototype.find = function (property, value, callback) {
	var i,
		result = null;
	for (i = 0; i < this.dummyData.length; i++) {
		if (this.dummyData[i][property] == value) {
			result = this.dummyData[i];
			break;
		}
	}
	
	callback(null, result);
}


QueueProvider.prototype.save = function (queues, callback) {
	var i, j, slug
		queue = null,
		that = this;
	
	if (typeof(queues.length) == 'undefined') {
		queues = [queues];
	}
	
	for(i = 0; i < queues.length; i++) {
		queue = queues[i];
		queue._id = queueCounter++;
	 	queue.slug = queue.creator.replace(/^\s+|\s+$/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.toLowerCase();
		queue.callbacks = [];
		if(queue.created_at === undefined) queue.created_at = (new Date());
		queue.timestamp = (new Date()).getTime();
		if (queue.people === undefined) {
			queue.people = [];
		}
		
		for (j = 0; j < queue.people.length; j++) {
			queue.people[j]._id = QueueProvider.prototype.peopleCounter++;
			if(queue.people[j].created_at === undefined) queue.people[j].created_at = (new Date());
			queue.people[j].timestamp = (new Date()).getTime();
		}
		this.dummyData[this.dummyData.length] = queue;
	}
	callback(null, queues);
};

QueueProvider.prototype.addPerson = function (queue_id, person, callback) {
	var that = this;
	console.log(QueueProvider.prototype.peopleCounter);
	person._id = QueueProvider.prototype.peopleCounter++;
	this.findWithIndex(queue_id, function (error, queue, index){
		queue.people.push(person);
		that.dummyData[index] = queue;
		while (queue.callbacks.length > 0) {
	//		console.log('callback');
			queue.callbacks.shift().callback([person]);
		}
		callback(null, queue, person);
	});
};

QueueProvider.prototype.query = function (slug, since, callback) {

//	console.log('query(): {slug: '+slug+', since: '+since+'}');
	var i,
		matching = [],
		that = this,
		people = [],
		queue;
	this.find('slug', slug, function (error, q) {
		if(error) {
			console.error(error);
		} else {
			people = q.people;
			queue = q;
		}
	});
		
		
		for (i = 0; i < people.length; i++) {
			var person = people[i];
			if (person.timestamp > since){
				matching.push(person);
			}
		}
		
		if(matching.length > 0) {
			callback(matching);
		} else {
			queue.callbacks.push({timestamp: (new Date()), callback: callback})
		}
		


}



var people = []
for (var i = 0; i < 2; i++){
	people.push({name: 'Adam', description: 'help me'});
	people.push({name: 'Carlos', description: 'help me too'});
}

new QueueProvider().save([
	{	
		creator: 'John Norris',
		people: people
	},
	{	
		creator: 'Jamie Lawrence',
		people: [
			{name: 'Adam', description: 'help me'}
		]
	}
], function(error, queues){});

exports.QueueProvider = QueueProvider;