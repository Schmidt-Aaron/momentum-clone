
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

//start weather
(function (){
	//console.log("begin weather");
	var lat = "";
	var long = "";
	var wURL = "";

//location service is not great says I am three states away
	var location = $.getJSON("http://ipinfo.io/json");
	location.done(function(data){
		//console.log("start loc");
		tmp = data.loc.split(",");
		lat = tmp[0];
		long = tmp[1];
		//console.log(lat + "," + long);
		wURL ="http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=5a1518c003259fdaa613a1aa78664ff9&units=imperial";
		weather(); //fire weather 
	});

//build our weather object
//using openweathermap.api 
//might want to look for a different api... or obfuscate api ID
	function weather(){
		$.getJSON(wURL, function(data){
			//do the things with the weather data
			//console.log(data);
			var temp = data.main.temp;
			var condition = data.weather[0].main;
			//... add more
			//console.log(temp, condition);

			//asssign to document
			document.getElementById('temp').innerHTML = temp + "&deg;";
			document.getElementById('cond').innerHTML = condition;
			//console.log(condition);
			document.getElementById('icon').innerHTML = icon(condition);
		});

		//work in progress...
		//assign weather condition icons 
		//OWM conditions: http://openweathermap.org/weather-conditions
		//note that cases may not be correct
		function icon(type) { 
			switch(type) {
				
				case "partially sunny":
				return "<i class='wi wi-day-cloudy'></i>";

				case "Clouds":
				return "<i class='wi wi-cloudy'></i>";

				case "Rain":
				return "<i class='wi wi-rain'></i>";

				case "Clear":
				return "<i class='wi wi-day-sunny'></i>";;

				case "Snow":
				return "<i class='wi wi-snow'></i>";

				default:
					return "<i class='wi wi-na'></i>";
			}
		}
	}
})(); 
//end weather
//end clock

//start todo module

(function() {
	//global variable for database
	var db, input, ul;

	databaseOpen(function(){
		input = document.querySelector('#todo-input');
		ul = document.querySelector('ul');
		document.body.addEventListener('submit', onSubmit);
		document.body.addEventListener('click', onClick);
		console.log("database opened");
		databaseTodosGet(renderAllTodos);
	});

	function renderAllTodos(todos) {
		var html = '';
		todos.forEach(function(todo) {
			html += todoToHtml(todo);
		});
		ul.innerHTML = html;
	}

	function todoToHtml(todo) {
		return "<li data-index='" +todo.timeStamp+"'>" +todo.text+ "</li>";
	}

	function onSubmit(e) {
		e.preventDefault();
		databaseTodosAdd(input.value, function() {
			input.value = '';
			databaseTodosGet(renderAllTodos);
		});
	}

	function onClick(e) {
		//checks that the clicked element has a data-index attribute
		if(e.target.hasAttribute('data-index')) {

			//reset the index to a number because the DOM makes it a string
			databaseTodosDelete(parseInt(e.target.dataset.index, 10), function() {
				//refreshes the todo list
				databaseTodosGet(renderAllTodos);
			})
		}
	}

	function databaseOpen(callback) {
		//open database and assign name and version
		var version = 1;
		//using the users name as part of the database name
		var request = indexedDB.open('todos', version);

		request.onupgradeneeded = function(e) {
			db = e.target.result;
			e.target.transaction.onerror = databaseError;
			db.createObjectStore('todo', {keyPath: 'timeStamp'});
		};

		request.onsuccess = function(e) {
			db = e.target.result;
			callback();
		};

		request.onerror = databaseError;
	}

	function databaseTodosAdd(text, callback) {
		var transaction = db.transaction(['todo'], 'readwrite');
		var store = transaction.objectStore('todo');
		if(text){
			var request = store.put({
				text: text,
				timeStamp: Date.now()
			});
		}

		transaction.oncomplete = function(e) {
			callback();
		};

		request.onerror = databaseError;
	}

	function databaseTodosGet(callback) {
		var transaction = db.transaction(['todo'], 'readonly');
		var store = transaction.objectStore('todo');

		//get everything in the datastore
		var keyRange = IDBKeyRange.lowerBound(0);
		var cursorRequest = store.openCursor(keyRange);

		//onsuccess is fired once for every item collecting data in a array to pass at once
		var data = [];
		cursorRequest.onsuccess = function(e) {
			var result = e.target.result;

			//if there is data push to array
			if(result) {
				data.push(result.value);
				result.continue();

				//reach the end of  data
			} else {
				callback(data);
			}
		} 
		cursorRequest.onerror = databaseError;
	}

	function databaseTodosDelete(index, callback) {
		var transaction = db.transaction(['todo'], 'readwrite');
		var store = transaction.objectStore('todo');
		var request = store.delete(index);
		transaction.oncomplete = function(e) {
			callback();
		}
		request.onerror = databaseError;
	}

	function databaseError(e) {
		console.log('an IndexedDB error occurred ',  e)
	}
}());
//end todo