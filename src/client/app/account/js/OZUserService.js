angular.module('oz.UserApp')
  .factory('UserSettingService', [
    '$resource',
    function ($resource) {
      var UserSettings = {
        MySettings: $resource('/api/user/:userid', {}, { GetMyUserSettings: { method: 'GET'} }),
        CheckIfUserLoggedin: $resource('/api/isloggedin', {}, { checkUserSession: { method: 'GET' } })
      }
      return UserSettings;
    }
  ])
  .factory('UserSessionService', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
    var UserService = {
        Signup: $resource('/api/user/signup', {}, { saveUser: { method: 'POST' } }),
        Verify: $resource('/api/verifyproviderrequest', {}, { verify_User: { method: 'POST' } }),
        Signin: $resource('/api/user/signin', {}, { signinUser: { method: 'POST' } }),
        ForgotPassword: $resource('/api/forgotpassword', {}, { forgot_Password: { method: 'POST' } }),
        ResetPassword: $resource('/api/resetpassword', {}, { reset_Password: { method: 'POST' } }),
        RegenerateToken: $resource('/api/regeneratesellerapptoken', {}, { regenerateToken: { method: 'POST' } }),
        IsUserLoggedin: $resource('/api/isloggedin', {}, { checkUserSession: { method: 'GET' } }),
        Logout: $resource('/api/logout', {}, { logoutUser: { method: 'GET' } }),
        Get_Static_Data: $resource('/api/statictemplates?type=:data&result=json', {}, { get_template: { method: 'GET', params: { data: '@data' } } }),
        UpdateSettings: $resource('/api/user/:userid', {}, { UpdateUserSettings: { method: 'PUT', params: { userid: '@userid' } } })
      };
    var session = {};
    session.isLoggedIn = false;
    session.currentUser = null;

    session.signupUser = function (userdata) {
      UserService.Signup.saveUser(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('signupDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('signupNotDone', error.status);
      });
    };
    session.verifyUser = function (userdata) {
      UserService.Verify.verify_User(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('verificationDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('verificationNotDone', error.status);
      });
    };
    session.signinUser = function (userdata) {
      UserService.Signin.signinUser(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('signinDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('signinNotDone', error.status);
      });
    };
    session.updateUserData = function (userData, $scope) {
      session.currentUserData = userData;
    };
    session.forgotPasswordUser = function (userdata) {
      UserService.ForgotPassword.forgot_Password(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('forgotPasswordDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('forgotPasswordNotDone', error.status);
      });
    };
    session.resetPasswordUser = function (userdata) {
      UserService.ResetPassword.reset_Password(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('resetPasswordDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('resetPasswordNotDone', error.status);
      });
    };
    session.regenerateTokenUser = function (userdata) {
      UserService.RegenerateToken.regenerateToken(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('regenerateTokenDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('regenerateTokenNotDone', error.status);
      });
    };
    session.init = function () {
      session.resetSession();
    };
    session.resetSession = function () {
      session.currentUser = null;
      session.isLoggedIn = false;
    };
    session.logoutUser = function () {
      UserService.Logout.logoutUser(function (success) {
        $log.debug(success);
        session.resetSession();
        $rootScope.$broadcast('logoutDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('logoutNotDone', error.status);
      });
    };
    session.authSuccess = function (userData, $scope) {
      session.currentUser = userData;
      session.isLoggedIn = true;
      $rootScope.$broadcast('session', userData);
    };
    session.authfailed = function () {
      session.resetSession();
    };

    session.checkUser = function () {
      UserService.IsUserLoggedin.checkUserSession(function (result) {
        $log.debug(result);
        if (result.success) {
          session.authSuccess(result.success.user);
        } else {
          session.authfailed();
        }
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('session-changed-failure', error.status);
      });
    };

    session.getStaticData = function(type){
      $log.debug(type);
      UserService.Get_Static_Data.get_template({data: type}, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('getStaticTemplateDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('getStaticTemplateNotDone', error.status);
      });
    };
    session.editUserSettings = function(userdata){
      UserService.UpdateSettings.UpdateUserSettings({userid: $rootScope.usersession.currentUser.userid}, userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('editUserSettingsDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('editUserSettingsNotDone', error.status);
      });
    };
    return session;
  }
]);
