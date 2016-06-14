/**
*	User Signin Controller
**/
angular.module('oz.UserApp')
 	.controller('UserSettingController', ['$scope', '$rootScope', '$state', '$timeout', '$stateParams', '$log', 'UserSessionService', 'MyUserData', 'checkIfSessionExist', function($scope, $rootScope, $state, $timeout, $stateParams, $log, UserSessionService, MyUserData, checkIfSessionExist) {
    $scope.submitted = false;
    $scope.form = {};
    $scope.$state = $state;
    $scope.user_settings_data = {};
    $scope.user_data = {};
    $scope.user_edit = false;
    $scope.showSpinner = false;

    $scope.$watch('$state.$current.locals.globals.checkIfSessionExist', function (checkIfSessionExist) {
      if (checkIfSessionExist.error) {
        $rootScope.showModal();
      };
    });

    $scope.$watch('$state.$current.locals.globals.MyUserData', function (MyUserData) {
      $log.debug(MyUserData);
      if (MyUserData.success !== undefined && MyUserData.success.user !== undefined) {
        $scope.user_settings_data = angular.copy(MyUserData.success.user); 
        $scope.user_data = angular.copy(MyUserData.success.user); 
      } else {
        if(MyUserData.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $log.debug(MyUserData.error.message);
          $rootScope.OZNotify(MyUserData.error.message,'error');
        }
      }
    });

    $scope.cancelEditUser = function(){
      $scope.form.editUserSettingsForm.$setPristine();
      $scope.form.editUserSettingsForm.submitted = false;
      $scope.user_edit = false;
    }

    $scope.enableEditUser = function(userdata){
      $scope.user_settings_data = angular.copy(userdata);
      $scope.user_edit = true;
    }

    // function to send and stringify user reset password data to Rest APIs
    $scope.jsonEditUserSettingsData = function(){
      var user = 
      {
        userdata:
          {
            'firstname' : $scope.user_settings_data.firstname,
            'email' : $scope.user_settings_data.email,
            'location':{
              'address1': $scope.user_settings_data.location.address1,
              'address2': $scope.user_settings_data.location.address2,
              'area': $scope.user_settings_data.location.area,
              'city': $scope.user_settings_data.location.city,
              'country': $scope.user_settings_data.location.country,
              'state': $scope.user_settings_data.location.state,
              'zipcode': $scope.user_settings_data.location.zipcode
            }
          }  
      };
      if ($scope.user_settings_data.password !== null) {
        user.userdata.password = $scope.user_settings_data.password;
      };
      return JSON.stringify(user); 
    } 
     

    // function to handle server side responses
    $scope.handleEditUserSettingsResponse = function(data){
      if (data.success) {
        $log.debug(data.success);
        $scope.cancelEditUser();
        $state.reload();
        $rootScope.OZNotify(data.success.message,'success');
      } else {
        if(data.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $log.debug(data.error.message);
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    };

    // function for resetpassword to Prodonus App using REST APIs and performs form validation.
    $scope.editUser = function() {
      if ($scope.form.editUserSettingsForm.$dirty && $scope.form.editUserSettingsForm.$valid) {
        $rootScope.showSpinner();
        $log.debug($scope.jsonEditUserSettingsData());
        UserSessionService.editUserSettings($scope.jsonEditUserSettingsData());
      } else {
        $scope.form.editUserSettingsForm.submitted = true;
      }
    }

    var cleanupEventEditUserSettingsDone = $scope.$on("editUserSettingsDone", function(event, message){
      $scope.handleEditUserSettingsResponse(message);   
    });

    var cleanupEventEditUserSettingsNotDone = $scope.$on("editUserSettingsNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    $scope.$on('$destroy', function(event, message) {
      cleanupEventEditUserSettingsDone();
      cleanupEventEditUserSettingsNotDone();
    });

}]);
 