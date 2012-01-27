var queueCounter = 1;
var peopleCounter = 1;

QueueProvider = function (){};
QueueProvider.prototype.dummyData = [];

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
		queue = null;
	
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
		queue.created_at = (new Date()).getTime();
		
		if (queue.people === undefined) {
			queue.people = [];
		}
		
		for (j = 0; j < queue.people.length; j++) {
			queue.people[j]._id = peopleCounter++;
			if(queue.people[j].created_at === undefined) queue.people[j].created_at = (new Date()).getTime();
		}
		this.dummyData[this.dummyData.length] = queue;
	}
	callback(null, queues);
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