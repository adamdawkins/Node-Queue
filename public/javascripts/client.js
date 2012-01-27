var transmissionErrors = 0;

var CONFIG = {last_timestamp: 1}

function addPerson(person) {
	$('#people').append('<li class="person new" id="person_'+person._id+'"><span class="name"></span>'+person.name+'<span class="description">'+person.description+'</span></li>')
}

function poll(data) {
	var i;
	if(transmissionErrors > 4){
		console.error("stop polling, it's gone far too wrong.");
		alert("stop");
	} else {
	if (data){
		console.log(data.people);
		if (data && data.people) {
			for(i = 0; i < data.people.length; i++){
				var person = data.people[i];
				if (person.timestamp > CONFIG.last_timestamp){
					CONFIG.last_timestamp = person.timestamp;
				}
			if($('#person_'+person._id).length > 0){
					$('#person_'+person._id).addClass("exists");
				} else {
					addPerson(person);
				}
			}
	//		$('.person:not(.exists, .new)', $('#people')).addClass('old');
		}
	} 
		$.ajax({
			cache:false,
			type:'GET',
			url:'/json-people',
			dataType: 'json',
			data: {
				slug: 'john-norris',
				since: CONFIG.last_timestamp
				},
			error: function () {
				transmissionErrors+= 1;
				console.warn('something went tits up:'+transmissionErrors);
				setTimeout(poll, 3000);
			},
			success: function (data) {
				console.log("success");
				transmissionErrors = 0;
				poll(data);
			}
		});
}
};

$(document).ready(function(){
	poll();
});