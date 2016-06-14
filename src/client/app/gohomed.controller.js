var app = angular.module('gohomed', []);

app.controller('MainCtrl', [ '$scope', function($scope){
  $scope.test = 'Hello world!';
}]);