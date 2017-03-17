
// Begin google authentication code

var profile; //profile variable available at the global scope

function onSignIn(googleUser) {
	profile = googleUser.getBasicProfile();
  	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  	console.log('Name: ' + profile.getName());
  	console.log('Image URL: ' + profile.getImageUrl());
  	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	  });
}

// end google authentication code


//begin pretty backgrounds
//temp picture url. will look into better pics and/or resolution images later
//note not firing function just yet -- incomplete

function getPic(){
	var src = "https://source.unsplash.com/category/nature/1600x900/daily"
	document.getElementById('bkgd').style.backgroundImage = url(src);
}

//end pretty backgrounds

//start clock function
//test date.toLocalTimeString implementation 

(function() {

	function adjTime(i) {
		return (i < 10) ? "0" + i : i;
	}

	function getTime(){
		var today = new Date();
		var h = adjTime(today.getHours());
		var m = adjTime(today.getMinutes());
		var s = adjTime(today.getSeconds());
		//var time = today.toLocaleTimeString();
		document.getElementById("clock").innerHTML = h + ":" + m;
		t = setTimeout(function(){ 
			getTime()
		 }, 1000);
	}
	getTime();
})();

//end clock

//start quotes
(function() {
	var quotes = [
	{ quote: "If you think math is hard, try web design", credit: "Trish Parr" },
	{ quote: "There are three responses to a piece of design – yes, no, and WOW! Wow is the one to aim for", credit: "Milton Glaser" },
	{ quote: "Websites promote you 24/7. No employee will do that", credit: "Cameron Moll" },
	{ quote: "It’s through mistakes that you actually can grow. You have to get bad in order to get good", credit: "Paul Cookson" },
	{ quote: "If debugging is the process of removing software bugs, then programming must be the process of putting them in", credit: "Edsger Dijkstra" },
	{ quote: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight", credit: "Bill Gates" },
	{ quote: "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live", credit: "Martin Golding" },
	{ quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand", credit: "Martin Fowler" },
	{ quote: "One of my most productive days was throwing away 1000 lines of code", credit: "Ken Thompson" },
	{ quote: "When debugging, novices insert corrective code; experts remove defective code", credit: "Richard Pattis" },
	{ quote: "Most good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program", credit: "Linus Torvalds" },
	{ quote: "Before software can be reusable it first has to be usable", credit: "Ralph Johnson" },
	{ quote: "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the Universe trying to produce bigger and better idiots. So far, the Universe is winning", credit: "Rich Cook" }
	];
	var random = Math.floor(Math.random() * quotes.length);
	$("#quote").html("<p>" + quotes[random].quote + "<br>" + " --" + quotes[random].credit);


	$.ajax({
		cache: false,
		url: "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&jsonp=",
		dataType: "json",
		success: function(data){
			$("#quote").html(data[0].content + "--" + data[0].title);
		},
		error: function(err){
			$("#quote").html("<p>" + quotes[random].quote + "<br>" + " --" + quotes[random].credit);
		}
	});
	
})();
//end quotes