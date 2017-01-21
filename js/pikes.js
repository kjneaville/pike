'use strict';

angular.module("PikeApp", ['ngSanitize', 'ui.router', 'ui.bootstrap', 'firebase']) //ngSanitize for HTML displaying
.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', { //For homepage
		url: '/',
		templateUrl: 'partials/mainpartial.html',
		controller: 'MainCtrl'
	})
	.state('house', { //For house information page  
		url: '/House', 
		templateUrl: 'partials/house.html',
		controller: 'HouseCtrl'
	})
	.state('slag', { //For SLAG page   
		url: '/SLAG',
		templateUrl: 'partials/slag.html',
		controller: 'SlagCtrl'
	})
	.state('beta', {	//For Beta Beta chapter page		   
			url: '/Beta-Beta',
			templateUrl: 'partials/beta.html',
			controller: 'BetaCtrl'
	})
	.state('events', { //For events/calendar page		   
			url: '/Events',
			templateUrl: 'partials/events.html',
			controller: 'EventsCtrl'
	})
	.state('history', {		//For national history page	   
			url: '/History',
			templateUrl: 'partials/history.html',
			controller: 'HistCtrl'
	})
	.state('members', {	//For members page		   
			url: '/Members',
			templateUrl: 'partials/members.html',
			controller: 'MembersCtrl'
	})
	.state('recruit', {	//For recruitment page (requires Firebase)		   
			url: '/Recruitment',
			templateUrl: 'partials/recruit.html',
			controller: 'RecruitCtrl'
	})
	.state('contact', {	//For our contact information
			url: '/Contact_Us',
			templateUrl: 'partials/contact.html',
			controller: 'ContactCtrl'
	})
    .state('log', {  //For login page (requires Firebase)             
            url: '/Login',
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
    })
    .state('login', {  //For twitter page (requires Firebase)  
            url: '/Members-Area',        
            templateUrl: 'partials/memberlogin.html',
            controller: 'LoginCtrl'
    })
	$urlRouterProvider.otherwise('/'); //All invalid addresses route to homepage
})

.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
	var toggle = false;
	document.getElementById("nav").style.display = "none";

	$scope.hamburger = function() { //Hamgburger menu on displays less than 992
		if(toggle && $(window).width() <= 992) {
			toggle = false;
			document.getElementById("nav").style.display = "none";
		} else if(!toggle && $(window).width() <= 992) {
			toggle = true;
			document.getElementById("nav").style.display = "block";
		}
	}

}])

.controller('HouseCtrl', ['$scope', '$http', function($scope, $http) { 
//All these don't need code right now, but for future purposes it is best to set them up
}])

.controller('SlagCtrl', ['$scope', '$http', function($scope, $http) {
//All these don't need code right now, but for future purposes it is best to set them up
}])

.controller('BetaCtrl', ['$scope', '$http', function($scope, $http) {
//All these don't need code right now, but for future purposes it is best to set them up
}])

.controller('HistCtrl', ['$scope', '$http', function($scope, $http) {
//All these don't need code right now, but for future purposes it is best to set them up
}])

.controller('MembersCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('data/members.json').then(function(response) {  //Uses data in members.json to list all members
 		$scope.members = response.data;
 	});
}])

.controller('RecruitCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$http', function($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $http){
	var ref = new Firebase("https://pikappaalphabetabeta.firebaseio.com"); //Refer to our Firebase Application

  var formRef = ref.child('potential_new_members');
  $scope.rushee = $firebaseArray(formRef);

  $scope.checkEmail = function() { //Makes sure the email is a valid input
    	if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.Email)) {
    		$scope.rushForm.Email.$setValidity('Email', true);
        } else {
            $scope.rushForm.Email.$setValidity('Email', false);
        }
    }

    $scope.checkLast = function() { //Makes sure the last name field is not empty
    	if($scope.lastName.length >= 1) {
    		$scope.rushForm.lastName.$setValidity('lastName', true);
        } else {
            $scope.rushForm.lastName.$setValidity('lastName', false);
        }
    }

    $scope.checkFirst = function() { //Makes sure the first name field is not empty
        if($scope.lastName.length >= 1) {
            $scope.rushForm.lastName.$setValidity('fName', true);
        } else {
            $scope.rushForm.lastName.$setValidity('fName', false);
        }
    }
    $scope.submit = function() { //Add the information from the forms into our Firebase App
      $scope.rushee.$add({
             'FirstName': $scope.fName,
             'LastName': $scope.lastName,
             'Year': $scope.year,
             'School': $scope.school,
             'Phone' : $scope.phone,
             'Email' : $scope.Email,
             'TimeSubmitted' : Firebase.ServerValue.TIMESTAMP
        });
        alert('You have successfully submitted your information, the Beta Beta chapter will contact you shortly.');
        $scope.reset;
    }
    $scope.reset = function() { //Clear all user inputs into field
    	  document.getElementById("rushForm").reset();
        $scope.rushForm.$setPristine();
        $scope.rushForm.$setUntouched();
    }

}])

.controller('EventsCtrl', ['$scope', '$http', function($scope, $http){
//All these don't need code right now, but for future purposes it is best to set them up
}]) 

.controller('ContactCtrl', ['$scope', '$http', function($scope, $http) {
//All these don't need code right now, but for future purposes it is best to set them up
}])

.controller('LoginCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$location', '$uibModal', function($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $location, $uibModal) {

    var ref = new Firebase("https://pikappaalphabetabeta.firebaseio.com");

    var chirpsRef = ref.child('chirps'); //For each message/tweet users make
    var usersRef = ref.child('users'); //For the users being referred to

    $scope.chirps = $firebaseArray(chirpsRef);
    $scope.users = $firebaseObject(usersRef);

    var Auth = $firebaseAuth(ref);

    $scope.go = function (url) {
        $location.path(url);
    }

    $scope.newUser = {};

    $scope.signIn = function() { //This function overwrites an existing user with a new handle and default picture
      ref.authWithPassword({ //Checks to make sure the email and password are for valid user
          email    : $scope.newUser.email,
          password : $scope.newUser.password
        }, function(error, authData) {
          if (error) {
            alert("You must be a member of the Beta Beta chapter");
          } else { //If is a valid user
            $scope.signI;
            var newUserInfo = {
                'handle': $scope.newUser.handle, //Overwrite there existing handle (if any)
                'image': "img/profile.png", //And add the default picture
            }
            $scope.users[authData.uid] = newUserInfo;
            $scope.users.$save(); //Save to Firebase
            $scope.userId = authData.uid; 
            window.location.href = '#/Members-Area'; //Route them to the message/twitter area
          }
        }
        
      )
    }
    $scope.signI = function() {
      var promise = Auth.$authWithPassword({
        'email': $scope.newUser.email,
        'password': $scope.newUser.password
      });
      return promise;
    }
     $scope.savIn = function() { //For users who want to login in to an account without changing anything (handle or picture)
      ref.authWithPassword({
          email    : $scope.returnEmail,
          password : $scope.returnPass,
        }, function(error, authData) {
          if (error) {
            alert("You must be a member of the Beta Beta chapter");
          } else {
            $scope.signI;
            $scope.userId = authData.uid; 
            window.location.href = '#/Members-Area';
          }
        }
        
      )
    }
    $scope.logOut = function() {  //To log a user out and return to the login page
       Auth.$unauth(); //"unauthorize" to log out
       window.location.href = '#/Login';
    };

    //Any time auth status updates, set the userId so we know
    Auth.$onAuth(function(authData) {
       if(authData) { //if we are authorized
          $scope.userId = authData.uid;
       }
       else {
          $scope.userId = undefined;
       }
    });

    //Test if already logged in (when page load)
    var authData = Auth.$getAuth(); //get if we're authorized
    if(authData) {
       $scope.userId = authData.uid;
    }

    $scope.chirp = function(){ //Sends a message/tweet to firebase by adding and initializing it
      $scope.chirps.$add({
        text: $scope.newChirp,
        userId: $scope.userId,
        likes:0,
        dislikes:0,
        comments:0,
        time:Firebase.ServerValue.TIMESTAMP
      }).then(function(){
        $scope.newChirp = '';
      })
    }

    // Function to like a tweet
    $scope.like = function(chirp) { //Increase likes by 1
      if($scope.userId) {
        chirp.likes += 1;
        $scope.chirps.$save(chirp);

      }
    };
    $scope.dislike = function(chirp) { //Increase dislikes by 1
      if($scope.userId) {
        chirp.dislikes += 1;
        $scope.chirps.$save(chirp)
      }
    };
    $scope.openModal = function() { //Opens the modal saying that the order has been added to the shopping cart
      var modalInstance = $uibModal.open({ //establishes a new controller for the modal since only accessible through this one page
         templateUrl: 'partials/settings-modal.html',
         controller: 'SelectModalCtrl',
         scope: $scope //pass in all our scope variables!
      });
    }
}])
.controller('SelectModalCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$uibModalInstance', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth, $uibModalInstance) {
    //Controller for the modal created for Account Settings within the memberlogin partial
    var ref = new Firebase("https://pikappaalphabetabeta.firebaseio.com"); 

    var chirpsRef = ref.child('chirps'); //"chirps" object inside the JSON object
    var usersRef = ref.child('users');

    $scope.chirps = $firebaseArray(chirpsRef);
    $scope.users = $firebaseObject(usersRef);

    var Auth = $firebaseAuth(ref);

  $scope.changePass = function() { //Changes the user password within Firebase (must be logged in to access)
    ref.changePassword({
      email: $scope.upDate,
      oldPassword: $scope.upDate2,
      newPassword: $scope.upDate3,
    }, function(error) {
      if (error) {
        switch (error.code) {
          case "INVALID_PASSWORD":
            alert("The specified user account password is incorrect.");
            break;
          case "INVALID_USER":
            alert("The specified user account does not exist.");
            break;
          default:
            alert("Error changing password:", error);
        }
      } else {
        alert("You have successfully changed your password");
      }
    }
  )};
  $scope.changeHand = function() { //Changes the user handle
    var hopperRef = usersRef.child($scope.userId);
       hopperRef.update({
        'handle': $scope.handl,
      });
  }

  $scope.changePic = function() { //Changes the user picture to the URL they provide
    var hopperRef = usersRef.child($scope.userId);
       hopperRef.update({
        'image': $scope.picUrl,
      });
  }

  $scope.cancel = function () { //Makes the modal go away
     $uibModalInstance.dismiss('cancel');
  };
}])




