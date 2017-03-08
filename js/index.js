
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
		document.getElementById("clock").innerHTML = h + ":" + m + ":" + s;
		t = setTimeout(function(){ 
			getTime()
		 }, 500);
	}
	getTime();
})();

//end clock