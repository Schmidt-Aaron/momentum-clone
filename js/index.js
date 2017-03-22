
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

//start todo module

(function() {
	//global variable for database
	var db, input, ul;

	databaseOpen(function(){
		input = document.querySelector('input');
		ul = document.querySelector('ul');
		document.body.addEventListener('submit', onSubmit);
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
		return "<li>" +todo.text+ "</li>";
	}

	function onSubmit(e) {
		e.preventDefault();
		databaseTodosAdd(input.value, function() {
			databaseTodosGet(renderAllTodos);
			input.value = '';
		});
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
		
		var request = store.put({
			text: text,
			timeStamp: Date.now()
		});

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
	}

	function databaseError(e) {
		console.log('an IndexedDB error occurred ',  e)
	}
}());
//end todo