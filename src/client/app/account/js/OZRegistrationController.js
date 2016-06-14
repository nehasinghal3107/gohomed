/**
*Registration Controller : this controller handles call for user signup, regenrate token, verification & consumer verification.
*All the functions to make server side calls for this controller are wriiten in OZUserService.js and service name is UserSessionService. 
**/
angular.module('oz.UserApp')
  .controller('OZRegistrationController', ['$scope', '$rootScope', '$state', '$http', '$timeout', '$sce', '$log', 'UserSessionService', function($scope, $rootScope, $state, $http, $timeout, $sce, $log, UserSessionService) {
    
    // Declaration of variables and objects

    $scope.submitted = false;         // sets form submitted to false initially           
    $scope.consumer_verify_user = false;  
    $scope.verify_user = false;   
    regenerate_token = false;
    $scope.form = {};    // object to initialize forms
    $scope.user = {};    // data model for user signup
    $scope.verification = {};   // data model for user verification
    $scope.consumerverification = {};     // data model for consumer user verification
    $scope.regenerateverification = {};  // data model for regenerate token

    
    // -----------------------User registration:Signup----------------------------
    
    // Signup: function to clear form data on submit
    $scope.clearformData = function() {
      $scope.signupForm.$setPristine(); // manually sets form's property: pristine to be true. 
      $scope.signupForm.submitted = false;
      $scope.user.mobileno = '';
      $scope.user.username = '';
      $scope.user.firstname = '';
      $scope.user.email = '';
      $scope.user.password = '';
    }

    // function to send and stringify user data for signup Rest API
    $scope.jsonUserData = function(){
      var userData = 
      {
        user:
          {
            'mobileno' : $scope.user.mobileno,
            'email' : $scope.user.email,
            'password' : $scope.user.password,
            'firstname': $scope.user.firstname,
            'usertype' : 'provider'
          }  
      };
      return JSON.stringify(userData); // returns userData as JSON object
    } 

    // function to handle server side responses for signup
    $scope.handleSignupResponse = function(data){
      if (data.success) {
				$scope.clearformData(); // if signup is done successfully then clear form data
        $scope.verify_user = true;
        $('#VerifyToken').collapse('show');
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        $log.debug(data.error.message);
        $rootScope.OZNotify(data.error.message,'error');
      }
      $rootScope.hideSpinner();
    };
  
    // function call for signup
    $scope.signup = function() {   
      if ($scope.signupForm.$valid) { // checks if signup form submitted is valid
        $rootScope.showSpinner();
        $log.debug('User Data entered successfully');
        UserSessionService.signupUser($scope.jsonUserData()); // make call to service object which in turn will make call to signup REST API
      } else {
        $scope.signupForm.submitted = true;
      }
    }

    // if server side response is success then broadcast from service is listened here.
    var cleanupEventSignupDone = $scope.$on("signupDone", function(event, message){
      $log.debug(message);
      $scope.handleSignupResponse(message);      
    });

    // if server side response is failure then broadcast from service is listened here.
    var cleanupEventSignupNotDone = $scope.$on("signupNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    // -----------------------User verification----------------------------

    // function to send and stringify user verification data to Rest APIs
    $scope.jsonVerifyData = function(){
      var verifyData = 
      {
        'otp' : $scope.verification.token
      };
      return JSON.stringify(verifyData); 
    } 

    // function to handle server side responses
    $scope.handleVerificationResponse = function(data){
      if (data.success) {
        $scope.verify_user = false;
        $('#VerifyToken').collapse('hide');
        $rootScope.OZNotify(data.success.message,'success'); 
        UserSessionService.authSuccess(data.success.user);
      } else {
        $log.debug(data.error.message);
        $rootScope.OZNotify(data.error.message,'error');
      }
      $rootScope.hideSpinner();
    };
    
    // function call for user verification
    $scope.verify = function(){
      if ($scope.verificationForm.$valid) {
        $rootScope.showSpinner();
        $log.debug('OTP entered successfully');
        UserSessionService.verifyUser($scope.jsonVerifyData());
      } else {
        $scope.verificationForm.submitted = true;
      }
    }

    // if server side response is success then broadcast from service is listened here.
    var cleanupEventVerificationDone = $scope.$on("verificationDone", function(event, message){
      $log.debug(message);
      $scope.handleVerificationResponse(message);      
    });

    // if server side response is failure then broadcast from service is listened here.
    var cleanupEventVerificationNotDone = $scope.$on("verificationNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    // -----------------------Regenerate token----------------------------

    // function to send and stringify user token regenerate data to Rest APIs
    $scope.jsonTokenRegenerateData = function() {
      var Data = 
      {
        'mobileno' : '91' + $scope.regenerateverification.mobileno
      };
      return JSON.stringify(Data); 
    } 

    // function to handle server side responses
    $scope.handleRegenerateVerificationTokenResponse = function(data){
      if (data.success) {
        $log.debug(data.success.message);
        $('#RegenerateToken').collapse('hide');
        $scope.regenerate_token = false;
        $scope.regenerateverification = {};
        $scope.verify_user = true;
        $('#VerifyToken').collapse('show');
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        $log.debug(data.error.message);
        $rootScope.OZNotify(data.error.message,'error');
      }
      $rootScope.hideSpinner();
    };

    // function call for user to regenerate token if lost    
    $scope.regenrateToken = function(){
      if ($scope.form.regenerateVerificationForm.$valid) {
        $rootScope.showSpinner();
        $log.debug('OTP entered successfully');
        UserSessionService.regenerateTokenUser($scope.jsonTokenRegenerateData());
      } else {
        $scope.form.regenerateVerificationForm.submitted = true;
      }
    }

    // if server side response is success then broadcast from service is listened here.
    var cleanupEventRegenerateVerificationTokenDone = $scope.$on("regenerateTokenDone", function(event, message){
      $log.debug(message);
      $scope.handleRegenerateVerificationTokenResponse(message);      
    });

    // if server side response is failure then broadcast from service is listened here.
    var cleanupEventRegenerateVerificationTokenNotDone = $scope.$on("regenerateTokenNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    // $destroy: Removes the current scope (and all of its children) from the parent scope
    // It is called for cleaning up of $on scope listeners.
    $scope.$on('$destroy', function(event, message) {
      cleanupEventSignupDone();
      cleanupEventSignupNotDone();
      cleanupEventVerificationDone();
      cleanupEventVerificationNotDone();
      cleanupEventRegenerateVerificationTokenDone();
      cleanupEventRegenerateVerificationTokenNotDone();
    });

  }]);
 