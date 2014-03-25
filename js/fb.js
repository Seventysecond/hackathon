  window.fbAsyncInit = function() {
  FB.init({
    appId      : '601657683254901',
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
  //get access token
            
  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
	  $.ajax({
		type: "POST",
		url: "login.php",
		data: {"user":response.authResponse.userID, "count":"1"},
		success: function(a){
		console.log(a);
		if(a == 'first'){	
			login_success(response.authResponse.userID);
		}
		},
		dataType: "text"
		});
	
		$(".fb-cont").hide();
	  testAPI(); 
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.       
	FB.login(function(response)
		{
		// login status response
		},{scope:"create_event,user_likes,user_subscriptions,publish_actions"});
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
      FB.login();
    }
  });
  };
  
  // Load the SDK asynchronously
  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
  }(document));

  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
  function login_success(uid){	
	FB.ui(
	{
	method: 'feed',
	name: '藝文通',
	link: 'http://140.113.134.159:1337/hackathon/home.html',
	picture: 'http://fbrell.com/f8.jpg',
	caption: '歡迎使用藝文通',
	description: '請善用這良好的推薦系統!!'
	}
	);
  }
  function createEvent(){
  var accessToken = FB.getAuthResponse()['accessToken'];
  FB.api('/me/events?access_token=' + accessToken,'post',{name:"JS-SDK Event",start_time:'2014/02/23',location:"Beirut"},function(resp) {
    console.log(accessToken);
	console.log(resp);
});}
  var userID;
  function testAPI() { 
      FB.api('/me', function(response) {
		console.log(response);
		userID = response.id;
		console.log(userID);
	  });
      FB.api('/me?fields=likes.limit(300).fields(talking_about_count,category,name)', function(response) {
      console.log(response);
	  var cate = new Array(response.likes.data.length);
	  
	  for (var i=0;i<cate.length;i++)
		{
			cate[i] = response.likes.data[i].category.toLowerCase();
		}
	  var artCate = [
			'Actor/Director',
			'Studio',
			'Album',
			'Song',
			'Musician/Band',
			'MusicVideo',
			'ConcertTour',
			'ConcertVenue',
			'RecordLabel',
			'MusicAward',
			'MusicChart',
			'Artist',
			'Comedian',
			'Entertainer',
			'Teacher',
			'Dancer',
			'Designer',
			'Photographer',
			'Bar',
			'Club',
			'Camera/Photo',
			'Clothing',
			'Patio/Garden',
			'Jewelry/Watches',
			'BabyGoods/KidsGoods',
			'Travel/Leisure',
			'Landmark',
			'Arts/Entertainment/Nightlife',
			'HomeImprovement',
			'Museum/ArtGallery',
		];
		var count = [
			[0,0,1,0],
			[0,1,0,0],
			[1,1,0,0],
			[1,0,0,0],
			[1,0,0,0],
			[1,0,0,0],
			[1,0,0,0],
			[1,0,0,0],
			[1,0,0,0],
			[1,0,0,0],
			[1,0,0,0],
			[0,1,1,0],
			[0,1,1,1],
			[0,1,1,1],
			[0,0,0,1],
			[0,0,1,0],
			[0,1,0,0],
			[0,1,0,0],
			[1,0,0,0],
			[1,0,0,0],
			[0,1,0,0],
			[0,1,0,0],
			[0,1,0,0],
			[0,1,0,0],
			[0,0,0,1],
			[0,1,0,0],
			[0,1,0,0],
			[1,1,1,0],
			[0,1,0,1],
			[0,1,0,0]
		];
		var artCount = [0, 0, 0, 0];
		for (var i=0;i<artCate.length;i++)
		{
			artCate[i] = artCate[i].toLowerCase();
		}
		var customname = new Array();
		for (var i=0;i<cate.length;i++)
		{
			for(var j=0;j< artCate.length;j++){
				if(cate[i] == artCate[j]){
					customname.push([response.likes.data[i].name ,
									response.likes.data[i].category,
									response.likes.data[i].talking_about_count]);
					for( var k = 0; k < 4; k++)
						artCount[k] = artCount[k] + count[j][k];
				}
			}
		}
		
		for (var i = customname.length; i >0; i--) {
			for (var j = 0; j < i-1; j++) {
				if (customname[j][1] < customname[j+1][1]) {
					// swap
					var swapping = customname[j + 1];
					customname[j + 1] = customname[j];
					customname[j] = swapping;
				};
			}
        
		};
		var splitName = new Array();
		for(var i =0;i < customname.length;i++){
		    var astr =  customname[i][0].split(/[ .,\-\(\)]+/);
			for(var j = 0; j < astr.length; ++j)
				splitName.push(astr[j]);
			if(astr.length > 1)
				splitName.push(customname[i][0]);
		}
		console.log(cate);
		console.log(customname);
		console.log(splitName);
		console.log(artCount);
		customQuery(splitName, artCount);
    });
  }
