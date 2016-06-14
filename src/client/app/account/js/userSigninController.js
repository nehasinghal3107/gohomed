/**
*Signin Controller : this controller handles call for user signin, password reset and forgot password.
*All the functions to make server side calls for this controller are wriiten in OZUserService.js and service name is UserSessionService. 
**/
angular.module('oz.UserApp')
 	.controller('OZSigninController', ['$scope', '$rootScope', '$state', '$timeout', '$stateParams', '$log', 'UserSessionService', function($scope, $rootScope, $state, $timeout, $stateParams, $log, UserSessionService) {
    $scope.submitted = false;  // form submit property is false
    $scope.reset_password = false;
    $scope.user = {}; // data model for user signin
    $scope.forgotpassword = { 'mobileno': ''}; // data model for forgot password
    $scope.resetPassword = {}; // data model for reset password

    // -----------------------User Signin----------------------------
    
    // Signin: function to clear form data on submit
    $scope.clearsigninformData = function() {
      $scope.signinForm.$setPristine(); // manually sets form's property: pristine to be true. 
      $scope.signinForm.submitted = false;
      $scope.user.mobileno = '';
      $scope.user.password = '';
    }

    // function to send and stringify user signin data to Rest APIs
    $scope.jsonUserSigninData = function() {
      var userSigninData = 
        {
          'mobileno' : $scope.user.mobileno,
          'password' : $scope.user.password,
          'usertype' : 'provider'
        };
      return JSON.stringify(userSigninData);  // returns userSigninData as JSON object
    }

    // function to handle server side responses
    $scope.handleSigninResponse = function(data){
      if (data.success) {
        $log.debug(data.success);
        $scope.clearsigninformData();    
        UserSessionService.authSuccess(data.success.user); // if signin is done successfully then make a call to service authSuccess function and send user object response with that with that
        $rootScope.OZNotify('Successful login !','success');
        $rootScope.signInStatus = 1;       
      } else { 
        if (data.error.code== 'AU005') {     // user does not exist
            $log.debug(data.error.code + " " + data.error.message);
            $rootScope.OZNotify(data.error.message,'error');             
        } else if (data.error.code=='AU002') {  // user password invalid
            $log.debug(data.error.code + " " + data.error.message);
           $rootScope.OZNotify(data.error.message,'error');

        } else if (data.error.code=='AV001') {  // enter valid data
            $log.debug(data.error.code + " " + data.error.message);
            $rootScope.OZNotify(data.error.message,'error');
        } else if (data.error.code=='AU006') {  // user signedin using OTP
            $log.debug(data.error.code + " " + data.error.message);
            $rootScope.OZNotify(data.error.message,'error');
        } else if (data.error.code=='AU003') {   // user has not verified
            $log.debug(data.error.code + " " + data.error.message);
            $rootScope.OZNotify(data.error.message,'error');
        } else if (data.error.code=='AS001') {   // user has not subscribed to any plan
            $log.debug(data.error.code + " " + data.error.message);
             $rootScope.OZNotify(data.error.message,'error');
        } else if (data.error.code=='AS002') { // user subscription expired
            $log.debug(data.error.code + " " + data.error.message);
             $rootScope.OZNotify(data.error.message,'error');
        } else if (data.error.code== 'AP001') {    // user has not done any payment
            $log.debug(data.error.code + " " + data.error.message);
             $rootScope.OZNotify(data.error.message,'error');
        } else {
            $log.debug(data.error.message);
             $rootScope.OZNotify(data.error.message,'error');

        }
      }
      $rootScope.hideSpinner();
    };  

    // function call for signin
    $scope.signin = function() {
      if ($scope.signinForm.$valid) { // checks if submitted for is valid 
        $rootScope.showSpinner();
        $log.debug('User Data entered successfully');
        $log.debug($scope.jsonUserSigninData());
        UserSessionService.signinUser($scope.jsonUserSigninData()); // if form is valid make a call to service which in turn will make a call to server side api for signin
      } else {
        $scope.signinForm.submitted = true;
      }
    }

    // if server side response is success then broadcast from service is listened here.
    var cleanupEventSigninDone = $scope.$on("signinDone", function(event, message){
      $scope.handleSigninResponse(message);
    });

    // if server side response is failure then broadcast from service is listened here.
    var cleanupEventSigninNotDone = $scope.$on("signinNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    }); 


    // -----------------------User Forgot Password----------------------------

    // Forgot Password: function to clear form data on submit
    $scope.clearforgotpasswordformData = function() {
      $scope.forgotPasswordForm.$setPristine();
      $scope.forgotPasswordForm.submitted = false;
       $scope.forgotpassword = { 'mobileno': ''};
    }

    // function to send and stringify user signin data to Rest APIs
    $scope.jsonForgotPasswordData = function()
    {
      var userData = 
        {
         'mobileno' : '91' + $scope.forgotpassword.mobileno,
         'usertype' : "provider"
        }
      return JSON.stringify(userData); 
    }

    // function to handle server side responses
    $scope.handleForgotPasswordResponse = function(data){
      if (data.success) {   
        $log.debug(data.success);
        $scope.clearforgotpasswordformData();
        $scope.reset_password = true;
        $rootScope.OZNotify(data.success.message,'success');
      } else {
        if (data.error.code== 'AV001') {     // enter valid data
            $log.debug(data.error.code + " " + data.error.message);
            // $scope.showAlert('alert-danger', data.error.message);
            $rootScope.OZNotify(data.error.message, 'error');
        } else if (data.error.code=='AV004') {  // enter prodonus registered emailid
            $log.debug(data.error.code + " " + data.error.message);
            // $scope.showAlert('alert-danger', data.error.message);
            $rootScope.OZNotify(data.error.message, 'error');
        } else if (data.error.code== 'AT001') {    // user has not done any payment
            $log.debug(data.error.code + " " + data.error.message);
            // $scope.showAlert('alert-danger', data.error.message);
            $rootScope.OZNotify(data.error.message, 'error');
        } else {
            $log.debug(data.error.message);
            // $scope.showAlert('alert-danger', data.error.message);
            $rootScope.OZNotify(data.error.message, 'error');
        }
      }
      $rootScope.hideSpinner();
    };  

    // function call for forgotpassword 
    $scope.forgotPassword = function() {
      if ($scope.forgotPasswordForm.$valid) {
        $rootScope.showSpinner();
        $log.debug('User Data entered successfully');
        $log.debug($scope.jsonForgotPasswordData());
        UserSessionService.forgotPasswordUser($scope.jsonForgotPasswordData());
      } else {
        $scope.forgotPasswordForm.submitted = true;
      }
    }

    // if server side response is success then broadcast from service is listened here.
    var cleanupEventForgotPasswordDone = $scope.$on("forgotPasswordDone", function(event, message){
      $scope.handleForgotPasswordResponse(message); 
    });

    // if server side response is failure then broadcast from service is listened here.
    var cleanupEventForgotPasswordNotDone = $scope.$on("forgotPasswordNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    // -----------------------User Resest Password----------------------------
    
    // Reset Password: function to clear form data on submit
    $scope.clearresetpasswordformData = function() {
      $scope.resetPasswordForm.$setPristine();
      $scope.resetPasswordForm.submitted = false;
      $scope.resetPassword = {'otp': ''};
    }
    
    // function to send and stringify user reset password data to Rest APIs
    $scope.jsonResetPasswordData = function()
      {
      var userData = 
          {
           'otp': $scope.resetPassword.token
          };
      return JSON.stringify(userData); 
      }
     

    // function to handle server side responses
    $scope.handleResetPasswordResponse = function(data){
      if (data.success) {
        $log.debug(data.success);
        $scope.clearresetpasswordformData();
        $scope.reset_password = false;
        $state.transitionTo('home.start');
        $rootScope.OZNotify(data.success.message,'success');
      } else {
        if (data.error.code== 'AV001') {     // enter valid data
            $log.debug(data.error.code + " " + data.error.message);
           $rootScope.OZNotify(data.error.message,'error');
        } else {
            $log.debug(data.error.message);
           $rootScope.OZNotify(data.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    };

    // function call for password reset 
    $scope.resetPassword = function() {
      if ($scope.resetPasswordForm.$valid) {
        $rootScope.showSpinner();
        UserSessionService.resetPasswordUser($scope.jsonResetPasswordData());
      } else {
        $scope.resetPasswordForm.submitted = true;
      }
    }

    // if server side response is success then broadcast from service is listened here.
    var cleanupEventResetPasswordDone = $scope.$on("resetPasswordDone", function(event, message){
      $scope.handleResetPasswordResponse(message);   
    });

    // if server side response is failure then broadcast from service is listened here.
    var cleanupEventResetPasswordNotDone = $scope.$on("resetPasswordNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    // $destroy: Removes the current scope (and all of its children) from the parent scope
    // It is called for cleaning up of $on scope listeners.
    $scope.$on('$destroy', function(event, message) {
      cleanupEventForgotPasswordDone();
      cleanupEventForgotPasswordNotDone();
      cleanupEventSigninDone(); 
      cleanupEventSigninNotDone(); 
      cleanupEventResetPasswordDone();
      cleanupEventResetPasswordNotDone();
    });

}]);
 